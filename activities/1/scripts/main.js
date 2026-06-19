"use strict";

/* ========================================
   MWIT Campus Tour — Building Data & Interaction
   Center coordinates from MAIN-OPH-2025 reference
   ======================================== */

var BUILDINGS = [
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
  // bldg9 — อาคารหอพักหญิง
  {
    id: "bldg9",
    nameTH: "อาคารหอพักหญิง",
    nameEN: "Female Dorm",
    type: "dormitory",
    subtitle: "หอพักนักเรียนหญิง",
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

// Non-building areas — text labels only
var LABELS = [
  { id:"football_field",   text:"สนามฟุตบอล",      tl:[8.3318,16.9056], tr:[51.0432,16.9056], bl:[8.3318,49.9883],   br:[51.0432,49.9883] },
  { id:"futsal_field",     text:"สนามฟุตซอล",      tl:[60.4167,23.15],  tr:[74.8514,23.15],   bl:[60.4167,41.6359],  br:[74.8514,41.6359] },
  { id:"basketball_court", text:"สนามบาสเกตบอล",   tl:[60.9375,54.6151], tr:[76.0417,54.6151], bl:[60.9375,70.3559],  br:[76.0417,70.3559] },
  { id:"stand",            text:"แสตนสี",           tl:[14.5833,9.0353],  tr:[33.9402,9.0353],  bl:[14.5833,16.9546],  br:[33.9402,16.9546] },
];

/* ===== Render Buildings ===== */

function renderBuildings() {
  var map = document.getElementById("mapEl");
  if (!map) return;

  BUILDINGS.forEach(function (b) {
    var w = b.tr[0] - b.tl[0];
    var h = b.bl[1] - b.tl[1];

    var numMatch = b.id.match(/^bldg(\d+)$/);

    var el = document.createElement("div");
    el.className = "bldg bldg-" + b.type;
    el.style.left = b.tl[0] + "%";
    el.style.top = b.tl[1] + "%";
    el.style.width = w + "%";
    el.style.height = h + "%";
    el.dataset.id = b.id;

    var S = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(S, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";

    var c;
    if (b.type === "academic") c = { s: "oklch(0.62 0.072 158)", f: "oklch(0.62 0.072 158 / 0.12)" };
    else if (b.type === "dormitory") c = { s: "oklch(0.5 0.062 176)", f: "oklch(0.5 0.062 176 / 0.12)" };
    else if (b.type === "sports") c = { s: "oklch(0.85 0.112 99)", f: "oklch(0.85 0.112 99 / 0.12)" };
    else c = { s: "oklch(0.6 0 0)", f: "oklch(0.6 0 0 / 0.12)" };

    var rect = document.createElementNS(S, "rect");
    rect.setAttribute("x", "1.5");
    rect.setAttribute("y", "1.5");
    rect.setAttribute("width", "97");
    rect.setAttribute("height", "97");
    rect.setAttribute("fill", c.f);
    rect.setAttribute("stroke", c.s);
    rect.setAttribute("stroke-width", "2");
    rect.setAttribute("rx", "1");
    svg.appendChild(rect);

    // Roof: ridge runs along long side, gable triangles on short sides
    var isLandscape = w >= h;
    var ins = 25; // gable peak inset from short edge (%)

    if (isLandscape) {
      // Ridge horizontal, gables at left / right edges
      var gl = document.createElementNS(S, "polyline");
      gl.setAttribute("points", "0,5 " + ins + ",50 0,95");
      gl.setAttribute("fill", "none");
      gl.setAttribute("stroke", c.s);
      gl.setAttribute("stroke-width", "1");
      gl.setAttribute("opacity", "0.35");
      svg.appendChild(gl);

      var gr = document.createElementNS(S, "polyline");
      gr.setAttribute("points", "100,5 " + (100 - ins) + ",50 100,95");
      gr.setAttribute("fill", "none");
      gr.setAttribute("stroke", c.s);
      gr.setAttribute("stroke-width", "1");
      gr.setAttribute("opacity", "0.35");
      svg.appendChild(gr);

      var ridge = document.createElementNS(S, "line");
      ridge.setAttribute("x1", ins); ridge.setAttribute("y1", "50");
      ridge.setAttribute("x2", 100 - ins); ridge.setAttribute("y2", "50");
      ridge.setAttribute("stroke", c.s);
      ridge.setAttribute("stroke-width", "1.2");
      ridge.setAttribute("opacity", "0.5");
      svg.appendChild(ridge);

      // Slope lines from ridge to top / bottom edges
      var slopes = [
        [30, 47, 30, 18], [40, 47, 40, 14], [60, 47, 60, 14], [70, 47, 70, 18],
        [30, 53, 30, 82], [40, 53, 40, 86], [60, 53, 60, 86], [70, 53, 70, 82],
      ];
      slopes.forEach(function (p) {
        var ln = document.createElementNS(S, "line");
        ln.setAttribute("x1", p[0]); ln.setAttribute("y1", p[1]);
        ln.setAttribute("x2", p[2]); ln.setAttribute("y2", p[3]);
        ln.setAttribute("stroke", c.s);
        ln.setAttribute("stroke-width", "0.6");
        ln.setAttribute("opacity", "0.25");
        svg.appendChild(ln);
      });
    } else {
      // Ridge vertical, gables at top / bottom edges
      var gt = document.createElementNS(S, "polyline");
      gt.setAttribute("points", "5,0 50," + ins + " 95,0");
      gt.setAttribute("fill", "none");
      gt.setAttribute("stroke", c.s);
      gt.setAttribute("stroke-width", "1");
      gt.setAttribute("opacity", "0.35");
      svg.appendChild(gt);

      var gb = document.createElementNS(S, "polyline");
      gb.setAttribute("points", "5,100 50," + (100 - ins) + " 95,100");
      gb.setAttribute("fill", "none");
      gb.setAttribute("stroke", c.s);
      gb.setAttribute("stroke-width", "1");
      gb.setAttribute("opacity", "0.35");
      svg.appendChild(gb);

      var ridge = document.createElementNS(S, "line");
      ridge.setAttribute("x1", "50"); ridge.setAttribute("y1", ins);
      ridge.setAttribute("x2", "50"); ridge.setAttribute("y2", 100 - ins);
      ridge.setAttribute("stroke", c.s);
      ridge.setAttribute("stroke-width", "1.2");
      ridge.setAttribute("opacity", "0.5");
      svg.appendChild(ridge);

      var slopes = [
        [47, 30, 18, 30], [47, 40, 14, 40], [47, 60, 14, 60], [47, 70, 18, 70],
        [53, 30, 82, 30], [53, 40, 86, 40], [53, 60, 86, 60], [53, 70, 82, 70],
      ];
      slopes.forEach(function (p) {
        var ln = document.createElementNS(S, "line");
        ln.setAttribute("x1", p[0]); ln.setAttribute("y1", p[1]);
        ln.setAttribute("x2", p[2]); ln.setAttribute("y2", p[3]);
        ln.setAttribute("stroke", c.s);
        ln.setAttribute("stroke-width", "0.6");
        ln.setAttribute("opacity", "0.25");
        svg.appendChild(ln);
      });
    }

    el.appendChild(svg);

    var numSpan = document.createElement("span");
    numSpan.className = "bldg-number";
    numSpan.textContent = numMatch ? numMatch[1] : "";
    var minDim = Math.min(w, h);
    numSpan.style.fontSize = minDim * 0.25 + 0.1 + "vw";
    el.appendChild(numSpan);

    // Click
    el.addEventListener("click", function () {
      openPanel(b);
    });

    map.appendChild(el);
  });

  LABELS.forEach(function (l) {
    var w = l.tr[0] - l.tl[0];
    var h = l.bl[1] - l.tl[1];
    var el = document.createElement("div");
    el.className = "bldg-label";
    el.textContent = l.text;
    el.style.left = l.tl[0] + "%";
    el.style.top = l.tl[1] + "%";
    el.style.width = w + "%";
    el.style.height = h + "%";

    map.appendChild(el);
  });

  // Hover dim/highlight + info bar
  var infoBar = document.getElementById("mapInfoBar");
  var mapContainer = document.getElementById("mapContainer");

  document.querySelectorAll(".bldg").forEach(function (el) {
    el.addEventListener("mouseenter", function () {
      mapContainer.classList.add("map-dimming");
      el.classList.add("bldg-hovered");
      var b = BUILDINGS.find(function (x) {
        return x.id === el.dataset.id;
      });
      if (b) {
        var color = "";
        if (b.type === "academic") color = "oklch(0.62 0.072 158)";
        else if (b.type === "dormitory") color = "oklch(0.5 0.062 176)";
        else if (b.type === "sports") color = "oklch(0.85 0.112 99)";
        else if (b.type === "facilities") color = "oklch(0.6 0 0)";
        infoBar.innerHTML =
          '<span class="infobar-catdot" style="background:' +
          color +
          '"></span>' +
          '<span class="infobar-name" style="color:' +
          color +
          '">' +
          b.nameTH +
          " (" +
          b.nameEN +
          ")</span>" +
          '<span class="infobar-hint">\u2014 click for more information</span>';
      }
    });

    el.addEventListener("mouseleave", function () {
      el.classList.remove("bldg-hovered");
      setTimeout(function () {
        if (!document.querySelector(".bldg-hovered")) {
          mapContainer.classList.remove("map-dimming");
          infoBar.innerHTML =
            '<span class="infobar-main">Mahidol Wittayanusorn School</span>';
        }
      }, 80);
    });
  });
}

/* ===== Panel ===== */

function openPanel(building) {
  var panel = document.getElementById("panel");
  var nameEl = document.getElementById("panelName");
  var subEl = document.getElementById("panelSub");
  var bodyEl = document.getElementById("panelBody");

  nameEl.textContent = building.nameTH + " (" + building.nameEN + ")";
  subEl.textContent = building.subtitle || "";
  bodyEl.innerHTML = "";

  if (building.floors && building.floors.length > 0) {
    building.floors.forEach(function (f) {
      var card = document.createElement("div");
      card.className = "floor-card";

      var title = document.createElement("div");
      title.className = "floor-title";
      title.textContent = f.floor;
      card.appendChild(title);

      var rooms = document.createElement("div");
      rooms.className = "floor-rooms";

      f.rooms.forEach(function (r) {
        var pill = document.createElement("span");
        pill.className = "room-pill";
        pill.textContent = r;
        rooms.appendChild(pill);
      });
      card.appendChild(rooms);
      bodyEl.appendChild(card);
    });
  } else if (building.description) {
    var desc = document.createElement("div");
    desc.className = "panel-desc";
    desc.textContent = building.description;
    bodyEl.appendChild(desc);
  }

  panel.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePanel() {
  var panel = document.getElementById("panel");
  panel.classList.remove("open");
  document.body.style.overflow = "";
}

/* ===== Render Building List (below map) ===== */

function renderBuildingList() {
  var container = document.getElementById("buildingList");
  if (!container) return;

  BUILDINGS.forEach(function (b) {
    var color = "";
    var typeLabel = "";
    if (b.type === "academic") {
      color = "oklch(0.75 0.072 158)";
      typeLabel = "อาคารเรียน";
    } else if (b.type === "dormitory") {
      color = "oklch(0.7 0.062 176)";
      typeLabel = "หอพัก";
    } else if (b.type === "sports") {
      color = "oklch(0.88 0.112 99)";
      typeLabel = "กีฬา";
    } else if (b.type === "facilities") {
      color = "oklch(0.75 0 0)";
      typeLabel = "สิ่งอำนวยความสะดวก";
    }

    var numMatch = b.id.match(/^bldg(\d+)$/);
    var displayNum = numMatch ? numMatch[1] : "";

    var item = document.createElement("div");
    item.className = "bldg-list-item";
    item.innerHTML =
      '<span class="bli-num" style="color:' +
      color +
      '">' +
      displayNum +
      "</span>" +
      '<span class="bli-name">' +
      b.nameTH +
      "</span>" +
      '<span class="bli-name-en">' +
      b.nameEN +
      "</span>" +
      '<span class="bli-type" style="color:' +
      color +
      '">' +
      typeLabel +
      "</span>";
    container.appendChild(item);
  });
}

/* ===== Init ===== */

document.addEventListener("DOMContentLoaded", function () {
  renderBuildings();
  renderBuildingList();

  var panel = document.getElementById("panel");
  var closeBtn = document.getElementById("panelClose");
  var overlay = document.getElementById("panelOverlay");
  var scrollBtn = document.getElementById("scrollToMap");

  closeBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("open")) {
      closePanel();
    }
  });

  if (scrollBtn) {
    scrollBtn.addEventListener("click", function () {
      document.getElementById("map").scrollIntoView({ behavior: "smooth" });
    });
  }
});
