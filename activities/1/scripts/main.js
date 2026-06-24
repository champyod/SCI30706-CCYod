"use strict";

/* ========================================
   MWIT Campus Tour — Building Data & Interaction
   Center coordinates from MAIN-OPH-2025 reference
   ======================================== */

const BUILDINGS = [
  // bldg1 — อาคารมหิดลวิทยานุสรณ์ 1
  {
    id: "bldg1",
    nameTH: "อาคารมหิดลวิทยานุสรณ์ 1",
    nameEN: "Bldg 1",
    type: "academic",
    subtitle: "อาคารเรียนหลัก",
    tl: [76.066, 53.7325],
    tr: [82.3562, 53.7325],
    bl: [76.066, 86.9792],
    br: [82.3562, 86.9792],
    floors: [
      { floor: "ชั้น 1", rooms: ["ห้องเรียน (9 ห้อง)"] },
      { floor: "ชั้น 2", rooms: ["ห้องคอมพิวเตอร์", "ศูนย์คอมพิวเตอร์"] },
      { floor: "ชั้น 3", rooms: ["ห้องเรียนคณิตศาตร์ร์", "ห้องครูคณิตศาตร์ร์"] },
      { floor: "ชั้น 4", rooms: ["หอประชุม Dr.Kovit"] },
      { floor: "ชั้น 5", rooms: ["ห้องเรียนศิลปศาสตร์ร์ (3 ห้อง)", "สำนักงาน"] },
      { floor: "ชั้น 6", rooms: ["ห้องเรียนศิลปศาสตร์ร์ (5 ห้อง)", "สำนักงาน"] },
      { floor: "ชั้น 7", rooms: ["ห้องเรียนภาษาต่างประเทศ", "ห้องครูภาษาต่างประเทศ"] },
    ],
  },
  // bldg2 — อาคารมหิดลวิทยานุสรณ์ 2
  {
    id: "bldg2",
    nameTH: "อาคารมหิดลวิทยานุสรณ์ 2",
    nameEN: "Bldg 2",
    type: "academic",
    subtitle: "อาคารเรียน — ชั้น 1-2 ห้องสมุด",
    tl: [60.9375, 70.3559],
    tr: [76.0417, 70.3559],
    bl: [60.9375, 87.0226],
    br: [76.0417, 87.0226],
    floors: [
      { floor: "ชั้น 1", rooms: ["ห้องสมุด"] },
      { floor: "ชั้น 2", rooms: ["ห้องสมุด"] },
      { floor: "ชั้น 3", rooms: ["ห้องเรียนคณิตศาตร์ร์ (4 ห้อง)"] },
      { floor: "ชั้น 4", rooms: ["หอประชุม Dr.Nut"] },
      { floor: "ชั้น 5", rooms: ["ห้องเรียนภูมิศาสตร์ร์", "ห้องครูเคมี"] },
      { floor: "ชั้น 6", rooms: ["ห้องครูฟิสิกส์"] },
      { floor: "ชั้น 7", rooms: ["ห้องเรียนภาษาต่างประเทศ (4 ห้อง)"] },
    ],
  },
  // bldg3 — อาคารมหิดลวิทยานุสรณ์ 3 (Co-Learning Space floors 1-2)
  {
    id: "bldg3",
    nameTH: "อาคารมหิดลวิทยานุสรณ์ 3",
    nameEN: "Bldg 3",
    type: "academic",
    subtitle: "อาคารปฏิบัติการ — ชั้น 1-2 Co-Learning Space (ปรับปรุงใหม่)",
    tl: [53.057, 59.3091],
    tr: [60.9375, 59.3091],
    bl: [53.057, 86.9582],
    br: [60.9375, 86.9582],
    floors: [
      { floor: "ชั้น 1", rooms: ["Co-Learning Space (ปรับปรุงใหม่)"] },
      { floor: "ชั้น 2", rooms: ["Co-Learning Space (ปรับปรุงใหม่)"] },
      { floor: "ชั้น 3", rooms: ["ห้องเรียนชีววิทยา", "ห้องครูชีววิทยา"] },
      { floor: "ชั้น 4", rooms: ["ห้องปฏิบัติการชีววิทยา (3)"] },
      { floor: "ชั้น 5", rooms: ["ห้องโครงงานเคมี", "ห้องเรียนเคมี"] },
      { floor: "ชั้น 6", rooms: ["ห้องเรียนเคมี", "ห้องปฏิบัติการเคมี", "ห้องเรียนดาราศาสตร์ร์"] },
      { floor: "ชั้น 7", rooms: ["ห้องเรียนฟิสิกส์", "ห้องปฏิบัติการฟิสิกส์"] },
    ],
  },
  // bldg5 — โรงอาหาร และหอประชุมพระอุบาลีคุณูปมาจารย์
  {
    id: "bldg5",
    nameTH: "โรงอาหาร และหอประชุมพระอุบาลีคุณูปมาจารย์",
    nameEN: "Cafeteria & Auditorium",
    type: "facilities",
    subtitle: "โรงอาหารและหอประชุม",
    tl: [25.2604, 68.504],
    tr: [44.0104, 68.504],
    bl: [25.2604, 87.0226],
    br: [44.0104, 87.0226],
    floors: [
      { floor: "ชั้น 1", rooms: ["โรงอาหาร", "ร้านค้า", "ห้องเก็บของ"] },
      { floor: "ชั้น 2", rooms: ["หอประชุม", "ห้องประชุม", "ห้องเก็บอุปกรณ์"] },
      { floor: "ชั้น 3", rooms: ["ห้องพัก (3)", "ห้องเก็บของ"] },
    ],
  },
  // bldg6 — ศูนย์กีฬา
  {
    id: "bldg6",
    nameTH: "ศูนย์กีฬา",
    nameEN: "Sports Center",
    type: "sports",
    subtitle: "ศูนย์กีฬา",
    tl: [5.1992, 59.2285],
    tr: [22.6329, 59.2285],
    bl: [5.1992, 87.0388],
    br: [22.6329, 87.0388],
    floors: [
      { floor: "ชั้น 1", rooms: ["ห้องเรียน", "ห้องประชุม", "สำนักงาน", "หอพัก", "สระว่ายน้ำ"] },
      { floor: "ชั้น 2", rooms: ["สำนักงาน", "ห้องออกกำลังกาย", "หอพัก"] },
      { floor: "ชั้น 3", rooms: ["ห้องเรียน", "สำนักงาน (2)", "ห้องเก็บอุปกรณ์"] },
      { floor: "ชั้น 4", rooms: ["สำนักงาน (2)", "ห้องเก็บอุปกรณ์"] },
    ],
  },
  // bldg7 — อาคารหอพักชาย
  {
    id: "bldg7",
    nameTH: "อาคารหอพักชาย",
    nameEN: "Male Dorm",
    type: "dormitory",
    subtitle: "หอพักนักเรียนชาย",
    tl: [86.2865, 21.5661],
    tr: [92.2011, 21.5661],
    bl: [86.2865, 42.6],
    br: [92.2011, 42.6],
    floors: [
      { floor: "ชั้น 1", rooms: ["หอพัก (9 ห้อง)", "ห้องพักครู", "ห้องครูชาย"] },
      { floor: "ชั้น 2", rooms: ["หอพัก (7 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 3", rooms: ["หอพัก (7 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 4", rooms: ["หอพัก (7 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 5", rooms: ["หอพัก (10 ห้อง)", "ห้องน้ำรวม"] },
    ],
  },
  // bldg8 — อาคารหอพักชาย
  {
    id: "bldg8",
    nameTH: "อาคารหอพักชาย",
    nameEN: "Male Dorm",
    type: "dormitory",
    subtitle: "หอพักนักเรียนชาย (อาคารยาวด้านบน)",
    tl: [75.0484, 8.7384],
    tr: [92.1391, 8.7384],
    bl: [75.0484, 18.5347],
    br: [92.1391, 18.5347],
    floors: [
      { floor: "ชั้น 1", rooms: ["ห้องครู", "หอพัก (7 ห้อง)", "ห้องเก็บของ", "ห้องน้ำ"] },
      { floor: "ชั้น 2", rooms: ["หอพัก (7 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 3", rooms: ["หอพัก (7 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 4", rooms: ["หอพัก (7 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 5", rooms: ["หอพัก (10 ห้อง)", "ห้องน้ำรวม"] },
    ],
  },
  // bldg9 — อาคารหอพัก
  {
    id: "bldg9",
    nameTH: "อาคารหอพัก",
    nameEN: "Dorm",
    type: "dormitory",
    subtitle: "หอพักนักเรียน",
    tl: [52.6103, 9.0138],
    tr: [60.4106, 9.0138],
    bl: [52.6103, 49.9747],
    br: [60.4106, 49.9747],
    floors: [
      { floor: "ชั้น 1", rooms: ["หอพัก", "สำนักงาน", "ห้องเก็บของ"] },
      { floor: "ชั้น 2", rooms: ["Side A: หอพักหญิง — Side B: หอพักชาย", "ห้องดนตรี", "ห้องประวัติศาตร์ร์", "ห้องน้ำ"] },
      { floor: "ชั้น 2.5", rooms: ["ห้องอ่านหนังสือ", "ห้องศึกษาค้นคว้า"] },
      { floor: "ชั้น 3-7", rooms: ["หอพัก (ชั้นละ 26 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 7.5", rooms: ["ห้องเก็บของ"] },
      { floor: "ชั้น 8", rooms: ["หอพักครู (12 ห้อง)", "ห้องน้ำ"] },
      { floor: "ชั้น 9", rooms: ["หอพักครู (4 ห้อง)", "ห้องน้ำ"] },
    ],
  },
  // bldg10 — สำนักงานหอพัก ศูนย์พยาบาล และห้องรับรอง
  {
    id: "bldg10",
    nameTH: "สำนักงานหอพัก ศูนย์พยาบาล และห้องรับรอง",
    nameEN: "Dorm Office & Clinic",
    type: "dormitory",
    subtitle: "สำนักงานหอพัก ศูนย์พยาบาล และห้องรับรอง",
    tl: [76.0484, 26.633],
    tr: [82.2849, 26.633],
    bl: [76.0484, 46.357],
    br: [82.2849, 46.357],
    floors: [
      { floor: "ชั้น 1", rooms: ["สำนักงาน (3)", "ห้องพัก", "ห้องประชุม"] },
      { floor: "ชั้น 2", rooms: ["ศูนย์พยาบาล", "ห้องพัก (4)"] },
      { floor: "ชั้น 3", rooms: ["หอพัก (4 ห้อง)"] },
    ],
  },
  // bldg11 — อาคารรับรอง
  {
    id: "bldg11",
    nameTH: "อาคารรับรอง",
    nameEN: "Guest House",
    type: "facilities",
    subtitle: "อาคารรับรอง",
    tl: [84.8958, 43.504],
    tr: [92.1875, 43.504],
    bl: [84.8958, 52.7633],
    br: [92.1875, 52.7633],
    floors: [
      { floor: "ชั้น 1", rooms: ["ห้องประชุม", "ห้องเก็บของ"] },
      { floor: "ชั้น 2", rooms: ["ห้องพักรับรอง (5 ห้อง)"] },
      { floor: "ชั้น 3", rooms: ["ห้องพักรับรอง (5 ห้อง)"] },
    ],
  },
  // bldg12 — บ้านพักผู้อำนวยการ
  {
    id: "bldg12",
    nameTH: "บ้านพักผู้อำนวยการ",
    nameEN: "Director's Residence",
    type: "facilities",
    subtitle: "บ้านพักผู้อำนวยการ",
    tl: [84.8958, 52.7633],
    tr: [92.1875, 52.7633],
    bl: [84.8958, 72.2077],
    br: [92.1875, 72.2077],
    floors: [
      { floor: "ชั้น 1", rooms: ["บ้านพัก", "ห้องประชุม", "ห้องน้ำ"] },
      { floor: "ชั้น 2", rooms: ["หอพัก (4 ห้อง)", "ห้องน้ำ"] },
    ],
  },
  // bldg13 — อาคารซัก อบ รีด
  {
    id: "bldg13",
    nameTH: "อาคารซัก อบ รีด",
    nameEN: "Laundry",
    type: "facilities",
    subtitle: "อาคารซัก อบ รีด",
    tl: [60.603, 12.9344],
    tr: [66.6365, 12.9344],
    bl: [60.603, 20.3121],
    br: [66.6365, 20.3121],
    floors: [],
    description: "บริการซักรีดรวมสำหรับนักเรียน",
  },
  // bldg14 — อาคารรับรอง
  {
    id: "bldg14",
    nameTH: "อาคารรับรอง",
    nameEN: "Guest House",
    type: "facilities",
    subtitle: "อาคารรับรอง",
    tl: [67.6442, 9.2173],
    tr: [74.8108, 9.2173],
    bl: [67.6442, 18.4071],
    br: [74.8108, 18.4071],
    floors: [
      { floor: "ชั้น 1", rooms: ["ห้องพักรับรอง"] },
      { floor: "ชั้น 2-5", rooms: ["ห้องพักรับรอง (ชั้นละ 7 ห้อง)", "ห้องเก็บของ"] },
    ],
  },
  // bldg15 — โรงฝึกงาน และเรือนเพาะชำ
  {
    id: "bldg15",
    nameTH: "โรงฝึกงาน และเรือนเพาะชำ",
    nameEN: "Workshop & Nursery",
    type: "academic",
    subtitle: "โรงฝึกงานและเรือนเพาะชำ",
    tl: [84.8958, 73.1337],
    tr: [92.1875, 73.1337],
    bl: [84.8958, 87.0226],
    br: [92.1875, 87.0226],
    floors: [
      { floor: "ชั้น 1", rooms: ["ห้องปฏิบัติการ", "สำนักงาน"] },
      { floor: "ชั้น 2", rooms: ["ห้องปฏิบัติการ (3)", "ห้องเก็บของ"] },
      { floor: "ชั้น 3", rooms: ["ห้องปฏิบัติการ"] },
    ],
  },
  // bldg16 — อาคารอเนกประสงค์ (constructed on bldg4+bldg17)
  {
    id: "bldg16",
    nameTH: "อาคารอเนกประสงค์",
    nameEN: "Multi-Purpose Bldg",
    type: "facilities",
    subtitle: "อาคารอเนกประสงค์ (สร้างทดแทนอาคาร 4 และ 17 เดิม)",
    tl: [44.0104, 61.0966],
    tr: [52.8646, 61.0966],
    bl: [44.0104, 87.0226],
    br: [52.8646, 87.0226],
    floors: [],
    description: "อาคารอเนกประสงค์ สร้างบนพื้นที่รวมของอาคาร 4 และ 17 เดิม",
  },
  // bldg17 — สมาคมผู้ปกครอง
  {
    id: "bldg17",
    nameTH: "สมาคมผู้ปกครอง",
    nameEN: "Parent Association",
    type: "facilities",
    subtitle: "ห้องสมาคมผู้ปกครอง",
    tl: [33.9402, 8.9931],
    tr: [51.0557, 8.9931],
    bl: [33.9402, 16.9543],
    br: [51.0557, 16.9543],
    floors: [],
    description: "ห้องสมาคมผู้ปกครอง",
  },
  // security_house_1 — ป้อมรักษาความปลอดภัย ซ้าย
  {
    id: "security_house_1",
    nameTH: "ป้อมรักษาความปลอดภัย ซ้าย",
    nameEN: "Security Booth (Left)",
    type: "facilities",
    subtitle: "ป้อมรักษาความปลอดภัย (ฝั่งซ้าย)",
    tl: [4.1667, 50.9114],
    tr: [7.8125, 50.9114],
    bl: [4.1667, 55.5411],
    br: [7.8125, 55.5411],
  },
];

const BUILDING_TYPES = {
  academic: {
    roofStroke: "oklch(0.62 0.072 158)",
    roofFill: "oklch(0.62 0.072 158 / 0.12)",
    labelColor: "oklch(0.62 0.072 158)",
    listColor: "oklch(0.75 0.072 158)",
    listLabel: "\u0E2D\u0E32\u0E04\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19",
  },
  dormitory: {
    roofStroke: "oklch(0.5 0.062 176)",
    roofFill: "oklch(0.5 0.062 176 / 0.12)",
    labelColor: "oklch(0.5 0.062 176)",
    listColor: "oklch(0.7 0.062 176)",
    listLabel: "\u0E2B\u0E2D\u0E1E\u0E31\u0E01",
  },
  sports: {
    roofStroke: "oklch(0.85 0.112 99)",
    roofFill: "oklch(0.85 0.112 99 / 0.12)",
    labelColor: "oklch(0.85 0.112 99)",
    listColor: "oklch(0.88 0.112 99)",
    listLabel: "\u0E01\u0E35\u0E2C\u0E32",
  },
  facilities: {
    roofStroke: "oklch(0.6 0 0)",
    roofFill: "oklch(0.6 0 0 / 0.12)",
    labelColor: "oklch(0.6 0 0)",
    listColor: "oklch(0.75 0 0)",
    listLabel: "\u0E2A\u0E34\u0E48\u0E07\u0E2D\u0E33\u0E19\u0E27\u0E22\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E30\u0E14\u0E27\u0E01",
  },
};

const VALID_BUILDING_TYPES = Object.freeze(Object.keys(BUILDING_TYPES));
BUILDINGS.forEach(function (building) {
  if (!VALID_BUILDING_TYPES.includes(building.type)) {
    console.error(
      "Building " + building.id + " has unknown type '" + building.type +
      "'. Valid types: " + VALID_BUILDING_TYPES.join(", ")
    );
  }
});

// Non-building areas — text labels only
const LABELS = [
  { id:"football_field",   text:"สนามฟุตบอล",      tl:[8.3318,16.9056], tr:[51.0432,16.9056], bl:[8.3318,49.9883],   br:[51.0432,49.9883] },
  { id:"futsal_field",     text:"สนามฟุตซอล",      tl:[60.4167,23.15],  tr:[74.8514,23.15],   bl:[60.4167,41.6359],  br:[74.8514,41.6359] },
  { id:"basketball_court", text:"สนามบาสเกตบอล",   tl:[60.9375,54.6151], tr:[76.0417,54.6151], bl:[60.9375,70.3559],  br:[76.0417,70.3559] },
  { id:"stand",            text:"แสตนสี",           tl:[14.5833,9.0353],  tr:[33.9402,9.0353],  bl:[14.5833,16.9546],  br:[33.9402,16.9546] },
];

/* ===== Render Buildings ===== */

function renderBuildings() {
  const mapElement = document.getElementById("mapEl");
  if (!mapElement) return;

  BUILDINGS.forEach(function (building) {
    const width = building.tr[0] - building.tl[0];
    const height = building.bl[1] - building.tl[1];

    const buildingNumberMatch = building.id.match(/^bldg(\d+)$/);

    const element = document.createElement("div");
    element.className = "building building-" + building.type;
    element.style.left = building.tl[0] + "%";
    element.style.top = building.tl[1] + "%";
    element.style.width = width + "%";
    element.style.height = height + "%";
    element.dataset.id = building.id;

    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(SVG_NAMESPACE, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";

    const typeConfig = BUILDING_TYPES[building.type] || BUILDING_TYPES.facilities;

    const rect = document.createElementNS(SVG_NAMESPACE, "rect");
    rect.setAttribute("x", "1.5");
    rect.setAttribute("y", "1.5");
    rect.setAttribute("width", "97");
    rect.setAttribute("height", "97");
    rect.setAttribute("fill", typeConfig.roofFill);
    rect.setAttribute("stroke", typeConfig.roofStroke);
    rect.setAttribute("stroke-width", "2");
    rect.setAttribute("rx", "1");
    svg.appendChild(rect);

    // Roof: ridge runs along long side, gable triangles on short sides
    const isLandscape = width >= height;
    const gableInset = 25; // gable peak inset from short edge (%)

    if (isLandscape) {
      // Ridge horizontal, gables at left / right edges
      const gableLeft = document.createElementNS(SVG_NAMESPACE, "polyline");
      gableLeft.setAttribute("points", "0,5 " + gableInset + ",50 0,95");
      gableLeft.setAttribute("fill", "none");
      gableLeft.setAttribute("stroke", typeConfig.roofStroke);
      gableLeft.setAttribute("stroke-width", "1");
      gableLeft.setAttribute("opacity", "0.35");
      svg.appendChild(gableLeft);

      const gableRight = document.createElementNS(SVG_NAMESPACE, "polyline");
      gableRight.setAttribute("points", "100,5 " + (100 - gableInset) + ",50 100,95");
      gableRight.setAttribute("fill", "none");
      gableRight.setAttribute("stroke", typeConfig.roofStroke);
      gableRight.setAttribute("stroke-width", "1");
      gableRight.setAttribute("opacity", "0.35");
      svg.appendChild(gableRight);

      const ridge = document.createElementNS(SVG_NAMESPACE, "line");
      ridge.setAttribute("x1", gableInset); ridge.setAttribute("y1", "50");
      ridge.setAttribute("x2", 100 - gableInset); ridge.setAttribute("y2", "50");
      ridge.setAttribute("stroke", typeConfig.roofStroke);
      ridge.setAttribute("stroke-width", "1.2");
      ridge.setAttribute("opacity", "0.5");
      svg.appendChild(ridge);

      // Slope lines from ridge to top / bottom edges
      const slopes = [
        [30, 47, 30, 18], [40, 47, 40, 14], [60, 47, 60, 14], [70, 47, 70, 18],
        [30, 53, 30, 82], [40, 53, 40, 86], [60, 53, 60, 86], [70, 53, 70, 82],
      ];
      slopes.forEach(function (point) {
        const line = document.createElementNS(SVG_NAMESPACE, "line");
        line.setAttribute("x1", point[0]); line.setAttribute("y1", point[1]);
        line.setAttribute("x2", point[2]); line.setAttribute("y2", point[3]);
        line.setAttribute("stroke", typeConfig.roofStroke);
        line.setAttribute("stroke-width", "0.6");
        line.setAttribute("opacity", "0.25");
        svg.appendChild(line);
      });
    } else {
      // Ridge vertical, gables at top / bottom edges
      const gableTop = document.createElementNS(SVG_NAMESPACE, "polyline");
      gableTop.setAttribute("points", "5,0 50," + gableInset + " 95,0");
      gableTop.setAttribute("fill", "none");
      gableTop.setAttribute("stroke", typeConfig.roofStroke);
      gableTop.setAttribute("stroke-width", "1");
      gableTop.setAttribute("opacity", "0.35");
      svg.appendChild(gableTop);

      const gableBottom = document.createElementNS(SVG_NAMESPACE, "polyline");
      gableBottom.setAttribute("points", "5,100 50," + (100 - gableInset) + " 95,100");
      gableBottom.setAttribute("fill", "none");
      gableBottom.setAttribute("stroke", typeConfig.roofStroke);
      gableBottom.setAttribute("stroke-width", "1");
      gableBottom.setAttribute("opacity", "0.35");
      svg.appendChild(gableBottom);

      const ridge = document.createElementNS(SVG_NAMESPACE, "line");
      ridge.setAttribute("x1", "50"); ridge.setAttribute("y1", gableInset);
      ridge.setAttribute("x2", "50"); ridge.setAttribute("y2", 100 - gableInset);
      ridge.setAttribute("stroke", typeConfig.roofStroke);
      ridge.setAttribute("stroke-width", "1.2");
      ridge.setAttribute("opacity", "0.5");
      svg.appendChild(ridge);

      const slopes = [
        [47, 30, 18, 30], [47, 40, 14, 40], [47, 60, 14, 60], [47, 70, 18, 70],
        [53, 30, 82, 30], [53, 40, 86, 40], [53, 60, 86, 60], [53, 70, 82, 70],
      ];
      slopes.forEach(function (point) {
        const line = document.createElementNS(SVG_NAMESPACE, "line");
        line.setAttribute("x1", point[0]); line.setAttribute("y1", point[1]);
        line.setAttribute("x2", point[2]); line.setAttribute("y2", point[3]);
        line.setAttribute("stroke", typeConfig.roofStroke);
        line.setAttribute("stroke-width", "0.6");
        line.setAttribute("opacity", "0.25");
        svg.appendChild(line);
      });
    }

    element.appendChild(svg);

    const numberElement = document.createElement("span");
    numberElement.className = "building-number";
    numberElement.textContent = buildingNumberMatch ? buildingNumberMatch[1] : "";
    const minimumDimension = Math.min(width, height);
    numberElement.style.fontSize = minimumDimension * 0.25 + 0.1 + "vw";
    element.appendChild(numberElement);

    // Click
    element.addEventListener("click", function () {
      openPanel(building);
    });

    mapElement.appendChild(element);
  });

  LABELS.forEach(function (label) {
    const width = label.tr[0] - label.tl[0];
    const height = label.bl[1] - label.tl[1];
    const element = document.createElement("div");
    element.className = "building-label";
    element.textContent = label.text;
    element.style.left = label.tl[0] + "%";
    element.style.top = label.tl[1] + "%";
    element.style.width = width + "%";
    element.style.height = height + "%";

    mapElement.appendChild(element);
  });

  // Hover dim/highlight + info bar
  const infoBarElement = document.getElementById("mapInfoBar");
  const mapContainerElement = document.getElementById("mapContainer");

  document.querySelectorAll(".building").forEach(function (element) {
    element.addEventListener("mouseenter", function () {
      mapContainerElement.classList.add("map-dimming");
      element.classList.add("building-hovered");
      const building = BUILDINGS.find(function (candidate) {
        return candidate.id === element.dataset.id;
      });
      if (building) {
        const typeConfig = BUILDING_TYPES[building.type] || BUILDING_TYPES.facilities;
        const colorValue = typeConfig.labelColor;
        infoBarElement.textContent = "";

        const categoryDot = document.createElement("span");
        categoryDot.className = "info-bar-category-dot";
        categoryDot.style.backgroundColor = colorValue;

        const nameElement = document.createElement("span");
        nameElement.className = "info-bar-name";
        nameElement.style.color = colorValue;
        nameElement.textContent = building.nameTH + " (" + building.nameEN + ")";

        const hintElement = document.createElement("span");
        hintElement.className = "info-bar-hint";
        hintElement.textContent = "\u2014 click for more information";

        infoBarElement.appendChild(categoryDot);
        infoBarElement.appendChild(nameElement);
        infoBarElement.appendChild(hintElement);
      }
    });

    element.addEventListener("mouseleave", function () {
      element.classList.remove("building-hovered");
      setTimeout(function () {
        if (!document.querySelector(".building-hovered")) {
          mapContainerElement.classList.remove("map-dimming");
          infoBarElement.textContent = "";
          const mainTextElement = document.createElement("span");
          mainTextElement.className = "info-bar-main";
          mainTextElement.textContent = "Mahidol Wittayanusorn School";
          infoBarElement.appendChild(mainTextElement);
        }
      }, 80);
    });
  });
}

/* ===== Panel ===== */

function openPanel(building) {
  const panel = document.getElementById("panel");
  const panelNameElement = document.getElementById("panelName");
  const panelSubtitleElement = document.getElementById("panelSub");
  const panelBodyElement = document.getElementById("panelBody");

  if (!panel || !panelNameElement || !panelSubtitleElement || !panelBodyElement) {
    console.warn("openPanel: required panel elements not found");
    return;
  }

  panelNameElement.textContent = building.nameTH + " (" + building.nameEN + ")";
  panelSubtitleElement.textContent = building.subtitle || "";
  panelBodyElement.replaceChildren();

  if (building.floors && building.floors.length > 0) {
    building.floors.forEach(function (floor) {
      const card = document.createElement("div");
      card.className = "floor-card";

      const title = document.createElement("div");
      title.className = "floor-title";
      title.textContent = floor.floor;
      card.appendChild(title);

      const rooms = document.createElement("div");
      rooms.className = "floor-rooms";

      floor.rooms.forEach(function (room) {
        const pill = document.createElement("span");
        pill.className = "room-pill";
        pill.textContent = room;
        rooms.appendChild(pill);
      });
      card.appendChild(rooms);
      panelBodyElement.appendChild(card);
    });
  } else if (building.description) {
    const descriptionElement = document.createElement("div");
    descriptionElement.className = "panel-desc";
    descriptionElement.textContent = building.description;
    panelBodyElement.appendChild(descriptionElement);
  }

  panel.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePanel() {
  const panel = document.getElementById("panel");
  if (!panel) {
    console.warn("closePanel: #panel not found");
    return;
  }
  panel.classList.remove("open");
  document.body.style.overflow = "";
}

/* ===== Render Building List (below map) ===== */

function renderBuildingList() {
  const buildingListElement = document.getElementById("buildingList");
  if (!buildingListElement) return;

  BUILDINGS.forEach(function (building) {
    const typeConfig = BUILDING_TYPES[building.type] || BUILDING_TYPES.facilities;
    const colorValue = typeConfig.listColor;
    const typeLabelText = typeConfig.listLabel;

    const buildingNumberMatch = building.id.match(/^bldg(\d+)$/);
    const displayNumber = buildingNumberMatch ? buildingNumberMatch[1] : "";

    const listItem = document.createElement("div");
    listItem.className = "building-list-item";

    const buildingNumberElement = document.createElement("span");
    buildingNumberElement.className = "building-list-number";
    buildingNumberElement.style.color = colorValue;
    buildingNumberElement.textContent = displayNumber;
    listItem.appendChild(buildingNumberElement);

    const nameElement = document.createElement("span");
    nameElement.className = "building-list-name";
    nameElement.textContent = building.nameTH;
    listItem.appendChild(nameElement);

    const nameEnglishElement = document.createElement("span");
    nameEnglishElement.className = "building-list-name-en";
    nameEnglishElement.textContent = building.nameEN;
    listItem.appendChild(nameEnglishElement);

    const typeElement = document.createElement("span");
    typeElement.className = "building-list-type";
    typeElement.style.color = colorValue;
    typeElement.textContent = typeLabelText;
    listItem.appendChild(typeElement);

    buildingListElement.appendChild(listItem);
  });
}

/* ===== Init ===== */

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) section.scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || "dark";
  root.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  renderBuildings();
  renderBuildingList();

  const panel = document.getElementById("panel");
  const panelCloseButton = document.getElementById("panelClose");
  const overlay = document.getElementById("panelOverlay");
  const scrollToMap = document.getElementById("scrollToMap");

  if (!panelCloseButton || !overlay || !panel) {
    console.warn("DOMContentLoaded: required panel elements missing");
    return;
  }

  panelCloseButton.addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && panel.classList.contains("open")) {
      closePanel();
    }
  });

  if (scrollToMap) {
    scrollToMap.addEventListener("click", function () {
      scrollToSection("map");
    });
  }
});
