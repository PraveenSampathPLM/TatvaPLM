import PDFDocument from "pdfkit";
import { createWriteStream, mkdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STORAGE_DIR = join(__dirname, "..", "packages", "backend", "storage", "documents", "seed");

function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true });
}

// Generate a PDF and save to disk, returns file size in bytes
async function generatePdf(
  filePath: string,
  buildFn: (doc: typeof PDFDocument.prototype) => void
): Promise<number> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const stream = createWriteStream(filePath);
    doc.pipe(stream);
    buildFn(doc);
    doc.end();
    stream.on("finish", () => resolve(statSync(filePath).size));
    stream.on("error", reject);
  });
}

// ── PDF builder helpers ────────────────────────────────────────────────────

function addHeader(doc: any, title: string, docNumber: string, revision: string, company = "Tatva Industries Pvt. Ltd.") {
  doc.fillColor("#0F172A").fontSize(22).font("Helvetica-Bold").text(company, 50, 50);
  doc.moveTo(50, 80).lineTo(545, 80).strokeColor("#E2E8F0").stroke();
  doc.fillColor("#1D1D1F").fontSize(16).font("Helvetica-Bold").text(title, 50, 95);
  doc.fillColor("#6E6E73").fontSize(9).font("Helvetica").text(`Document No: ${docNumber}   |   Revision: ${revision}   |   Status: RELEASED   |   Date: ${new Date().toLocaleDateString("en-IN")}`, 50, 118);
  doc.moveTo(50, 135).lineTo(545, 135).strokeColor("#CBD5E1").lineWidth(0.5).stroke();
  doc.y = 148;
}

function addSectionHeading(doc: any, text: string) {
  doc.moveDown(0.5);
  doc.fillColor("#0F172A").fontSize(11).font("Helvetica-Bold").text(text, 50, doc.y);
  doc.moveTo(50, doc.y + 2).lineTo(545, doc.y + 2).strokeColor("#CBD5E1").lineWidth(0.5).stroke();
  doc.y += 8;
}

function addKeyValue(doc: any, key: string, value: string) {
  const y = doc.y;
  doc.fillColor("#6E6E73").fontSize(9).font("Helvetica-Bold").text(key + ":", 50, y, { width: 180 });
  doc.fillColor("#1D1D1F").fontSize(9).font("Helvetica").text(value, 240, y, { width: 305 });
  doc.y = Math.max(doc.y, y) + 14;
}

function addTable(doc: any, headers: string[], rows: string[][], colWidths: number[]) {
  const startX = 50;
  let y = doc.y + 5;
  const rowH = 18;

  // Header row
  doc.fillColor("#F1F5F9").rect(startX, y, colWidths.reduce((a, b) => a + b, 0), rowH).fill();
  let x = startX;
  headers.forEach((h, i) => {
    doc.fillColor("#0F172A").fontSize(8).font("Helvetica-Bold").text(h, x + 4, y + 4, { width: colWidths[i] - 8 });
    x += colWidths[i];
  });

  // Data rows
  rows.forEach((row, ri) => {
    y += rowH;
    if (ri % 2 === 0) {
      doc.fillColor("#F8FAFC").rect(startX, y, colWidths.reduce((a, b) => a + b, 0), rowH).fill();
    }
    x = startX;
    row.forEach((cell, ci) => {
      doc.fillColor("#1D1D1F").fontSize(8).font("Helvetica").text(cell, x + 4, y + 4, { width: colWidths[ci] - 8 });
      x += colWidths[ci];
    });
  });

  // Border
  doc.rect(startX, doc.y + 5, colWidths.reduce((a, b) => a + b, 0), rowH * (rows.length + 1)).strokeColor("#CBD5E1").lineWidth(0.5).stroke();
  doc.y = y + rowH + 10;
}

function addFooter(doc: any, docNumber: string) {
  const bottom = doc.page.height - 40;
  doc.moveTo(50, bottom - 10).lineTo(545, bottom - 10).strokeColor("#E2E8F0").lineWidth(0.5).stroke();
  doc.fillColor("#94A3B8").fontSize(7).font("Helvetica")
    .text(`${docNumber} — Confidential & Proprietary | Tatva PLM System | Unauthorized use prohibited`, 50, bottom - 5, { align: "center", width: 495 });
}

// ─── TDS Generator ───────────────────────────────────────────────────────────
function buildTDS(doc: any, data: { docNumber: string; title: string; productName: string; casNumber: string; properties: string[][]; applications: string[]; storage: string }) {
  addHeader(doc, `Technical Data Sheet\n${data.productName}`, data.docNumber, "1.0");
  addSectionHeading(doc, "1. Product Identification");
  addKeyValue(doc, "Product Name", data.productName);
  addKeyValue(doc, "Document Number", data.docNumber);
  addKeyValue(doc, "CAS Number", data.casNumber);
  addKeyValue(doc, "Product Group", data.title.replace("Technical Data Sheet — ", ""));
  addKeyValue(doc, "Prepared By", "Quality Assurance Department");
  addKeyValue(doc, "Approved By", "Technical Director");

  addSectionHeading(doc, "2. Physical & Chemical Properties");
  addTable(doc, ["Parameter", "Specification", "Typical Value", "Test Method"],
    data.properties, [160, 120, 130, 85]);

  addSectionHeading(doc, "3. Applications");
  doc.fillColor("#1D1D1F").fontSize(9).font("Helvetica");
  data.applications.forEach(app => {
    doc.text(`• ${app}`, 58, doc.y, { width: 487 });
    doc.y += 12;
  });

  addSectionHeading(doc, "4. Storage & Handling");
  doc.fillColor("#1D1D1F").fontSize(9).font("Helvetica").text(data.storage, 50, doc.y, { width: 495 });
  doc.moveDown(1);

  addSectionHeading(doc, "5. Revision History");
  addTable(doc, ["Rev", "Date", "Description", "Author"], [
    ["1.0", new Date().toLocaleDateString("en-IN"), "Initial release", "QA Department"]
  ], [60, 100, 240, 95]);

  addFooter(doc, data.docNumber);
}

