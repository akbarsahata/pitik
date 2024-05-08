// WARNING: PLEASE EDIT THIS FILE (CONTENTS/DATA, ORDER, ETC) WITH CAUTIONS
// IT MIGHT CAUSE A LOT OF BUGS

export const USER_TYPE: Record<string, Record<string, string>> = {
  IO: { short: "IO", full: "iotoperations" },
  IS: { short: "IS", full: "itsupport" },
  AI: { short: "AI", full: "adminiot" },
  SA: { short: "SA", full: "superadminiot" },
  AK: { short: "AK", full: "poultry worker" },
  KK: { short: "KK", full: "poultry leader" },
  OWN: { short: "OWN", full: "owner" },
  PPL: { short: "PPL", full: "ppl" },
  ADM: { short: "ADM", full: "admin" },
  AM: { short: "AM", full: "area manager" },
  MM: { short: "MM", full: "mitra manager" },
  BU: { short: "BU", full: "pembantu umum" },
  GM: { short: "GM", full: "general manager" },
  VP: { short: "VP", full: "vice president" },
  CL: { short: "CL", full: "c level" },
};

export const CHICK_SUPPLIER: string[] = [
  "PT. Golden Chicken",
  "Sabas",
  "Sido Agung",
  "PT. Chareon Pokphand Indonesia",
  "PT. Japfa Comfeed Indonesia",
  "New Hope",
  "Wonokoyo",
  "KMS",
  "Berdikari",
  "Cimanggis",
  "Emerald",
  "Other",
];

export const IMAGE_ERROR_DATA: string =
  "data:image/png;base64,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";

export const PERFORMANCE_SUMMARY: string[] = ["Good", "Average", "Below"];

export const PROBLEM_INFRASTRUCTURE: string[] = [
  "Kipas",
  "Genset",
  "Listrik",
  "Nipple",
  "Pemanas",
  "Tirai",
  "Inlet",
];

export const PROBLEM_MANAGEMENT: string[] = [
  "Lack of ABK Skills",
  "Less Cooperative Owner",
  "Harvest Trouble",
];

export const PROBLEM_FARM_INPUT: string[] = [
  "Low Quality - DOC",
  "Low Quality - Feed",
];

export const PROBLEM_DISEASES: string[] = [
  "IBD/Gumboro",
  "CRD",
  "Colli",
  "CRD Komlpeks",
  "Omphalitis",
  "Asper",
  "NE",
  "ND",
  "IBH",
  "Coccidiosis",
  "Helicopter Diseases",
];

export const PROBLEM_FORCE_MAJEURE: string[] = [
  "Kebakaran",
  "Kebanjiran",
  "Kandang Roboh",
];

export const TREATMENT: string[] = [
  "Antibiotik",
  "Vitamin",
  "Probiotik",
  "Herbal",
  "Premix",
  "Vaksin",
  "Acidifier",
  "Paracetamol",
  "Manajemen Sekam",
  "Manajemen Ventilasi",
  "Penjarangan",
  "Seleksi Ayam/Culling",
  "Air Gula",
  "Elektrolit",
  "Grading (Pemisahan Ukuran Ayam)",
  "Pelebaran",
  "Desinfektan",
];

export const CONTROLLER: string[] = [
  "Punos",
  "Punos 313",
  "Temptron 304",
  "Temptron 607",
  "Other",
];

export const INLET: string[] = ["Paranet", "Other"];

export const HEATER: string[] = [
  "Gasolec",
  "Heater Saver",
  "Kayu Bakar",
  "Tornado",
  "Other",
];

export const CONTRACT: string[] = ["Cost Plus", "Mitra Garansi", "Own Farm"];

export const INLET_POSITION: string[] = ["DEPAN", "SAMPING", "LETTER_U"];

export const REASON_REPOPULATE: string[] = [
  "DOC dead during shipping",
  "High mortality during brooding period",
  "Fire",
  "Flood",
  "Black out",
  "Other",
];

export const VARIABLE_TYPE: string[] = ["simple", "formulated"];

export const SENSOR_POSITIONS: string[] = [
  "A1",
  "A2",
  "A3",
  "B1",
  "B2",
  "B3",
  "C1",
  "C2",
  "C3",
];

export const SENSOR_TYPES: string[] = [
  "XIAOMI_SENSOR",
  "WIND_SPEED",
  "TEMPERATURE_SENSOR",
  "HUMIDITY_SENSOR",
  "CAMERA",
  "AMMONIA",
  "LIGHT",
];

export const FARMING_STATUS: Record<string, string> = {
  NEW: "1",
  IN_PROGRESS: "2",
  CLOSED: "3",
};

export const DEVICE_TYPE: Record<string, string> = {
  SMART_MONITORING: "SMART_MONITORING",
  SMART_CONTROLLER: "SMART_CONTROLLER",
  SMART_CAMERA: "SMART_CAMERA",
  SMART_CONVENTRON: "SMART_CONVENTRON",
  SMART_ELMON: "SMART_ELMON",
  SMART_SCALE: "SMART_SCALE",
};

export const FARMING_STATUS_HARVEST: Record<string, string> = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  PENDING: "PENDING",
  CLOSED: "CLOSED",
};

export const REALIZATION_STATUS: Record<string, string> = {
  DRAFT: "DRAFT",
  FINAL: "FINAL",
  DELETED: "DELETED",
};

export const HARVEST_MEMBER: Record<string, string> = {
  PPL: "ppl",
  OWNER: "owner",
};

export const STATUS_IOT_TICKET: string[] = [
  "OPEN",
  "ON_MAINTENANCE",
  "OTHERS",
  "RESOLVED",
];

export const PO_PRICE: string[] = ["INVOICE", "PO", "GR"];
