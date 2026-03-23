import type { PrismaClient } from "@prisma/client";

const templates = [
  // ═══════════════════════════════════════════════════════════════════════
  // FOOD & BEVERAGE
  // ═══════════════════════════════════════════════════════════════════════
  {
    industry: "FOOD_BEVERAGE" as const,
    stage: "DISCOVERY" as const,
    deliverables: [
      { id: "d1", label: "Consumer Insight / Market Brief", type: "DOCUMENT", required: true },
      { id: "d2", label: "Concept Statement", type: "DOCUMENT", required: true },
      { id: "d3", label: "Competitive Landscape Review", type: "DOCUMENT", required: false },
      { id: "d4", label: "Preliminary Cost Estimate", type: "MANUAL", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Concept aligns with brand strategy" },
      { id: "m2", criterion: "Target market clearly defined" },
      { id: "m3", criterion: "No known regulatory blockers" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Market size > $10M", weight: 3 },
      { id: "s2", criterion: "Unique differentiator vs. competition", weight: 2 },
      { id: "s3", criterion: "Feasible within current capabilities", weight: 2 }
    ]
  },
  {
    industry: "FOOD_BEVERAGE" as const,
    stage: "FEASIBILITY" as const,
    deliverables: [
      { id: "d1", label: "Formula Concept (Draft)", type: "FORMULA", required: true },
      { id: "d2", label: "Cost Model (Target vs Estimate)", type: "DOCUMENT", required: true },
      { id: "d3", label: "Regulatory Pre-Screen", type: "DOCUMENT", required: true },
      { id: "d4", label: "Resource & Capacity Plan", type: "MANUAL", required: false },
      { id: "d5", label: "Packaging Concept Sketches", type: "DOCUMENT", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Formula concept technically feasible" },
      { id: "m2", criterion: "Cost target achievable (within 20% of target)" },
      { id: "m3", criterion: "No FSSAI / regulatory showstoppers identified" },
      { id: "m4", criterion: "R&D resources available" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Gross margin target met (>40%)", weight: 3 },
      { id: "s2", criterion: "Clean label / natural ingredients", weight: 2 },
      { id: "s3", criterion: "Scalable to full production volume", weight: 3 },
      { id: "s4", criterion: "Shelf life target achievable (>12 months)", weight: 2 }
    ]
  },
  {
    industry: "FOOD_BEVERAGE" as const,
    stage: "DEVELOPMENT" as const,
    deliverables: [
      { id: "d1", label: "Approved Formula (v1.0)", type: "FORMULA", required: true },
      { id: "d2", label: "Finished Good Item Created", type: "ITEM", required: true },
      { id: "d3", label: "Product Specification (Draft)", type: "SPEC", required: true },
      { id: "d4", label: "Pilot Batch Trial Report", type: "DOCUMENT", required: true },
      { id: "d5", label: "Shelf Life Study Initiated", type: "DOCUMENT", required: true },
      { id: "d6", label: "Nutritional Profile / Labelling Draft", type: "DOCUMENT", required: false },
      { id: "d7", label: "Artwork Brief", type: "DOCUMENT", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Formula locked and approved by R&D" },
      { id: "m2", criterion: "Minimum 3 pilot batches conducted" },
      { id: "m3", criterion: "Sensory evaluation score >70%" },
      { id: "m4", criterion: "No food safety concerns in pilot batches" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Pilot batch yield within 5% of target", weight: 3 },
      { id: "s2", criterion: "Consumer taste test positive (>70%)", weight: 3 },
      { id: "s3", criterion: "Ingredient sourcing confirmed", weight: 2 },
      { id: "s4", criterion: "Cost per kg within budget", weight: 2 },
      { id: "s5", criterion: "Packaging material identified and sourced", weight: 1 }
    ]
  },
  {
    industry: "FOOD_BEVERAGE" as const,
    stage: "VALIDATION" as const,
    deliverables: [
      { id: "d1", label: "Plant Trial Report", type: "DOCUMENT", required: true },
      { id: "d2", label: "Final Product Specification (Released)", type: "SPEC", required: true },
      { id: "d3", label: "Shelf Life Validation Report", type: "DOCUMENT", required: true },
      { id: "d4", label: "Regulatory Dossier / FSSAI Approval", type: "DOCUMENT", required: true },
      { id: "d5", label: "Approved Artwork", type: "DOCUMENT", required: true },
      { id: "d6", label: "SDS / Safety Assessment", type: "DOCUMENT", required: false },
      { id: "d7", label: "Quality Control Plan", type: "DOCUMENT", required: true }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Scale-up to full production successful" },
      { id: "m2", criterion: "Shelf life target achieved and validated" },
      { id: "m3", criterion: "All regulatory approvals in place" },
      { id: "m4", criterion: "Artwork approved and print-ready" },
      { id: "m5", criterion: "Quality control plan signed off" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Production yield >95% of target", weight: 3 },
      { id: "s2", criterion: "Waste within acceptable limits", weight: 2 },
      { id: "s3", criterion: "Customer / Trade samples positive feedback", weight: 3 },
      { id: "s4", criterion: "Supply chain fully qualified", weight: 2 }
    ]
  },
  {
    industry: "FOOD_BEVERAGE" as const,
    stage: "LAUNCH" as const,
    deliverables: [
      { id: "d1", label: "SOPs Completed and Approved", type: "DOCUMENT", required: true },
      { id: "d2", label: "Finished Good Item Released in PLM", type: "ITEM", required: true },
      { id: "d3", label: "Formula Released in PLM", type: "FORMULA", required: true },
      { id: "d4", label: "Customer Samples Dispatched", type: "MANUAL", required: false },
      { id: "d5", label: "Commercial Launch Plan", type: "DOCUMENT", required: true },
      { id: "d6", label: "Training Materials for Production", type: "DOCUMENT", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Item and Formula RELEASED in PLM" },
      { id: "m2", criterion: "Artwork RELEASED in PLM" },
      { id: "m3", criterion: "All mandatory documents uploaded and released" },
      { id: "m4", criterion: "Production is ready for commercial run" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "OTIF target >98%", weight: 3 },
      { id: "s2", criterion: "Customer orders confirmed", weight: 3 },
      { id: "s3", criterion: "Launch on or ahead of target date", weight: 2 },
      { id: "s4", criterion: "Marketing campaign live", weight: 1 }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════
  // POLYMER
  // ═══════════════════════════════════════════════════════════════════════
  {
    industry: "POLYMER" as const,
    stage: "DISCOVERY" as const,
    deliverables: [
      { id: "d1", label: "Application & Market Brief", type: "DOCUMENT", required: true },
      { id: "d2", label: "Polymer Grade Concept Note", type: "DOCUMENT", required: true },
      { id: "d3", label: "Competitive Grade Benchmarking", type: "DOCUMENT", required: false },
      { id: "d4", label: "Preliminary Raw Material Availability Check", type: "MANUAL", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Target application and performance requirements defined" },
      { id: "m2", criterion: "No fundamental polymer chemistry blockers" },
      { id: "m3", criterion: "REACH / RoHS pre-screen completed" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Addressable market volume > 500 MT/year", weight: 3 },
      { id: "s2", criterion: "Differentiated vs. commodity grades", weight: 2 },
      { id: "s3", criterion: "Raw materials available from qualified suppliers", weight: 2 }
    ]
  },
  {
    industry: "POLYMER" as const,
    stage: "FEASIBILITY" as const,
    deliverables: [
      { id: "d1", label: "Compound Formula (Draft)", type: "FORMULA", required: true },
      { id: "d2", label: "Raw Material TDS Review", type: "DOCUMENT", required: true },
      { id: "d3", label: "Preliminary MFI / Density Target", type: "SPEC", required: true },
      { id: "d4", label: "REACH Substance Pre-Registration Check", type: "DOCUMENT", required: true },
      { id: "d5", label: "Compounding Equipment Feasibility", type: "MANUAL", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Compound formulation technically feasible on existing equipment" },
      { id: "m2", criterion: "Key property targets (MFI, density, mechanical) achievable" },
      { id: "m3", criterion: "No restricted substances (SVHC) in formulation" },
      { id: "m4", criterion: "Raw material supply chain identified" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Target cost/kg within 15% of budget", weight: 3 },
      { id: "s2", criterion: "Halogen-free / eco-friendly formulation", weight: 2 },
      { id: "s3", criterion: "Processable on standard customer equipment", weight: 3 },
      { id: "s4", criterion: "Recyclability / end-of-life considered", weight: 1 }
    ]
  },
  {
    industry: "POLYMER" as const,
    stage: "DEVELOPMENT" as const,
    deliverables: [
      { id: "d1", label: "Approved Compound Formula (v1.0)", type: "FORMULA", required: true },
      { id: "d2", label: "Finished Good Item Created", type: "ITEM", required: true },
      { id: "d3", label: "Technical Data Sheet (Draft)", type: "DOCUMENT", required: true },
      { id: "d4", label: "Lab / Pilot Compounding Trial Report", type: "DOCUMENT", required: true },
      { id: "d5", label: "Full Physical Property Test Report", type: "DOCUMENT", required: true },
      { id: "d6", label: "Customer Processing Trial (if applicable)", type: "DOCUMENT", required: false },
      { id: "d7", label: "SDS Draft", type: "DOCUMENT", required: true }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "All key properties (MFI, tensile, impact, thermal) meet spec" },
      { id: "m2", criterion: "Minimum 3 lab batches with consistent results" },
      { id: "m3", criterion: "SDS prepared per GHS / REACH requirements" },
      { id: "m4", criterion: "No processing issues on pilot equipment" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Property consistency (CV < 5%) across batches", weight: 3 },
      { id: "s2", criterion: "Customer application trial successful", weight: 3 },
      { id: "s3", criterion: "Colour / appearance meets customer expectation", weight: 2 },
      { id: "s4", criterion: "Batch yield > 97%", weight: 2 }
    ]
  },
  {
    industry: "POLYMER" as const,
    stage: "VALIDATION" as const,
    deliverables: [
      { id: "d1", label: "Production Scale Trial Report", type: "DOCUMENT", required: true },
      { id: "d2", label: "Final Product Specification (Released)", type: "SPEC", required: true },
      { id: "d3", label: "Final TDS (Released)", type: "DOCUMENT", required: true },
      { id: "d4", label: "Final SDS (Released)", type: "DOCUMENT", required: true },
      { id: "d5", label: "REACH Registration / SVHC Declaration", type: "DOCUMENT", required: true },
      { id: "d6", label: "Packaging & Labelling Approval", type: "DOCUMENT", required: true },
      { id: "d7", label: "Quality Control Plan", type: "DOCUMENT", required: true }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Production scale trial meets all specifications" },
      { id: "m2", criterion: "TDS and SDS released and GHS compliant" },
      { id: "m3", criterion: "REACH obligations fulfilled" },
      { id: "m4", criterion: "25 kg bag / IBC labelling approved" },
      { id: "m5", criterion: "QC incoming inspection plan documented" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Production yield >= 98%", weight: 3 },
      { id: "s2", criterion: "Customer qualification trial approved", weight: 3 },
      { id: "s3", criterion: "Property batch-to-batch variation < 3%", weight: 2 },
      { id: "s4", criterion: "Shelf life declared (min 24 months)", weight: 2 }
    ]
  },
  {
    industry: "POLYMER" as const,
    stage: "LAUNCH" as const,
    deliverables: [
      { id: "d1", label: "Item and Formula RELEASED in PLM", type: "ITEM", required: true },
      { id: "d2", label: "Formula Released in PLM", type: "FORMULA", required: true },
      { id: "d3", label: "Commercial TDS Published", type: "DOCUMENT", required: true },
      { id: "d4", label: "SAP / ERP Material Master Created", type: "MANUAL", required: true },
      { id: "d5", label: "First Commercial Batch Produced", type: "MANUAL", required: true },
      { id: "d6", label: "Customer Qualification Certificate", type: "DOCUMENT", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Item and Formula RELEASED in PLM" },
      { id: "m2", criterion: "TDS and SDS publicly available" },
      { id: "m3", criterion: "ERP material master active with correct costing" },
      { id: "m4", criterion: "All mandatory regulatory documents released" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "First commercial order shipped on time", weight: 3 },
      { id: "s2", criterion: "Customer acceptance certificate received", weight: 3 },
      { id: "s3", criterion: "Launch within target date", weight: 2 },
      { id: "s4", criterion: "Sales forecast confirmed with commercial team", weight: 1 }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CPG — Consumer & Personal Care
  // ═══════════════════════════════════════════════════════════════════════
  {
    industry: "CPG" as const,
    stage: "DISCOVERY" as const,
    deliverables: [
      { id: "d1", label: "Consumer Research / Trend Report", type: "DOCUMENT", required: true },
      { id: "d2", label: "Product Concept Brief", type: "DOCUMENT", required: true },
      { id: "d3", label: "Claims Framework (Initial)", type: "DOCUMENT", required: false },
      { id: "d4", label: "Regulatory Category Pre-Screen", type: "DOCUMENT", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Product concept validated by consumer insights team" },
      { id: "m2", criterion: "Target demographics and usage occasions defined" },
      { id: "m3", criterion: "No banned ingredients or regulatory blockers identified" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Category growth rate > 5% CAGR", weight: 3 },
      { id: "s2", criterion: "Unique claim or differentiator identified", weight: 3 },
      { id: "s3", criterion: "Alignment with sustainability commitments", weight: 2 },
      { id: "s4", criterion: "Achievable within 12-month development cycle", weight: 1 }
    ]
  },
  {
    industry: "CPG" as const,
    stage: "FEASIBILITY" as const,
    deliverables: [
      { id: "d1", label: "Formulation Concept (Draft)", type: "FORMULA", required: true },
      { id: "d2", label: "Ingredient Safety Assessment", type: "DOCUMENT", required: true },
      { id: "d3", label: "Claims Substantiation Plan", type: "DOCUMENT", required: true },
      { id: "d4", label: "Packaging Concept & Material Selection", type: "DOCUMENT", required: false },
      { id: "d5", label: "Cost of Goods Estimate", type: "DOCUMENT", required: true }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Formulation concept is safe per EU Cosmetics / IFRA / FSSAI" },
      { id: "m2", criterion: "All ingredients compliant with applicable regulations" },
      { id: "m3", criterion: "No SVHC or restricted substances in formula" },
      { id: "m4", criterion: "Target COGs achievable within gross margin target" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Gross margin > 50%", weight: 3 },
      { id: "s2", criterion: "Natural / organic ingredient ratio > 90%", weight: 2 },
      { id: "s3", criterion: "No animal-derived ingredients (vegan-friendly)", weight: 2 },
      { id: "s4", criterion: "Fragrance and colour compliant with target markets", weight: 2 }
    ]
  },
  {
    industry: "CPG" as const,
    stage: "DEVELOPMENT" as const,
    deliverables: [
      { id: "d1", label: "Approved Formula (v1.0)", type: "FORMULA", required: true },
      { id: "d2", label: "Finished Good Item Created", type: "ITEM", required: true },
      { id: "d3", label: "Stability Study Report (3-month accelerated)", type: "DOCUMENT", required: true },
      { id: "d4", label: "Preservative Efficacy Test (ISO 11930)", type: "DOCUMENT", required: true },
      { id: "d5", label: "Safety Assessment / CPSR", type: "DOCUMENT", required: true },
      { id: "d6", label: "Dermatology / Allergy Test Report", type: "DOCUMENT", required: false },
      { id: "d7", label: "Packaging Compatibility Test", type: "DOCUMENT", required: true },
      { id: "d8", label: "Artwork Brief & Claims Review", type: "DOCUMENT", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Formula passes stability at 40°C/75% RH for 3 months" },
      { id: "m2", criterion: "Preservative efficacy meets ISO 11930 criteria A" },
      { id: "m3", criterion: "Safety assessment completed and approved" },
      { id: "m4", criterion: "No packaging compatibility issues" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Sensory panel score > 75%", weight: 3 },
      { id: "s2", criterion: "Dermatologist-tested and claimed", weight: 2 },
      { id: "s3", criterion: "pH, viscosity, appearance stable across batches", weight: 3 },
      { id: "s4", criterion: "Fill weight / volume within +/-2% tolerance", weight: 2 }
    ]
  },
  {
    industry: "CPG" as const,
    stage: "VALIDATION" as const,
    deliverables: [
      { id: "d1", label: "Scale-up Batch Report (3 x commercial scale)", type: "DOCUMENT", required: true },
      { id: "d2", label: "Final Product Specification (Released)", type: "SPEC", required: true },
      { id: "d3", label: "Full Stability Report (ongoing)", type: "DOCUMENT", required: true },
      { id: "d4", label: "Regulatory Submission (EU CPNP / FDA Cosmetics)", type: "DOCUMENT", required: true },
      { id: "d5", label: "Final Approved Artwork & Label", type: "DOCUMENT", required: true },
      { id: "d6", label: "Microbiology QC Plan", type: "DOCUMENT", required: true },
      { id: "d7", label: "Claims Substantiation Dossier", type: "DOCUMENT", required: true }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "3 commercial-scale batches meet full specification" },
      { id: "m2", criterion: "Regulatory notifications filed (CPNP, FDA as applicable)" },
      { id: "m3", criterion: "All claims substantiated and legally reviewed" },
      { id: "m4", criterion: "Artwork and label approved by regulatory team" },
      { id: "m5", criterion: "Shelf life claim supported by stability data" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Batch yield > 97%", weight: 3 },
      { id: "s2", criterion: "Consumer acceptance trial positive (>75%)", weight: 3 },
      { id: "s3", criterion: "Zero micro failures in validation batches", weight: 3 },
      { id: "s4", criterion: "ERP material master and BOM confirmed", weight: 2 }
    ]
  },
  {
    industry: "CPG" as const,
    stage: "LAUNCH" as const,
    deliverables: [
      { id: "d1", label: "Item and Formula RELEASED in PLM", type: "ITEM", required: true },
      { id: "d2", label: "Formula Released in PLM", type: "FORMULA", required: true },
      { id: "d3", label: "Trade / Retailer Samples Dispatched", type: "MANUAL", required: false },
      { id: "d4", label: "POS / Marketing Materials Ready", type: "DOCUMENT", required: false },
      { id: "d5", label: "Supply Chain and Logistics Plan", type: "DOCUMENT", required: true },
      { id: "d6", label: "Customer Service Training Completed", type: "MANUAL", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Item and Formula RELEASED in PLM" },
      { id: "m2", criterion: "All regulatory filings complete and confirmed" },
      { id: "m3", criterion: "First production batch dispatched to 3PL / distribution" },
      { id: "m4", criterion: "Barcode and trade unit registered" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Launch on or ahead of plan date", weight: 3 },
      { id: "s2", criterion: "Initial sell-in orders confirmed", weight: 3 },
      { id: "s3", criterion: "PR / influencer launch campaign live", weight: 2 },
      { id: "s4", criterion: "In-store / online listing confirmed with retailers", weight: 2 }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CHEMICAL — Industrial Chemicals
  // ═══════════════════════════════════════════════════════════════════════
  {
    industry: "CHEMICAL" as const,
    stage: "DISCOVERY" as const,
    deliverables: [
      { id: "d1", label: "Technical Application Brief", type: "DOCUMENT", required: true },
      { id: "d2", label: "Chemical Concept Note", type: "DOCUMENT", required: true },
      { id: "d3", label: "Regulatory Risk Assessment (Initial)", type: "DOCUMENT", required: true },
      { id: "d4", label: "Raw Material Availability Scan", type: "MANUAL", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Technical concept is chemically sound" },
      { id: "m2", criterion: "No acutely banned substances in proposed chemistry" },
      { id: "m3", criterion: "REACH SVHC pre-screen completed" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Industrial market demand confirmed (>100 MT/year potential)", weight: 3 },
      { id: "s2", criterion: "Performance advantage over incumbent products", weight: 3 },
      { id: "s3", criterion: "Lower hazard classification than alternatives", weight: 2 },
      { id: "s4", criterion: "Biobased or greener chemistry pathway available", weight: 1 }
    ]
  },
  {
    industry: "CHEMICAL" as const,
    stage: "FEASIBILITY" as const,
    deliverables: [
      { id: "d1", label: "Chemical Formula / Blend Concept", type: "FORMULA", required: true },
      { id: "d2", label: "Preliminary SDS (Draft)", type: "DOCUMENT", required: true },
      { id: "d3", label: "GHS Hazard Classification", type: "DOCUMENT", required: true },
      { id: "d4", label: "REACH Registration / Tonnage Band Assessment", type: "DOCUMENT", required: true },
      { id: "d5", label: "Process Safety Review (HAZID)", type: "DOCUMENT", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Blend formulation achieves target technical performance" },
      { id: "m2", criterion: "GHS classification completed and documented" },
      { id: "m3", criterion: "REACH registration path identified and costed" },
      { id: "m4", criterion: "No incompatibility or process safety showstoppers" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Target cost/kg within 20% of market price", weight: 3 },
      { id: "s2", criterion: "Formulation is biodegradable (OECD 301)", weight: 2 },
      { id: "s3", criterion: "Flash point above 60°C (non-flammable)", weight: 2 },
      { id: "s4", criterion: "Existing manufacturing equipment compatible", weight: 2 }
    ]
  },
  {
    industry: "CHEMICAL" as const,
    stage: "DEVELOPMENT" as const,
    deliverables: [
      { id: "d1", label: "Approved Formula (v1.0)", type: "FORMULA", required: true },
      { id: "d2", label: "Finished Good Item Created", type: "ITEM", required: true },
      { id: "d3", label: "Full Technical Performance Test Report", type: "DOCUMENT", required: true },
      { id: "d4", label: "SDS (Compliant with REACH Annex II)", type: "DOCUMENT", required: true },
      { id: "d5", label: "Ecotoxicology / Biodegradability Data", type: "DOCUMENT", required: true },
      { id: "d6", label: "Stability / Shelf Life Study", type: "DOCUMENT", required: true },
      { id: "d7", label: "Customer Trial Report", type: "DOCUMENT", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Performance targets met in lab and customer trials" },
      { id: "m2", criterion: "SDS compliant with REACH Annex II and GHS Rev 9" },
      { id: "m3", criterion: "Ecotox data available for all components" },
      { id: "m4", criterion: "12-month shelf life confirmed in stability study" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Customer trial success rate > 80%", weight: 3 },
      { id: "s2", criterion: "Hazard classification below acute tox cat 3", weight: 2 },
      { id: "s3", criterion: "Batch-to-batch reproducibility (CV < 3%)", weight: 3 },
      { id: "s4", criterion: "Compatible with standard chemical packaging (HDPE drum)", weight: 1 }
    ]
  },
  {
    industry: "CHEMICAL" as const,
    stage: "VALIDATION" as const,
    deliverables: [
      { id: "d1", label: "Production Scale Batch Report", type: "DOCUMENT", required: true },
      { id: "d2", label: "Final Product Specification (Released)", type: "SPEC", required: true },
      { id: "d3", label: "Final SDS (Released)", type: "DOCUMENT", required: true },
      { id: "d4", label: "UN Transport Classification (ADR/IMDG)", type: "DOCUMENT", required: true },
      { id: "d5", label: "Packaging Approval (UN certified drum / IBC)", type: "DOCUMENT", required: true },
      { id: "d6", label: "Environmental Impact Assessment", type: "DOCUMENT", required: false },
      { id: "d7", label: "Quality Control Plan", type: "DOCUMENT", required: true }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Commercial-scale batch meets full product specification" },
      { id: "m2", criterion: "UN transport classification confirmed and labelled" },
      { id: "m3", criterion: "UN-certified packaging tested and approved" },
      { id: "m4", criterion: "All REACH obligations met (registration / notification)" },
      { id: "m5", criterion: "QC release test plan documented and approved" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Production yield > 96%", weight: 3 },
      { id: "s2", criterion: "Zero safety incidents during scale-up", weight: 3 },
      { id: "s3", criterion: "Environmental discharge permit confirmed", weight: 2 },
      { id: "s4", criterion: "Supply chain dual-sourced for critical raw materials", weight: 2 }
    ]
  },
  {
    industry: "CHEMICAL" as const,
    stage: "LAUNCH" as const,
    deliverables: [
      { id: "d1", label: "Item and Formula RELEASED in PLM", type: "ITEM", required: true },
      { id: "d2", label: "Formula Released in PLM", type: "FORMULA", required: true },
      { id: "d3", label: "TDS Published on Company Portal", type: "DOCUMENT", required: true },
      { id: "d4", label: "SDS Distributed to Distribution Partners", type: "DOCUMENT", required: true },
      { id: "d5", label: "First Commercial Delivery Completed", type: "MANUAL", required: true },
      { id: "d6", label: "Emergency Response Information Registered", type: "DOCUMENT", required: true }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Item and Formula RELEASED in PLM" },
      { id: "m2", criterion: "SDS available in all required languages" },
      { id: "m3", criterion: "Emergency response / poison centre notification done" },
      { id: "m4", criterion: "UN-labelled shipment dispatched to first customer" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "First order delivered on time and in full", weight: 3 },
      { id: "s2", criterion: "Customer COA issued and accepted", weight: 3 },
      { id: "s3", criterion: "Technical support documentation available", weight: 2 },
      { id: "s4", criterion: "Spill and emergency response training conducted", weight: 2 }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TYRE — Tyre & Rubber Manufacturing
  // ═══════════════════════════════════════════════════════════════════════
  {
    industry: "TYRE" as const,
    stage: "DISCOVERY" as const,
    deliverables: [
      { id: "d1", label: "Tyre Application Brief (PCR / TBR / OTR)", type: "DOCUMENT", required: true },
      { id: "d2", label: "Performance Target Sheet (Rolling Resistance / Wet Grip)", type: "DOCUMENT", required: true },
      { id: "d3", label: "Competitive Tyre Benchmarking", type: "DOCUMENT", required: false },
      { id: "d4", label: "Regulatory Label Class Target (EU/ECE)", type: "DOCUMENT", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Target tyre size, load index and speed rating defined" },
      { id: "m2", criterion: "EU Tyre Label target class defined (RR, WG, noise)" },
      { id: "m3", criterion: "No SVHC or PAH-restricted compounds in proposed materials" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "EU Label minimum class B/B targeted", weight: 3 },
      { id: "s2", criterion: "Target market volume > 100,000 units/year", weight: 3 },
      { id: "s3", criterion: "Silica technology considered for low rolling resistance", weight: 2 },
      { id: "s4", criterion: "REACH SVHC and PAH limits considered from outset", weight: 2 }
    ]
  },
  {
    industry: "TYRE" as const,
    stage: "FEASIBILITY" as const,
    deliverables: [
      { id: "d1", label: "Tread / Sidewall Compound Formula (Draft)", type: "FORMULA", required: true },
      { id: "d2", label: "Cure System & Accelerator Selection", type: "DOCUMENT", required: true },
      { id: "d3", label: "Compound Mooney Viscosity Target", type: "SPEC", required: true },
      { id: "d4", label: "Carbon Black / Silica Grade Selection", type: "DOCUMENT", required: true },
      { id: "d5", label: "Manufacturing Process Feasibility", type: "MANUAL", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Compound formulation processable on existing mixing equipment" },
      { id: "m2", criterion: "Cure system selected with no nitrosamine-forming accelerators" },
      { id: "m3", criterion: "No PAH oils above 1 mg/kg (REACH SVHC limit)" },
      { id: "m4", criterion: "Preliminary Mooney viscosity within processable range" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Silica-based tread for low rolling resistance", weight: 3 },
      { id: "s2", criterion: "Zinc oxide optimised for cure efficiency", weight: 2 },
      { id: "s3", criterion: "Compound mixing time feasible on existing Banbury mixer", weight: 2 },
      { id: "s4", criterion: "Natural rubber bio-based content maximised", weight: 1 }
    ]
  },
  {
    industry: "TYRE" as const,
    stage: "DEVELOPMENT" as const,
    deliverables: [
      { id: "d1", label: "Approved Compound Formula (v1.0)", type: "FORMULA", required: true },
      { id: "d2", label: "Finished Good Tyre Item Created", type: "ITEM", required: true },
      { id: "d3", label: "Vulcanisation Cure Curve (MDR / RPA)", type: "DOCUMENT", required: true },
      { id: "d4", label: "Physical Property Test Report (Tensile / Hardness / Abrasion)", type: "DOCUMENT", required: true },
      { id: "d5", label: "DMA Tan Delta Profile (RR and WG prediction)", type: "DOCUMENT", required: true },
      { id: "d6", label: "Pilot Tyre Build and Wheel Test Report", type: "DOCUMENT", required: true },
      { id: "d7", label: "SDS for Compound", type: "DOCUMENT", required: true }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Compound physical properties meet design targets" },
      { id: "m2", criterion: "Pilot tyre passes internal wheel endurance test" },
      { id: "m3", criterion: "Tan delta profile predicts EU label class target" },
      { id: "m4", criterion: "No blooming, porosity or cure defects in pilot tyres" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Abrasion loss < 0.08 cm3/km (Akron)", weight: 3 },
      { id: "s2", criterion: "Wet grip mu > 0.65 on internal skid trailer", weight: 3 },
      { id: "s3", criterion: "Tread temperature under braking < 120°C", weight: 2 },
      { id: "s4", criterion: "Compound Mooney consistency (CV < 5%)", weight: 2 }
    ]
  },
  {
    industry: "TYRE" as const,
    stage: "VALIDATION" as const,
    deliverables: [
      { id: "d1", label: "ECE R30 / ECE R54 Type Approval Test Report", type: "DOCUMENT", required: true },
      { id: "d2", label: "EU Tyre Label Declaration (RR / WG / Noise)", type: "DOCUMENT", required: true },
      { id: "d3", label: "Final Tyre Specification (Released)", type: "SPEC", required: true },
      { id: "d4", label: "Production Curing Profile Validated", type: "DOCUMENT", required: true },
      { id: "d5", label: "REACH Substance Declaration for Tyre", type: "DOCUMENT", required: true },
      { id: "d6", label: "End-of-Line Uniformity and Geometry Report", type: "DOCUMENT", required: true },
      { id: "d7", label: "Quality Control Plan", type: "DOCUMENT", required: true }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "ECE type approval obtained for tyre size" },
      { id: "m2", criterion: "EU tyre label class declared and verified" },
      { id: "m3", criterion: "Production cure cycle validated — no under/over cure" },
      { id: "m4", criterion: "Uniformity (RFV, LFV) within tyre industry norms" },
      { id: "m5", criterion: "REACH substance of concern declaration complete" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "First pass yield > 97% in production validation", weight: 3 },
      { id: "s2", criterion: "Vehicle OEM homologation received (if applicable)", weight: 3 },
      { id: "s3", criterion: "Road noise < 70 dB (ECE R117 pass)", weight: 2 },
      { id: "s4", criterion: "Tyre uniformity Cpk > 1.33 on key dimensions", weight: 2 }
    ]
  },
  {
    industry: "TYRE" as const,
    stage: "LAUNCH" as const,
    deliverables: [
      { id: "d1", label: "Tyre Item and Formula RELEASED in PLM", type: "ITEM", required: true },
      { id: "d2", label: "Formula Released in PLM", type: "FORMULA", required: true },
      { id: "d3", label: "EU Tyre Label Published on Product Listing", type: "DOCUMENT", required: true },
      { id: "d4", label: "ECE Type Approval Certificate Available", type: "DOCUMENT", required: true },
      { id: "d5", label: "First Commercial Production Run Completed", type: "MANUAL", required: true },
      { id: "d6", label: "Dealer / OEM Technical Bulletin", type: "DOCUMENT", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Item and Formula RELEASED in PLM" },
      { id: "m2", criterion: "ECE type approval certificate in hand" },
      { id: "m3", criterion: "EU label published on all sales and web listings" },
      { id: "m4", criterion: "First commercial shipment dispatched" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "OEM approved supplier list inclusion confirmed", weight: 3 },
      { id: "s2", criterion: "Trade channel stocking confirmed", weight: 3 },
      { id: "s3", criterion: "Launch within target date", weight: 2 },
      { id: "s4", criterion: "Technical training completed for sales and fitment teams", weight: 1 }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PAINT — Paints & Coatings
  // ═══════════════════════════════════════════════════════════════════════
  {
    industry: "PAINT" as const,
    stage: "DISCOVERY" as const,
    deliverables: [
      { id: "d1", label: "Market & Application Brief", type: "DOCUMENT", required: true },
      { id: "d2", label: "Paint Category Concept Note (Interior / Exterior / Industrial)", type: "DOCUMENT", required: true },
      { id: "d3", label: "Competitive Product Benchmarking", type: "DOCUMENT", required: false },
      { id: "d4", label: "VOC Category Pre-Screen (EU Directive 2004/42/EC)", type: "DOCUMENT", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Application category and substrate clearly defined" },
      { id: "m2", criterion: "Target VOC limit compliant with EU Directive 2004/42" },
      { id: "m3", criterion: "No banned biocides or restricted pigments in concept" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Target segment growth > 5% per year", weight: 3 },
      { id: "s2", criterion: "Waterborne (low VOC) technology preferred", weight: 3 },
      { id: "s3", criterion: "EU Ecolabel or BIS certification targeted", weight: 2 },
      { id: "s4", criterion: "TiO2 usage optimised (cost pressure)", weight: 1 }
    ]
  },
  {
    industry: "PAINT" as const,
    stage: "FEASIBILITY" as const,
    deliverables: [
      { id: "d1", label: "Paint Formulation Concept (Draft)", type: "FORMULA", required: true },
      { id: "d2", label: "Binder / Resin Selection Rationale", type: "DOCUMENT", required: true },
      { id: "d3", label: "Pigment and Extender Grade Selection", type: "DOCUMENT", required: true },
      { id: "d4", label: "VOC Calculation Sheet", type: "DOCUMENT", required: true },
      { id: "d5", label: "Biocide Selection (BPR compliant)", type: "DOCUMENT", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Formulation VOC below category limit (EU Directive 2004/42)" },
      { id: "m2", criterion: "Binder selected for target substrate and durability" },
      { id: "m3", criterion: "No restricted biocides or carcinogenic pigments" },
      { id: "m4", criterion: "PVC (pigment volume concentration) optimised for opacity" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "VOC < 30 g/L (EU Ecolabel threshold)", weight: 3 },
      { id: "s2", criterion: "TiO2 content optimised to < 15% via extender use", weight: 2 },
      { id: "s3", criterion: "Wet paint density within 1.2-1.5 kg/L", weight: 2 },
      { id: "s4", criterion: "Water-based system (no aromatic solvents)", weight: 2 }
    ]
  },
  {
    industry: "PAINT" as const,
    stage: "DEVELOPMENT" as const,
    deliverables: [
      { id: "d1", label: "Approved Paint Formula (v1.0)", type: "FORMULA", required: true },
      { id: "d2", label: "Finished Good Item Created", type: "ITEM", required: true },
      { id: "d3", label: "Lab Paint Test Report (contrast ratio, viscosity, drying)", type: "DOCUMENT", required: true },
      { id: "d4", label: "Scrub Resistance Report (ISO 11998)", type: "DOCUMENT", required: true },
      { id: "d5", label: "Outdoor / Accelerated Weathering Study Initiated", type: "DOCUMENT", required: false },
      { id: "d6", label: "Tinting System Compatibility Test (if applicable)", type: "DOCUMENT", required: false },
      { id: "d7", label: "SDS and REACH Compliance Declaration", type: "DOCUMENT", required: true }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Contrast ratio >= 0.97 at 100 micron DFT" },
      { id: "m2", criterion: "Scrub resistance passes ISO 11998 Class 1 or 2" },
      { id: "m3", criterion: "Drying time (touch dry) < 30 min at 23 degrees C" },
      { id: "m4", criterion: "SDS compliant with REACH Annex II" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Spreading rate > 10 m2/L per coat", weight: 3 },
      { id: "s2", criterion: "pH 8.5-9.5 (for waterborne)", weight: 2 },
      { id: "s3", criterion: "KU viscosity stable after 3-month storage at 50 degrees C", weight: 3 },
      { id: "s4", criterion: "Colour strength (tinting response) meets tolerance", weight: 2 }
    ]
  },
  {
    industry: "PAINT" as const,
    stage: "VALIDATION" as const,
    deliverables: [
      { id: "d1", label: "Production Scale Batch Report (3 batches)", type: "DOCUMENT", required: true },
      { id: "d2", label: "Final Product Specification (Released)", type: "SPEC", required: true },
      { id: "d3", label: "BIS / EU Ecolabel Certification (if targeted)", type: "DOCUMENT", required: false },
      { id: "d4", label: "Packaging Compatibility & Fill Accuracy", type: "DOCUMENT", required: true },
      { id: "d5", label: "Long-term Storage Stability (6 months)", type: "DOCUMENT", required: true },
      { id: "d6", label: "VOC Verification Test (independent lab)", type: "DOCUMENT", required: true },
      { id: "d7", label: "Quality Control Plan and Colour Standard", type: "DOCUMENT", required: true }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "3 production batches pass full in-process and finished paint QC" },
      { id: "m2", criterion: "VOC verified by independent lab below category limit" },
      { id: "m3", criterion: "6-month storage stability confirmed (no settling, skinning)" },
      { id: "m4", criterion: "Label conforms to GHS, BIS and applicable regional regulations" },
      { id: "m5", criterion: "Colour standard established and archived" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Batch yield > 98%", weight: 3 },
      { id: "s2", criterion: "BIS ISI mark obtained for applicable category", weight: 3 },
      { id: "s3", criterion: "Contractor / painter application trial positive", weight: 2 },
      { id: "s4", criterion: "Delta E < 0.5 vs colour master batch-to-batch", weight: 2 }
    ]
  },
  {
    industry: "PAINT" as const,
    stage: "LAUNCH" as const,
    deliverables: [
      { id: "d1", label: "Item and Formula RELEASED in PLM", type: "ITEM", required: true },
      { id: "d2", label: "Formula Released in PLM", type: "FORMULA", required: true },
      { id: "d3", label: "Product Data Sheet (PDS) Published", type: "DOCUMENT", required: true },
      { id: "d4", label: "SDS Distributed to Trade Partners", type: "DOCUMENT", required: true },
      { id: "d5", label: "Trade / Dealer Stock Confirmed", type: "MANUAL", required: true },
      { id: "d6", label: "Tinted Colour Range Confirmed (if applicable)", type: "MANUAL", required: false }
    ],
    mustMeetCriteria: [
      { id: "m1", criterion: "Item and Formula RELEASED in PLM" },
      { id: "m2", criterion: "PDS and SDS available in required languages" },
      { id: "m3", criterion: "MRP and trade price set and communicated" },
      { id: "m4", criterion: "First commercial batch dispatched to distribution" }
    ],
    shouldMeetCriteria: [
      { id: "s1", criterion: "Trade partner stock confirmed before launch", weight: 3 },
      { id: "s2", criterion: "Launch advertising / sampling campaign live", weight: 2 },
      { id: "s3", criterion: "Launch on or ahead of target date", weight: 3 },
      { id: "s4", criterion: "Painter / contractor technical demo completed", weight: 2 }
    ]
  }
];

export async function seedStageGateTemplates(prisma: PrismaClient) {
  for (const template of templates) {
    await prisma.stageGateTemplate.upsert({
      where: { industry_stage: { industry: template.industry, stage: template.stage } },
      update: {
        deliverables: template.deliverables,
        mustMeetCriteria: template.mustMeetCriteria,
        shouldMeetCriteria: template.shouldMeetCriteria
      },
      create: template
    });
  }
  console.log(`  ✓ ${templates.length} stage-gate templates seeded across ${new Set(templates.map(t => t.industry)).size} industries`);
}