// ─── SDS Generator ───────────────────────────────────────────────────────────
function buildSDS(doc: any, data: { docNumber: string; productName: string; hazardClass: string; casNumber: string; supplier: string }) {
  addHeader(doc, `Safety Data Sheet (GHS)\n${data.productName}`, data.docNumber, "1.0");

  const sections = [
    ["SECTION 1", "Identification", `Product: ${data.productName}\nSupplier: ${data.supplier}\nEmergency Tel: +91-1800-123-4567`],
    ["SECTION 2", "Hazard Identification", `GHS Classification: ${data.hazardClass}\nSignal Word: Warning\nHazard Statements: H302 — Harmful if swallowed. H315 — Causes skin irritation.`],
    ["SECTION 3", "Composition / Information on Ingredients", `CAS No: ${data.casNumber}\nEC No: See REACH registration\nPurity: ≥98%`],
    ["SECTION 4", "First-Aid Measures", "Inhalation: Move to fresh air. Skin: Wash with soap and water. Eyes: Rinse with water for 15 min. Ingestion: Do NOT induce vomiting; seek medical attention."],
    ["SECTION 5", "Fire-Fighting Measures", "Extinguishing media: CO2, dry powder, foam. Do NOT use water jet. Wear self-contained breathing apparatus."],
    ["SECTION 6", "Accidental Release Measures", "Contain spill with inert absorbent material. Transfer to labelled waste containers. Dispose per local regulations."],
    ["SECTION 7", "Handling & Storage", "Handle with appropriate PPE. Store in cool, dry, well-ventilated area. Keep away from ignition sources and incompatible materials."],
    ["SECTION 8", "Exposure Controls / PPE", "DNEL: 100 mg/m³ (inhalation, worker). Use nitrile gloves, safety spectacles, lab coat. Local exhaust ventilation recommended."],
    ["SECTION 9", "Physical & Chemical Properties", "Form: Liquid/Solid (see TDS). Odour: Characteristic. Solubility: Miscible with water. Flash Point: See TDS."],
    ["SECTION 10", "Stability & Reactivity", "Stable under normal conditions. Avoid contact with strong oxidisers and acids. Hazardous decomposition products: CO, CO2."],
    ["SECTION 11", "Toxicological Information", "Acute oral LD50 (rat): >2000 mg/kg. Not classified as carcinogenic. No reproductive toxicity data."],
    ["SECTION 12", "Ecological Information", "Not readily biodegradable. Avoid release to aquatic environment. Log Kow: 1.2."],
    ["SECTION 13", "Disposal Considerations", "Dispose in accordance with local regulations. Do not pour down drains. Classified as industrial waste — arrange licensed disposal."],
    ["SECTION 14", "Transport Information", "UN Number: Not regulated in small quantities. IMDG: Not classified. ADR: Not classified."],
    ["SECTION 15", "Regulatory Information", "REACH: Pre-registered. TSCA: Listed. BIS/MSDS as per IS 1760. FSSAI: Not applicable."],
    ["SECTION 16", "Other Information", `Prepared: ${new Date().toLocaleDateString("en-IN")}. Revision: 1.0. The information is based on our current knowledge and is intended to describe the product for safety purposes only.`]
  ];

  for (const [num, title, content] of sections) {
    if (doc.y > 700) doc.addPage();
    doc.fillColor("#0F172A").fontSize(10).font("Helvetica-Bold").text(`${num}: ${title}`, 50, doc.y);
    doc.y += 2;
    doc.fillColor("#1D1D1F").fontSize(8.5).font("Helvetica").text(content, 58, doc.y, { width: 487 });
    doc.moveDown(0.6);
  }
  addFooter(doc, data.docNumber);
}

// ─── COA Generator ───────────────────────────────────────────────────────────
function buildCOA(doc: any, data: { docNumber: string; productName: string; batchNo: string; tests: string[][] }) {
  addHeader(doc, `Certificate of Analysis\n${data.productName}`, data.docNumber, "1.0");
  addSectionHeading(doc, "1. Batch Information");
  addKeyValue(doc, "Product Name", data.productName);
  addKeyValue(doc, "Batch Number", data.batchNo);
  addKeyValue(doc, "Manufacturing Date", new Date(Date.now() - 7*24*60*60*1000).toLocaleDateString("en-IN"));
  addKeyValue(doc, "Expiry Date", new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString("en-IN"));
  addKeyValue(doc, "Quantity", "1000 kg");

  addSectionHeading(doc, "2. Test Results");
  addTable(doc, ["Test Parameter", "Specification", "Result", "Method", "Status"],
    data.tests, [145, 110, 90, 95, 55]);

  addSectionHeading(doc, "3. Conclusion");
  doc.fillColor("#1D1D1F").fontSize(9).font("Helvetica").text("The above batch has been tested and found to COMPLY with specified requirements. Released for use.", 50, doc.y, { width: 495 });
  doc.moveDown(1.5);

  addSectionHeading(doc, "4. Sign-off");
  addKeyValue(doc, "Tested By", "QA Analyst — Chemical Testing Lab");
  addKeyValue(doc, "Reviewed By", "Senior QA Manager");
  addKeyValue(doc, "Approved By", "Quality Director");
  addKeyValue(doc, "Release Date", new Date().toLocaleDateString("en-IN"));

  addFooter(doc, data.docNumber);
}

