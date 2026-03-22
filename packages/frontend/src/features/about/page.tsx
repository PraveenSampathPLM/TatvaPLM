import { ExternalLink, Github, Globe, Package, Plug, Clock, IndianRupee } from "lucide-react";

/* ── Tatva Logo (inline SVG matching the app sidebar logo) ── */
function TatvaLogo({ size = 200 }: { size?: number }) {
  const h = Math.round((size / 320) * 72);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 72"
      width={size}
      height={h}
      fill="none"
    >
      <circle cx="36" cy="36" r="26" stroke="#E2E8F0" strokeWidth="1.5" />
      <circle cx="36" cy="10" r="7" fill="#FF9933" />
      <circle cx="58.5" cy="49" r="7" fill="#138808" />
      <circle cx="13.5" cy="49" r="7" fill="#1A237E" />
      <circle cx="36" cy="36" r="5" fill="#1A237E" />
      <circle cx="36" cy="36" r="2.5" fill="white" />
      <text x="82" y="30" fontFamily="'Inter','Arial',sans-serif" fontSize="28" fontWeight="900" letterSpacing="6" fill="#0F172A">TATVA</text>
      <text x="83" y="51" fontFamily="'Inter','Arial',sans-serif" fontSize="11" fontWeight="400" letterSpacing="2.5" fill="#64748B">PRODUCT LIFECYCLE MANAGEMENT</text>
      <line x1="83" y1="57" x2="310" y2="57" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ── India flag strip ── */
function FlagStrip() {
  return (
    <div className="flex h-1 w-16 overflow-hidden rounded-full">
      <div className="flex-1 bg-orange-400" />
      <div className="flex-1 bg-white border-y border-slate-100" />
      <div className="flex-1 bg-green-600" />
    </div>
  );
}

/* ── Stat card ── */
function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-white px-8 py-6 shadow-sm">
      <div className={`text-3xl font-bold tracking-tight ${accent ? "text-orange-500" : "text-slate-800"}`}>
        {value}
      </div>
      <div className="mt-1 text-center text-xs font-medium uppercase tracking-widest text-slate-400">
        {label}
      </div>
    </div>
  );
}

/* ── Tech pill ── */
function TechPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
      {label}
    </span>
  );
}

