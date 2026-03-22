/**
 * Tatva Marketing Video Builder v2
 * - Uses ElevenLabs MP3 as the audio track
 * - Scales scene durations to match audio length exactly
 * - Saves patched storyboard in website/ (not video-output/) so screenshots resolve correctly
 * - Records with Playwright then merges with ffmpeg
 */

const { chromium } = require('playwright');
const { execSync }  = require('child_process');
const fs            = require('fs');
const path          = require('path');

const ROOT   = '/Users/PraveenSampath/Documents/New project/PLM Project/website';
const OUT    = path.join(ROOT, 'video-output');
const BOARD  = path.join(ROOT, 'video-storyboard.html');
const FFMPEG = '/opt/homebrew/bin/ffmpeg';

// ElevenLabs audio — use the clean file (no " (1)")
const AUDIO = path.join(ROOT, 'ElevenLabs_2026-03-22T07_57_09_Liam - Energetic, Social Media Creator_pre_sp100_s50_sb75_v3.mp3');

// ── Get exact audio duration ──
const audioDuration = parseFloat(
  execSync(`/opt/homebrew/bin/ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${AUDIO}"`)
    .toString().trim()
);
console.log(`\nElevenLabs audio duration: ${audioDuration.toFixed(2)}s`);

// Original scene proportions (from previous timing analysis)
const PROPORTIONS = [0.0513, 0.1062, 0.1282, 0.1392, 0.1099, 0.1209, 0.1282, 0.1136, 0.1026];
// Scale each to match audio duration (leave 0.5s buffer at end)
const SCENES = PROPORTIONS.map((p, i) => ({
  id: i + 1,
  ms: Math.round(p * (audioDuration - 0.5) * 1000)
}));
// Ensure total exactly matches audio (absorb rounding into last scene)
const totalMs = SCENES.reduce((a, s) => a + s.ms, 0);
SCENES[SCENES.length - 1].ms += Math.round((audioDuration - 0.5) * 1000) - totalMs;
const TOTAL_MS = SCENES.reduce((a, s) => a + s.ms, 0);

console.log('\nScene durations:');
SCENES.forEach(s => console.log(`  Scene ${s.id}: ${(s.ms/1000).toFixed(2)}s`));
console.log(`  Total visual: ${(TOTAL_MS/1000).toFixed(2)}s`);

// ── Fix storyboard: save in website/ so screenshots/ relative path works ──
console.log('\n[1/3] Patching storyboard (scene durations + screenshot paths)...');
let html = fs.readFileSync(BOARD, 'utf8');
let sceneIdx = 0;
html = html.replace(/data-duration="\d+"/g, () => {
  const ms = SCENES[sceneIdx]?.ms ?? 9000;
  sceneIdx++;
  return `data-duration="${ms}"`;
});
// Save in website/ root so relative paths like screenshots/dashboard.png resolve correctly
const boardPatched = path.join(ROOT, 'storyboard-timed.html');
fs.writeFileSync(boardPatched, html);
console.log(`  Saved to: ${boardPatched}  ✓`);

// ── Record with Playwright ──
console.log(`\n[2/3] Recording storyboard (${(TOTAL_MS/1000).toFixed(0)}s)... please wait`);
(async () => {
  const browser = await chromium.launch({ headless: false });
  const context  = await browser.newContext({
    viewport:    { width: 1280, height: 720 },
    recordVideo: { dir: OUT, size: { width: 1280, height: 720 } }
  });
  const page = await context.newPage();

  // file:// from website/ root — screenshots/ will resolve correctly now
  await page.goto(`file://${boardPatched}`);

  // Wait for all scenes + 1s buffer
  await page.waitForTimeout(TOTAL_MS + 1000);

  await context.close();
  await browser.close();

  // Find the recorded WebM (newest file)
  const files = fs.readdirSync(OUT)
    .filter(f => f.endsWith('.webm'))
    .map(f => ({ f, t: fs.statSync(path.join(OUT, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);

  if (!files.length) { console.error('No WebM found!'); process.exit(1); }
  const webmPath = path.join(OUT, files[0].f);
  console.log(`  Visual: ${files[0].f}  ✓`);

  // ── Merge video + ElevenLabs audio ──
  console.log('\n[3/3] Merging video + ElevenLabs audio...');
  const finalMp4 = path.join(ROOT, 'tatva-marketing-video.mp4');
  execSync(
    `${FFMPEG} -y -i "${webmPath}" -i "${AUDIO}" ` +
    `-c:v libx264 -preset slow -crf 18 ` +
    `-c:a aac -b:a 192k ` +
    `-map 0:v:0 -map 1:a:0 ` +
    `-shortest "${finalMp4}" -loglevel error`
  );

  const size = (fs.statSync(finalMp4).size / 1024 / 1024).toFixed(1);
  console.log(`\n✅ Done!`);
  console.log(`   File:     ${finalMp4}`);
  console.log(`   Size:     ${size} MB`);
  console.log(`   Duration: ~${audioDuration.toFixed(0)}s`);
})();