// ─── SPECIFICATION Generator ─────────────────────────────────────────────────
function buildSpec(doc: any, data: { docNumber: string; productName: string; specs: string[][]; packaging: string; labelling: string }) {
  addHeader(doc, `Product Specification\n${data.productName}`, data.docNumber, "1.0");
  addSectionHeading(doc, "1. Scope");
  doc.fillColor("#1D1D1F").fontSize(9).font("Helvetica").text(`This specification defines the quality requirements for ${data.productName} manufactured by Tatva Industries Pvt. Ltd. It is applicable to all batches produced for commercial supply.`, 50, doc.y, { width: 495 });
  doc.moveDown(0.8);

  addSectionHeading(doc, "2. Quality Specifications");
  addTable(doc, ["Parameter", "Requirement", "Test Method", "Frequency"],
    data.specs, [150, 150, 125, 70]);

  addSectionHeading(doc, "3. Packaging Requirements");
  doc.fillColor("#1D1D1F").fontSize(9).font("Helvetica").text(data.packaging, 50, doc.y, { width: 495 });
  doc.moveDown(0.8);

  addSectionHeading(doc, "4. Labelling Requirements");
  doc.fillColor("#1D1D1F").fontSize(9).font("Helvetica").text(data.labelling, 50, doc.y, { width: 495 });
  doc.moveDown(0.8);

  addSectionHeading(doc, "5. Approvals");
  addKeyValue(doc, "Originated By", "R&D Department");
  addKeyValue(doc, "Reviewed By", "QA Manager");
  addKeyValue(doc, "Approved By", "Technical Director");
  addKeyValue(doc, "Effective Date", new Date().toLocaleDateString("en-IN"));

  addFooter(doc, data.docNumber);
}

// ─── REGULATORY Generator ────────────────────────────────────────────────────
function buildRegulatory(doc: any, data: { docNumber: string; productName: string; standard: string; findings: string[][]; conclusion: string }) {
  addHeader(doc, `Regulatory Compliance Declaration\n${data.productName}`, data.docNumber, "1.0");
  addSectionHeading(doc, "1. Scope of Declaration");
  doc.fillColor("#1D1D1F").fontSize(9).font("Helvetica").text(`This declaration certifies that ${data.productName} meets the requirements of ${data.standard}. This document is issued by the Regulatory Affairs department of Tatva Industries Pvt. Ltd.`, 50, doc.y, { width: 495 });
  doc.moveDown(0.8);

  addSectionHeading(doc, "2. Regulatory Findings");
  addTable(doc, ["Requirement", "Standard Reference", "Compliance Status", "Evidence"],
    data.findings, [165, 110, 110, 110]);

  addSectionHeading(doc, "3. Conclusion");
  doc.fillColor("#1D1D1F").fontSize(9).font("Helvetica").text(data.conclusion, 50, doc.y, { width: 495 });
  doc.moveDown(1);

  addSectionHeading(doc, "4. Declaration");
  doc.fillColor("#1D1D1F").fontSize(9).font("Helvetica").text("We, the undersigned, hereby declare that the product described in this document meets all referenced regulatory requirements.", 50, doc.y, { width: 495 });
  doc.moveDown(1);
  addKeyValue(doc, "Regulatory Affairs", "Riley Regulatory");
  addKeyValue(doc, "Date", new Date().toLocaleDateString("en-IN"));

  addFooter(doc, data.docNumber);
}