/* ── Module row ── */
function ModuleRow({ icon: Icon, name, desc }: { icon: React.ElementType; name: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        <Icon size={16} strokeWidth={1.7} />
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-800">{name}</div>
        <div className="mt-0.5 text-xs text-slate-500 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero banner ── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <TatvaLogo size={260} />
          </div>

          {/* Made in India badge */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <FlagStrip />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Made in India for the World
            </span>
            <FlagStrip />
          </div>

          {/* Headline */}
          <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-slate-900">
            The PLM platform process<br />industries actually deserve.
          </h1>
          <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-slate-500">
            <strong className="text-slate-700">Tatva</strong> (तत्त्व) means <em>essence</em> in Sanskrit — the fundamental nature of things.
            It's also what we built: the essential platform for process manufacturers.
          </p>

          {/* CTA links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="http://localhost:8899/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <Globe size={14} />
              Visit tatva.com
              <ExternalLink size={12} className="opacity-60" />
            </a>
            <a
              href="https://github.com/PraveenSampathPLM/TatvaPLM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Github size={14} />
              View on GitHub
              <ExternalLink size={12} className="opacity-40" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-12 px-6 py-12">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat value="10+" label="Integrated Modules" />
          <Stat value="6" label="ERP Connectors" />
          <Stat value="3" label="Label Standards" />
          <Stat value="Free" label="Implementation Included" accent />
        </div>

        {/* ── Made in India story ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <FlagStrip />
            <h2 className="text-lg font-bold text-slate-900">Made in India for the World</h2>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-slate-600">
            <p>
              India is the world's factory — home to thousands of food &amp; beverage, chemical, polymer,
              and CPG manufacturers who deserve world-class software. Not adapted tools from discrete
              manufacturing. Not enterprise SaaS with endless licensing fees and vendor lock-in.
            </p>
            <p>
              Tatva was built here, on the factory floor, for manufacturers everywhere. We started with
              a simple question: <em className="text-slate-800">"Why do R&amp;D teams still manage formulas in Excel?"</em> The
              answer wasn't a lack of tools — it was that no tool was built for how process manufacturers
              actually work.
            </p>
            <p>
              So we built one. Seat-based pricing. No proprietary database fees — Tatva runs on PostgreSQL,
              the world's most trusted open standard. Your data lives on your infrastructure, fully portable,
              fully yours. Formula management, stage-gate NPD, regulatory labeling, change control, ERP
              integration — unified in a single platform purpose-built for process industries.
            </p>
            <p className="font-medium text-slate-700">
              Transparent pricing. Free implementation. No lock-in. Yours forever. 🇮🇳
            </p>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Target Industries</p>
            <div className="flex flex-wrap gap-2">
              {["Food & Beverage", "CPG", "Chemical Manufacturing", "Polymer & Rubber", "Paint & Coatings", "Nutraceuticals", "Personal Care", "Tyre Industry"].map(i => (
                <span key={i} className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Regulatory Standards ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-slate-900">Built for Global Compliance</h2>
          <p className="mb-6 text-sm text-slate-500">
            Tatva's regulatory labeling engine supports the three major global frameworks out of the box.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { flag: "🇮🇳", name: "FSSAI", desc: "Food Safety and Standards Authority of India — ingredient declarations, allergen statements, and nutritional info per FSSAI guidelines." },
              { flag: "🇪🇺", name: "EU 1169 / 2011", desc: "European Union Food Information to Consumers Regulation — mandatory allergen highlighting and nutrition labelling per EU law." },
              { flag: "🇺🇸", name: "FDA / FSMA", desc: "US Food & Drug Administration — Nutrition Facts panel, serving size definitions, and mandatory allergen declarations." },
            ].map(s => (
              <div key={s.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 text-2xl">{s.flag}</div>
                <div className="mb-1 text-sm font-bold text-slate-800">{s.name}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Platform modules ── */}
        <div>
          <h2 className="mb-2 text-lg font-bold text-slate-900">Platform Modules</h2>
          <p className="mb-6 text-sm text-slate-500">12 integrated modules — all included in every seat, no per-module unlocks.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <ModuleRow icon={Package} name="Control Tower" desc="Real-time portfolio dashboard with KPIs, charts, and bottleneck visibility." />
            <ModuleRow icon={Package} name="Formula Management" desc="Multi-level versioned formulas with approval workflows and batch scaling." />
            <ModuleRow icon={Package} name="NPD Stage-Gate" desc="Discovery-to-Launch Kanban with configurable gate criteria and formal sign-offs." />
            <ModuleRow icon={Package} name="Change Control" desc="ECR/ECN workflows with affected object tracking and multi-role approvals." />
            <ModuleRow icon={Package} name="Release Management" desc="Package approved changes into numbered releases with readiness tracking." />
            <ModuleRow icon={Package} name="Regulatory Labeling" desc="Auto-generated FSSAI/EU/FDA labels from formula data with allergen detection." />
            <ModuleRow icon={Package} name="Digital Thread" desc="Hub-and-spoke product traceability connecting all linked assets." />
            <ModuleRow icon={Package} name="Specifications" desc="Parameter-based spec templates with min/max validation per material." />
            <ModuleRow icon={Plug} name="ERP Integration" desc="Native adapters for SAP S/4HANA, Oracle EBS, Dynamics 365, NetSuite and more." />
            <ModuleRow icon={Package} name="Artworks" desc="Manage label artwork files with version control and approval workflows." />
          </div>
        </div>

        {/* ── Technology Stack ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-slate-900">Technology Stack</h2>
          <p className="mb-5 text-sm text-slate-500">
            Built on a modern, industry-standard stack. No proprietary database fees. No cloud lock-in.
          </p>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {[
              { layer: "Frontend", tech: "React 18 · TypeScript · Vite · TailwindCSS · Tanstack Query" },
              { layer: "Backend",  tech: "Node.js 22 · Express · TypeScript · Zod validation" },
              { layer: "Database", tech: "PostgreSQL 16 · Prisma ORM · Redis 7 (caching)" },
              { layer: "Infra",    tech: "Docker Compose · Nginx reverse proxy · JWT auth" },
            ].map(t => (
              <div key={t.layer} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="mb-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">{t.layer}</div>
                <div className="text-sm text-slate-700">{t.tech}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {["React 18", "Node.js 22", "PostgreSQL 16", "Redis 7", "Docker", "Prisma ORM", "TypeScript", "Nginx", "Vite", "TailwindCSS"].map(t => (
              <TechPill key={t} label={t} />
            ))}
          </div>
        </div>

        {/* ── Pricing ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-slate-900">Transparent Pricing</h2>
          <p className="mb-6 text-sm text-slate-500">
            Pay per seat. All 12 modules included. Free implementation on every plan. No proprietary database fees — ever.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { tier: "Starter", price: "₹999", period: "/seat/mo", note: "Up to 10 seats", highlight: false,
                features: ["All 12 modules", "Free implementation", "Community support"] },
              { tier: "Professional", price: "₹1,999", period: "/seat/mo", note: "11–100 seats", highlight: true,
                features: ["Everything in Starter", "Dedicated implementation", "Priority support & SLA"] },
              { tier: "Enterprise", price: "Custom", period: "", note: "100+ seats", highlight: false,
                features: ["Everything in Professional", "White-label & SSO", "On-site training & 24×7 SLA"] },
            ].map(p => (
              <div key={p.tier} className={`rounded-xl border p-5 ${p.highlight ? "border-orange-400 bg-orange-50 ring-1 ring-orange-200" : "border-slate-100 bg-slate-50"}`}>
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500">{p.tier}</div>
                <div className="mb-0.5 text-2xl font-bold text-slate-900">{p.price}<span className="text-sm font-normal text-slate-400">{p.period}</span></div>
                <div className="mb-4 text-xs text-slate-400">{p.note}</div>
                <ul className="space-y-1.5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-0.5 text-orange-500 font-bold">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
            <strong className="text-slate-700">No database license fees.</strong> Tatva runs on PostgreSQL — fully portable, fully yours. All pricing in INR; USD/EUR equivalents available. Volume discounts available for 25+ seats.
          </p>
        </div>

        {/* ── Footer links ── */}
        <div className="flex flex-wrap items-center justify-center gap-6 border-t border-slate-200 pb-6 pt-8 text-sm text-slate-400">
          <a href="http://localhost:8899/index.html" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-slate-700">
            <Globe size={13} /> tatva.com
          </a>
          <a href="https://github.com/PraveenSampathPLM/TatvaPLM" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-slate-700">
            <Github size={13} /> GitHub
          </a>
          <a href="https://github.com/PraveenSampathPLM/TatvaPLM/blob/main/README.md" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-slate-700">
            <ExternalLink size={13} /> Documentation
          </a>
          <span className="text-slate-300">·</span>
          <span>Built with ❤️ in India 🇮🇳</span>
          <span className="text-slate-300">·</span>
          <span>Transparent seat-based pricing</span>
        </div>

      </div>
    </div>
  );
}