// ─── QUALITY/TEST REPORT Generator ──────────────────────────────────────────
function buildQuality(doc: any, data: { docNumber: string; productName: string; testSummary: string; results: string[][]; conclusion: string }) {
  addHeader(doc, `Quality Test Report\n${data.productName}`, data.docNumber, "1.0");
  addSectionHeading(doc, "1. Test Summary");
  doc.fillColor("#1D1D1F").fontSize(9).font("Helvetica").text(data.testSummary, 50, doc.y, { width: 495 });
  doc.moveDown(0.8);

  addSectionHeading(doc, "2. Test Results");
  addTable(doc, ["Test", "Standard", "Requirement", "Result", "Status"],
    data.results, [120, 90, 90, 110, 85]);

  addSectionHeading(doc, "3. Conclusion");
  doc.fillColor("#1D1D1F").fontSize(9).font("Helvetica").text(data.conclusion, 50, doc.y, { width: 495 });
  doc.moveDown(0.8);

  addKeyValue(doc, "Testing Lab", "Tatva Central QC Laboratory, Pune");
  addKeyValue(doc, "Report Date", new Date().toLocaleDateString("en-IN"));
  addKeyValue(doc, "Approved By", "Quality Director");

  addFooter(doc, data.docNumber);
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function seedDocuments(prisma: PrismaClient, containers: {
  foodContainer: { id: string };
  polymerContainer: { id: string };
  cpgContainer: { id: string };
  chemContainer: { id: string };
  tyreContainer: { id: string };
  paintContainer: { id: string };
}, plmAdminId: string) {
  ensureDir(STORAGE_DIR);

  const docs: Array<{
    docNumber: string;
    name: string;
    fileName: string;
    documentType: string;
    containerId: string;
    linkItemCode: string | null;
    buildPdf: (filePath: string) => Promise<number>;
  }> = [
    // ── FOOD-CORE documents ──────────────────────────────────────────────
    {
      docNumber: "FNB-DOC-0001",
      name: "Technical Data Sheet — Cocoa Butter CB-Extra",
      fileName: "FNB-DOC-0001_TDS_Cocoa_Butter.pdf",
      documentType: "TDS",
      containerId: containers.foodContainer.id,
      linkItemCode: "FNB-RM-0001",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildTDS(doc, {
        docNumber: "FNB-DOC-0001",
        title: "Technical Data Sheet — Cocoa Butter CB-Extra",
        productName: "Cocoa Butter CB-Extra",
        casNumber: "8002-31-1",
        properties: [
          ["Melting Point", "32–35°C", "33.5°C", "ISO 6321"],
          ["Free Fatty Acid (as oleic)", "≤1.75%", "0.8%", "ISO 660"],
          ["Moisture Content", "≤0.2%", "0.05%", "ISO 662"],
          ["Refractive Index at 40°C", "1.456–1.459", "1.4575", "ISO 6320"],
          ["Saponification Value", "188–198 mg KOH/g", "193", "ISO 3657"],
          ["Iodine Value", "33–42 g I2/100g", "37", "ISO 3961"],
          ["Colour (Lovibond)", "≤1.5R / 15Y", "1.2R / 12Y", "AOCS Cc 13b-45"],
          ["Peroxide Value", "≤2 meq O2/kg", "0.8", "ISO 3960"]
        ],
        applications: [
          "Premium chocolate manufacturing (tablets, coatings, truffles)",
          "Confectionery fillings and enrobing",
          "Pharmaceutical suppository base",
          "Cosmetic skin care formulations"
        ],
        storage: "Store in clean, dry, odourless conditions at 18–20°C, away from strong-smelling substances. Shelf life: 24 months from manufacture date in original packaging. Keep away from direct sunlight."
      }))
    },
    {
      docNumber: "FNB-DOC-0002",
      name: "Certificate of Analysis — Dark Chocolate Couverture",
      fileName: "FNB-DOC-0002_COA_Dark_Chocolate.pdf",
      documentType: "COA",
      containerId: containers.foodContainer.id,
      linkItemCode: "FNB-RM-0002",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildCOA(doc, {
        docNumber: "FNB-DOC-0002",
        productName: "Dark Chocolate Couverture 72%",
        batchNo: "DC-2026-0314",
        tests: [
          ["Cocoa Solids", "≥72%", "74.2%", "AOAC 970.20", "PASS"],
          ["Total Fat (Cocoa Butter)", "38–42%", "40.1%", "Soxhlet ISO 659", "PASS"],
          ["Moisture", "≤1.5%", "1.1%", "ISO 2291", "PASS"],
          ["Total Sugar", "≤28%", "25.4%", "HPLC", "PASS"],
          ["Fineness of Grind", "≤20 µm", "18 µm", "Micrometer gauge", "PASS"],
          ["Viscosity", "3000–6000 mPa.s", "4200 mPa.s", "Brookfield", "PASS"],
          ["Salmonella", "Absent/25g", "Absent", "ISO 6579", "PASS"],
          ["Total Plate Count", "≤10,000 CFU/g", "1,200 CFU/g", "ISO 4833", "PASS"]
        ]
      }))
    },
    {
      docNumber: "FNB-DOC-0003",
      name: "FSSAI Compliance Declaration — Caramel Biscuit",
      fileName: "FNB-DOC-0003_REGULATORY_FSSAI_Caramel.pdf",
      documentType: "REGULATORY",
      containerId: containers.foodContainer.id,
      linkItemCode: "FNB-FG-0001",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildRegulatory(doc, {
        docNumber: "FNB-DOC-0003",
        productName: "Caramel Biscuit (FNB-FG-0001)",
        standard: "FSSAI Food Safety and Standards Act 2006 & FSS (Food Products Standards and Food Additives) Regulations 2011",
        findings: [
          ["Labelling — mandatory info", "Reg. 2.2.1", "COMPLIANT", "Label review"],
          ["Nutritional info panel", "Reg. 2.2.2", "COMPLIANT", "NI calculation"],
          ["Allergen declaration", "Reg. 2.2.6", "COMPLIANT", "Ingredient audit"],
          ["FSSAI Lic. No. on label", "FSS Act S.31", "COMPLIANT", "Lic. No. 10016011123456"],
          ["Food Additives (approved)", "FSS Additives", "COMPLIANT", "Additive list review"],
          ["Microbiological limits", "FSS Micro Limits", "COMPLIANT", "QC test report"],
          ["Shelf life declaration", "Reg. 2.2.1(g)", "COMPLIANT", "Stability study"]
        ],
        conclusion: "The product Caramel Biscuit (FNB-FG-0001) has been reviewed against applicable FSSAI regulations and is declared COMPLIANT for manufacture and sale in India. The next regulatory review is scheduled 12 months from the effective date of this declaration."
      }))
    },

    // ── POLY-CORE documents ──────────────────────────────────────────────
    {
      docNumber: "PLY-DOC-0001",
      name: "Technical Data Sheet — HDPE Resin Grade H5502",
      fileName: "PLY-DOC-0001_TDS_HDPE_H5502.pdf",
      documentType: "TDS",
      containerId: containers.polymerContainer.id,
      linkItemCode: "PLY-RM-0001",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildTDS(doc, {
        docNumber: "PLY-DOC-0001",
        title: "HDPE Resin Grade H5502",
        productName: "HDPE Resin Grade H5502",
        casNumber: "9002-88-4",
        properties: [
          ["Melt Flow Index (190°C/2.16kg)", "0.35–0.45 g/10min", "0.40", "ISO 1133"],
          ["Density", "0.950–0.960 g/cm3", "0.955", "ISO 1183"],
          ["Tensile Strength at Yield", "≥25 MPa", "27 MPa", "ISO 527"],
          ["Elongation at Break", "≥600%", "700%", "ISO 527"],
          ["Flexural Modulus", "900–1100 MPa", "1000 MPa", "ISO 178"],
          ["Vicat Softening Point", "≥120°C", "124°C", "ISO 306"],
          ["ESCR (F50)", "≥1000 h", ">1500 h", "ISO 4599"],
          ["Moisture Content", "≤500 ppm", "180 ppm", "Karl Fischer"]
        ],
        applications: [
          "Blow moulding of bottles, drums and containers",
          "Film extrusion for heavy-duty packaging",
          "Pipe and fittings for water distribution",
          "Injection moulding of industrial components"
        ],
        storage: "Store in original sealed bags in cool, dry warehouse away from UV light and heat sources. Maximum storage temperature: 40°C. Shelf life: 24 months. Avoid contamination with other polymers or foreign materials."
      }))
    },
    {
      docNumber: "PLY-DOC-0002",
      name: "Safety Data Sheet — LLDPE Resin Grade C4",
      fileName: "PLY-DOC-0002_SDS_LLDPE_C4.pdf",
      documentType: "SDS",
      containerId: containers.polymerContainer.id,
      linkItemCode: "PLY-RM-0002",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildSDS(doc, {
        docNumber: "PLY-DOC-0002",
        productName: "LLDPE Resin Grade C4",
        hazardClass: "Not classified as hazardous under GHS",
        casNumber: "9002-88-4",
        supplier: "Tatva Industries Pvt. Ltd., Pune, MH 411001"
      }))
    },
    {
      docNumber: "PLY-DOC-0003",
      name: "Product Specification — PP Injection Grade Final Pellet",
      fileName: "PLY-DOC-0003_SPEC_PP_Injection_Grade.pdf",
      documentType: "SPECIFICATION",
      containerId: containers.polymerContainer.id,
      linkItemCode: "PLY-FG-0001",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildSpec(doc, {
        docNumber: "PLY-DOC-0003",
        productName: "PP Injection Grade Final Pellet (PLY-FG-0001)",
        specs: [
          ["MFI (230°C/2.16kg)", "10–14 g/10min", "ISO 1133", "Each batch"],
          ["Density", "0.900–0.910 g/cm3", "ISO 1183", "Each batch"],
          ["Flexural Modulus", "1300–1600 MPa", "ISO 178", "Each batch"],
          ["Notched Izod Impact", "≥3.5 kJ/m2", "ISO 180", "Each batch"],
          ["HDT at 0.45 MPa", "≥100°C", "ISO 75-2", "Monthly"],
          ["Pellet Uniformity", "Cylindrical, 3±0.5mm", "Visual + caliper", "Each batch"],
          ["Colour", "Natural/White (max 10Y Lovibond)", "Lovibond", "Each batch"],
          ["Metal Contamination", "Nil", "Metal detector", "Each bag"]
        ],
        packaging: "Pellets are packed in 25 kg net woven polypropylene bags with LDPE inner liner. Each bag must be clearly labelled with product code, batch number, weight, and manufacture date.",
        labelling: "Each bag must carry: (1) Product name and grade, (2) Batch number, (3) Net weight, (4) Manufacture and best-before date, (5) REACH registration number, (6) Recycling symbol (PP 5), (7) Tatva Industries contact details."
      }))
    },

    // ── CPG-CORE documents ───────────────────────────────────────────────
    {
      docNumber: "CPG-DOC-0001",
      name: "Safety Data Sheet — Sodium Lauryl Sulfate",
      fileName: "CPG-DOC-0001_SDS_SLS.pdf",
      documentType: "SDS",
      containerId: containers.cpgContainer.id,
      linkItemCode: "CPG-RM-0001",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildSDS(doc, {
        docNumber: "CPG-DOC-0001",
        productName: "Sodium Lauryl Sulfate (SLS)",
        hazardClass: "Skin Irritant Cat.2 (H315); Eye Irritant Cat.2 (H319); Harmful if swallowed Cat.4 (H302)",
        casNumber: "151-21-3",
        supplier: "Tatva Industries Pvt. Ltd., Pune, MH 411001"
      }))
    },
    {
      docNumber: "CPG-DOC-0002",
      name: "Technical Data Sheet — Glycerin USP",
      fileName: "CPG-DOC-0002_TDS_Glycerin_USP.pdf",
      documentType: "TDS",
      containerId: containers.cpgContainer.id,
      linkItemCode: "CPG-RM-0003",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildTDS(doc, {
        docNumber: "CPG-DOC-0002",
        title: "Glycerin USP",
        productName: "Glycerin (Glycerol) USP Grade",
        casNumber: "56-81-5",
        properties: [
          ["Purity (as C3H8O3)", "≥99.5%", "99.7%", "USP <621>"],
          ["Water Content", "≤0.5%", "0.2%", "Karl Fischer"],
          ["Specific Gravity at 25°C", "1.258–1.263", "1.2609", "USP <841>"],
          ["Refractive Index", "1.470–1.475", "1.4730", "USP <831>"],
          ["Colour (APHA)", "≤10", "5", "ASTM D1209"],
          ["Chlorinated Compounds", "≤10 ppm", "3 ppm", "ICP-OES"],
          ["Heavy Metals", "≤5 ppm", "<1 ppm", "USP <231>"],
          ["Residue on Ignition", "≤0.01%", "0.005%", "USP <281>"]
        ],
        applications: [
          "Humectant and moisturiser in skin care and hair care",
          "Solvent for active cosmetic ingredients",
          "Viscosity modifier in personal care formulations",
          "Pharmaceutical excipient (USP grade)"
        ],
        storage: "Store in sealed containers at 15–25°C, away from direct sunlight. Hygroscopic — keep containers tightly closed. Shelf life: 3 years."
      }))
    },
    {
      docNumber: "CPG-DOC-0003",
      name: "Finished Product Specification — Moisturizing Shampoo 200ml",
      fileName: "CPG-DOC-0003_SPEC_Shampoo_200ml.pdf",
      documentType: "SPECIFICATION",
      containerId: containers.cpgContainer.id,
      linkItemCode: "CPG-FG-0001",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildSpec(doc, {
        docNumber: "CPG-DOC-0003",
        productName: "Moisturizing Shampoo 200ml (CPG-FG-0001)",
        specs: [
          ["pH (10% solution)", "5.5–6.5", "pH Meter", "Each batch"],
          ["Viscosity at 25°C", "3000–6000 mPa.s", "Brookfield RVT", "Each batch"],
          ["Total Solids", "25–32%", "Oven Method", "Each batch"],
          ["Active Content (surfactant)", "12–16%", "Titration", "Each batch"],
          ["Appearance", "Clear, transparent", "Visual", "Each batch"],
          ["Odour", "Fresh floral (matching standard)", "Sensory", "Each batch"],
          ["Colour", "Pale yellow (APHA ≤80)", "APHA Colorimeter", "Each batch"],
          ["Microbial Count", "≤100 CFU/mL total", "ISO 17516", "Each batch"],
          ["Preservative Efficacy", "A-criteria (ISO 11930)", "ISO 11930", "Annual"],
          ["Fill Volume", "200 ± 2 mL", "Graduated cylinder", "Per 100 units"]
        ],
        packaging: "200 mL HDPE (Grade 2) bottle with flip-top cap, natural colour. Minimum wall thickness 0.8mm. Heat-sealed tamper-evident neck band. Packed 24 units per corrugated shipper, double-wall 3-ply, minimum 200 kg edge crush.",
        labelling: "Front panel: Brand name, product name, net volume 200mL. Back panel: Ingredients (INCI), How to use, Allergen warnings, Batch code, Mfg date, Best before, FSSAI Lic. No., Recycling symbol, Manufactured by: Tatva Industries. Barcode: EAN-13."
      }))
    },

    // ── CHEM-CORE documents ──────────────────────────────────────────────
    {
      docNumber: "CH-DOC-0001",
      name: "Safety Data Sheet — Hydrochloric Acid 33%",
      fileName: "CH-DOC-0001_SDS_HCl_33pct.pdf",
      documentType: "SDS",
      containerId: containers.chemContainer.id,
      linkItemCode: "CH-RM-0005",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildSDS(doc, {
        docNumber: "CH-DOC-0001",
        productName: "Hydrochloric Acid 33% Solution",
        hazardClass: "Acute Toxicity Cat.4 (H302, H312, H332); Skin Corrosion Cat.1A (H314); Eye Damage Cat.1 (H318); STOT SE Cat.3 (H335); Corrosive to metals Cat.1 (H290)",
        casNumber: "7647-01-0",
        supplier: "Tatva Industries Pvt. Ltd., Pune, MH 411001"
      }))
    },
    {
      docNumber: "CH-DOC-0002",
      name: "Safety Data Sheet — Caustic Soda Flakes 99%",
      fileName: "CH-DOC-0002_SDS_Caustic_Soda.pdf",
      documentType: "SDS",
      containerId: containers.chemContainer.id,
      linkItemCode: "CH-RM-0004",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildSDS(doc, {
        docNumber: "CH-DOC-0002",
        productName: "Caustic Soda Flakes (NaOH) 99%",
        hazardClass: "Skin Corrosion Cat.1A (H314); Eye Damage Cat.1 (H318); Acute Oral Toxicity Cat.4 (H302); Corrosive to metals Cat.1 (H290)",
        casNumber: "1310-73-2",
        supplier: "Tatva Industries Pvt. Ltd., Pune, MH 411001"
      }))
    },
    {
      docNumber: "CH-DOC-0003",
      name: "Technical Data Sheet — Industrial Degreaser HD",
      fileName: "CH-DOC-0003_TDS_Degreaser_HD.pdf",
      documentType: "TDS",
      containerId: containers.chemContainer.id,
      linkItemCode: "CH-FG-0001",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildTDS(doc, {
        docNumber: "CH-DOC-0003",
        title: "Industrial Degreaser HD",
        productName: "Industrial Degreaser HD (CH-FG-0001)",
        casNumber: "Mixture — see SDS",
        properties: [
          ["Appearance", "Clear liquid", "Clear", "Visual"],
          ["Colour", "Colourless to pale yellow", "Colourless", "APHA"],
          ["pH (neat)", "10.5–11.5", "11.0", "pH Meter"],
          ["Density at 20°C", "0.98–1.02 g/mL", "1.00", "Pycnometer"],
          ["Flash Point", "None (aqueous)", "None", "Closed Cup"],
          ["Dilution Ratio", "1:10 to 1:20 (v/v)", "1:15 typical", "In-use test"],
          ["Degreasing Efficiency", "≥95%", "97%", "ASTM F22"],
          ["VOC Content", "≤50 g/L", "32 g/L", "ISO 11890"]
        ],
        applications: [
          "Heavy equipment and engine degreasing",
          "Metal parts cleaning before painting or plating",
          "Industrial floor and machinery cleaning",
          "Removes mineral oils, greases, and cutting fluids"
        ],
        storage: "Store in original sealed HDPE containers. Avoid freezing. Keep away from acids, hot surfaces, and open flames. Shelf life: 18 months. Use within 6 months after opening."
      }))
    },

    // ── TYRE-CORE documents ──────────────────────────────────────────────
    {
      docNumber: "TYR-DOC-0001",
      name: "Technical Data Sheet — Carbon Black N330",
      fileName: "TYR-DOC-0001_TDS_Carbon_Black_N330.pdf",
      documentType: "TDS",
      containerId: containers.tyreContainer.id,
      linkItemCode: "TYR-RM-0003",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildTDS(doc, {
        docNumber: "TYR-DOC-0001",
        title: "Carbon Black N330 (HAF)",
        productName: "Carbon Black N330 (HAF Grade)",
        casNumber: "1333-86-4",
        properties: [
          ["Iodine Adsorption Number", "80–92 mg/g", "84 mg/g", "ASTM D1510"],
          ["DBP Absorption", "101–115 cm3/100g", "107", "ASTM D2414"],
          ["Nitrogen Surface Area (N2SA)", "70–85 m2/g", "78", "ASTM D6556"],
          ["CTAB Surface Area", "75–90 m2/g", "80", "ASTM D3765"],
          ["Tint Strength", "96–108%", "102%", "ASTM D3265"],
          ["Heating Loss (at 125°C)", "≤0.5%", "0.2%", "ASTM D1509"],
          ["Fines through 35 mesh", "≤0.1%", "0.02%", "ASTM D1508"],
          ["Pour Density", "360–430 kg/m3", "390", "ASTM D1513"]
        ],
        applications: [
          "Tyre tread and sidewall compounds (primary reinforcing filler)",
          "Mechanical rubber goods — belts, hoses, seals",
          "Industrial rubber profiles and gaskets",
          "Conveyor belts and mining equipment"
        ],
        storage: "Store in dry conditions, away from direct sunlight and heat. Bags must be kept sealed until use. Avoid electrostatic discharge. Shelf life: 2 years from manufacture date."
      }))
    },
    {
      docNumber: "TYR-DOC-0002",
      name: "Compound Specification — PCR Tread Compound",
      fileName: "TYR-DOC-0002_SPEC_PCR_Tread_Compound.pdf",
      documentType: "SPECIFICATION",
      containerId: containers.tyreContainer.id,
      linkItemCode: "TYR-FG-0001",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildSpec(doc, {
        docNumber: "TYR-DOC-0002",
        productName: "PCR Tread Compound (TYR-FML-0001)",
        specs: [
          ["Mooney Viscosity ML(1+4) 100°C", "55–70 MU", "ASTM D1646", "Each mix"],
          ["Tensile Strength (cured)", "≥18 MPa", "ISO 37", "Each batch"],
          ["Elongation at Break", "≥450%", "ISO 37", "Each batch"],
          ["Hardness (Shore A)", "60–70", "ISO 48", "Each batch"],
          ["Abrasion Loss (Akron)", "≤0.08 cm3/km", "ISO 4649", "Monthly"],
          ["Rolling Resistance (tan d at 60°C)", "≤0.12", "DIN 53513", "Annual"],
          ["Wet Grip (mu at 0°C)", "≥0.60", "ECE R117", "Annual"],
          ["Cure Time at 170°C (t90)", "8–12 min", "ISO 6502", "Each batch"]
        ],
        packaging: "Compound supplied as slab or strip in 25 kg nominal batches. Wrapped in polyethylene film to prevent sticking. Each slab labelled with mix number, date, and compound code. Palletised on wooden pallet with shrink wrap.",
        labelling: "Each unit: Compound code TYR-FML-0001, Batch/Mix number, Date of mixing, Net weight, Compound specifications ref, Storage conditions. EU tyre label not applicable (intermediate material)."
      }))
    },
    {
      docNumber: "TYR-DOC-0003",
      name: "Quality Test Report — PCR Tyre 195/65R15",
      fileName: "TYR-DOC-0003_QTR_PCR_Tyre_195-65R15.pdf",
      documentType: "QUALITY",
      containerId: containers.tyreContainer.id,
      linkItemCode: "TYR-FG-0001",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildQuality(doc, {
        docNumber: "TYR-DOC-0003",
        productName: "PCR Tyre 195/65R15 (TYR-FG-0001)",
        testSummary: "End-of-line quality test report for PCR Tyre 195/65R15 against ECE R30 (passenger car tyre) and internal Tatva Industries quality standards. Tests conducted at Tatva Quality Lab, Pune.",
        results: [
          ["Dimensions (section width)", "ECE R30 Annex 6", "194–198mm", "195.2mm", "PASS"],
          ["Tread Depth", "ISO 4219", "≥8.0mm new", "8.3mm", "PASS"],
          ["High Speed (H rating, 210 km/h)", "ECE R30 S2.4", "Pass 20min", "Pass", "PASS"],
          ["Load capacity (615kg @ 2.5bar)", "ECE R30 Annex 3", "No failure", "No failure", "PASS"],
          ["Rolling Resistance", "ECE R117 Art.3", "≤ Class C", "Class B", "PASS"],
          ["Wet Grip Index", "ECE R117 Art.4", "≥ Class C", "Class B", "PASS"],
          ["Bead unseating", "ECE R30 S2.3", "Pass", "Pass", "PASS"],
          ["EU Label Declaration", "Reg. 1222/2009", "B/B rated", "Confirmed", "PASS"]
        ],
        conclusion: "Tyre 195/65R15 (Batch TYR-2026-0315) meets all ECE R30 and Tatva internal quality requirements. Approved for shipment. EU label declaration B/B (Rolling Resistance/Wet Grip) confirmed. Next batch inspection due on next production run."
      }))
    },

    // ── PAINT-CORE documents ─────────────────────────────────────────────
    {
      docNumber: "PNT-DOC-0001",
      name: "Technical Data Sheet — Titanium Dioxide Rutile R-902",
      fileName: "PNT-DOC-0001_TDS_TiO2_Rutile_R902.pdf",
      documentType: "TDS",
      containerId: containers.paintContainer.id,
      linkItemCode: "PNT-RM-0001",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildTDS(doc, {
        docNumber: "PNT-DOC-0001",
        title: "Titanium Dioxide Rutile R-902",
        productName: "Titanium Dioxide Rutile R-902",
        casNumber: "13463-67-7",
        properties: [
          ["TiO2 Content", "≥93%", "94.5%", "ISO 591"],
          ["Rutile Content", "≥99%", "99.5%", "X-Ray Diffraction"],
          ["Tinting Strength (Reynolds)", "≥1850", "1920", "ISO 787-16"],
          ["Oil Absorption", "14–22 g/100g", "18", "ASTM D281"],
          ["pH (10% slurry)", "6.5–8.5", "7.2", "ISO 787-9"],
          ["Moisture Content", "≤0.5%", "0.3%", "ISO 787-2"],
          ["325 Mesh Residue", "≤0.1%", "0.02%", "ISO 787-7"],
          ["Specific Gravity", "3.9–4.1", "4.05", "ISO 787-10"]
        ],
        applications: [
          "White and pastel interior/exterior emulsion paints",
          "Industrial coatings and primers",
          "Powder coatings",
          "Plastics coloration (masterbatch)"
        ],
        storage: "Store in dry conditions. Bags should be kept sealed to prevent moisture absorption. Avoid contamination. Shelf life: 24 months. Maximum storage temperature: 50°C."
      }))
    },
    {
      docNumber: "PNT-DOC-0002",
      name: "Safety Data Sheet — White Spirit 135/180",
      fileName: "PNT-DOC-0002_SDS_White_Spirit.pdf",
      documentType: "SDS",
      containerId: containers.paintContainer.id,
      linkItemCode: "PNT-RM-0007",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildSDS(doc, {
        docNumber: "PNT-DOC-0002",
        productName: "White Spirit 135/180 (Mineral Turpentine Substitute)",
        hazardClass: "Flammable Liquid Cat.3 (H226); Aspiration Hazard Cat.1 (H304); STOT RE Cat.2 (H373); Aquatic Chronic Cat.3 (H412); Skin Irritant Cat.2 (H315)",
        casNumber: "64742-82-1",
        supplier: "Tatva Industries Pvt. Ltd., Pune, MH 411001"
      }))
    },
    {
      docNumber: "PNT-DOC-0003",
      name: "Product Specification — White Interior Emulsion 20L",
      fileName: "PNT-DOC-0003_SPEC_White_Emulsion_20L.pdf",
      documentType: "SPECIFICATION",
      containerId: containers.paintContainer.id,
      linkItemCode: "PNT-FG-0001",
      buildPdf: async (fp) => generatePdf(fp, (doc) => buildSpec(doc, {
        docNumber: "PNT-DOC-0003",
        productName: "White Interior Emulsion 20L (PNT-FG-0001)",
        specs: [
          ["Consistency (KU at 25°C)", "95–115 KU", "Stormer Viscometer", "Each batch"],
          ["Contrast Ratio at 100 µm", "≥0.97", "BS 3900-D2", "Each batch"],
          ["Spreading Rate", "10–12 m2/L", "Film applicator", "Monthly"],
          ["Drying Time Touch Dry", "≤30 min", "ASTM D5895", "Monthly"],
          ["Drying Time Recoatable", "≤4 hours", "ASTM D5895", "Monthly"],
          ["pH", "8.5–9.5", "pH Meter", "Each batch"],
          ["Scrub Resistance", "≥500 cycles (Class 2)", "ISO 11998", "Annual"],
          ["VOC Content", "≤30 g/L (EU Cat A/a)", "ISO 11890-2", "Annual"],
          ["Gloss (60°)", "2–8% (Matt)", "ISO 2813", "Each batch"],
          ["Colour", "White ≤3 dE vs std", "Spectrophotometer", "Each batch"]
        ],
        packaging: "20 litre metal pail (GM coated interior) with friction-fit lid and wire bail handle. Pail must meet UN 1A2 standard. Inner surface lacquer compliant with food-contact standards for potential paint contamination. Label area 120x80mm on front, full back label.",
        labelling: "Front: Brand, Product name, Colour (White), Volume (20L), Coverage (10-12 m2/L per coat), Finish (Matt), Interior use only icon. Back: Full ingredients (under 1% cut-off), Application instructions, Health & safety (GHS where applicable), BIS ISI mark (IS 15489), Batch no, Mfg date, MRP, Tatva Industries address and helpline."
      }))
    }
  ];

  for (const d of docs) {
    const filePath = join(STORAGE_DIR, d.fileName);
    console.log(`  Generating ${d.docNumber}...`);
    const fileSize = await d.buildPdf(filePath);

    const doc = await prisma.document.upsert({
      where: { docNumber: d.docNumber },
      update: {
        name: d.name, fileName: d.fileName,
        filePath: `storage/documents/seed/${d.fileName}`,
        fileSize, mimeType: "application/pdf",
        docType: d.documentType as any,
        status: "RELEASED",
        revisionMajor: 1, revisionIteration: 1, revisionLabel: "1.0",
        containerId: d.containerId, ownerId: plmAdminId
      },
      create: {
        docNumber: d.docNumber, name: d.name, fileName: d.fileName,
        filePath: `storage/documents/seed/${d.fileName}`,
        fileSize, mimeType: "application/pdf",
        docType: d.documentType as any,
        status: "RELEASED",
        revisionMajor: 1, revisionIteration: 1, revisionLabel: "1.0",
        containerId: d.containerId, ownerId: plmAdminId
      }
    });

    // Link to item if specified
    if (d.linkItemCode) {
      const item = await prisma.item.findFirst({ where: { itemCode: d.linkItemCode } });
      if (item) {
        const existingLink = await prisma.documentLink.findFirst({
          where: { documentId: doc.id, entityId: item.id }
        });
        if (!existingLink) {
          await prisma.documentLink.create({
            data: { documentId: doc.id, entityType: "ITEM", entityId: item.id }
          });
        }
      }
    }
  }

  console.log(`  ✓ ${docs.length} documents seeded with PDF files`);
}
