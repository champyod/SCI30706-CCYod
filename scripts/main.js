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
      { floor: "ชั้น 2", rooms: ["ห้องเรียน (3 ห้อง)", "ห้องประชุม", "สำนักงาน"] },
      { floor: "ชั้น 3", rooms: ["สาขา/ฝ่าย/งาน", "ห้องเรียน (3 ห้อง)"] },
      { floor: "ชั้น 4", rooms: ["สำนักงาน (3)", "ห้องประชุม"] },
      { floor: "ชั้น 5", rooms: ["ห้องเรียน (3 ห้อง)", "สำนักงาน"] },
      { floor: "ชั้น 6", rooms: ["ห้องเรียน (5 ห้อง)", "สำนักงาน"] },
      { floor: "ชั้น 7", rooms: ["ห้องเรียน (3 ห้อง)", "สำนักงาน"] },
    ],
  },
  // bldg2 — อาคารมหิดลวิทยานุสรณ์ 2
  {
    id: "bldg2",
    nameTH: "อาคารมหิดลวิทยานุสรณ์ 2",
    nameEN: "Bldg 2",
    type: "academic",
    subtitle: "อาคารเรียน (ชั้น 1-2 ศูนย์วิทยบริการ)",
    tl: [60.9375, 70.3559],
    tr: [76.0417, 70.3559],
    bl: [60.9375, 87.0226],
    br: [76.0417, 87.0226],
    floors: [
      { floor: "ชั้น 3", rooms: ["ห้องเรียน (4 ห้อง)"] },
      { floor: "ชั้น 4", rooms: ["ห้องประชุม"] },
      { floor: "ชั้น 5", rooms: ["ห้องปฏิบัติการ", "ห้องประชุม", "สำนักงาน"] },
      { floor: "ชั้น 6", rooms: ["ห้องปฏิบัติการ (2)", "สำนักงาน"] },
      { floor: "ชั้น 7", rooms: ["ห้องเรียน (4 ห้อง)"] },
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
      { floor: "ชั้น 3", rooms: ["ห้องเรียน", "ห้องปฏิบัติการ (2)", "สำนักงาน"] },
      { floor: "ชั้น 4", rooms: ["ห้องปฏิบัติการ (3)"] },
      { floor: "ชั้น 5", rooms: ["ห้องปฏิบัติการ", "ห้องเก็บอุปกรณ์"] },
      { floor: "ชั้น 6", rooms: ["ห้องปฏิบัติการ (3)"] },
      { floor: "ชั้น 7", rooms: ["ห้องปฏิบัติการ (3)"] },
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
  // bldg7 — อาคารหอพักหญิง
  {
    id: "bldg7",
    nameTH: "อาคารหอพักหญิง",
    nameEN: "Female Dorm",
    type: "dormitory",
    subtitle: "หอพักนักเรียนหญิง",
    tl: [86.2865, 21.5661],
    tr: [92.2011, 21.5661],
    bl: [86.2865, 42.6],
    br: [92.2011, 42.6],
    floors: [
      { floor: "ชั้น 1", rooms: ["หอพัก (9 ห้อง)", "ห้องพักครู"] },
      { floor: "ชั้น 2", rooms: ["หอพัก (7 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 3", rooms: ["หอพัก (7 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 4", rooms: ["หอพัก (7 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 5", rooms: ["หอพัก (10 ห้อง)", "ห้องน้ำรวม"] },
    ],
  },
  // bldg8 — อาคารหอพักหญิง
  {
    id: "bldg8",
    nameTH: "อาคารหอพักหญิง",
    nameEN: "Female Dorm",
    type: "dormitory",
    subtitle: "หอพักนักเรียนหญิง (อาคารยาวด้านบน)",
    tl: [75.0484, 8.7384],
    tr: [92.1391, 8.7384],
    bl: [75.0484, 18.5347],
    br: [92.1391, 18.5347],
    floors: [
      { floor: "ชั้น 1", rooms: ["หอพัก (7 ห้อง)", "ห้องเก็บของ", "ห้องน้ำ"] },
      { floor: "ชั้น 2", rooms: ["หอพัก (7 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 3", rooms: ["หอพัก (7 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 4", rooms: ["หอพัก (7 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 5", rooms: ["หอพัก (10 ห้อง)", "ห้องน้ำรวม"] },
    ],
  },
  // bldg9 — อาคารหอพักชาย
  {
    id: "bldg9",
    nameTH: "อาคารหอพักชาย",
    nameEN: "Male Dorm",
    type: "dormitory",
    subtitle: "หอพักนักเรียนชาย",
    tl: [52.6103, 9.0138],
    tr: [60.4106, 9.0138],
    bl: [52.6103, 49.9747],
    br: [60.4106, 49.9747],
    floors: [
      { floor: "ชั้น 1", rooms: ["สำนักงาน", "ห้องเก็บของ"] },
      { floor: "ชั้น 2", rooms: ["ห้องดนตรี", "ห้องน้ำ"] },
      { floor: "ชั้น 2.5", rooms: ["หอประวัติ"] },
      { floor: "ชั้น 3-7", rooms: ["หอพัก (ชั้นละ 26 ห้อง)", "ห้องน้ำรวม"] },
      { floor: "ชั้น 7.5", rooms: ["ห้องเก็บของ"] },
      { floor: "ชั้น 8", rooms: ["หอพัก (12 ห้อง)", "ห้องน้ำ"] },
      { floor: "ชั้น 9", rooms: ["หอพัก (4 ห้อง)", "ห้องน้ำ"] },
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

/* ===== Render 3D Building Models ===== */

function renderBuildings() {
  var map = document.getElementById("mapEl");
  if (!map) return;

  BUILDINGS.forEach(function (b) {
    // Compute dims from 4-corner coordinates: TL gives top-left, TR-BL give width/height
    var w = b.tr[0] - b.tl[0];
    var h = b.bl[1] - b.tl[1];

    // Show building number only for numbered buildings (bldg1→"1", others→"")
    var numMatch = b.id.match(/^bldg(\d+)$/);

    var el = document.createElement("div");
    el.className = "bldg bldg-" + b.type;
    if (b.type === "academic" || b.type === "dormitory")
      el.className += " bldg-windows";
    el.style.left = b.tl[0] + "%";
    el.style.top = b.tl[1] + "%";
    el.style.width = w + "%";
    el.style.height = h + "%";
    el.dataset.id = b.id;

    // Shadow layer
    var shadow = document.createElement("div");
    shadow.className = "bldg-shadow";
    el.appendChild(shadow);

    // Front face
    var front = document.createElement("div");
    front.className = "bldg-front";
    el.appendChild(front);

    // Building number watermark (inside front)
    var numSpan = document.createElement("span");
    numSpan.className = "bldg-number";
    numSpan.textContent = numMatch ? numMatch[1] : "";
    var minDim = Math.min(w, h);
    numSpan.style.fontSize = minDim * 0.25 + 0.1 + "vw";
    front.appendChild(numSpan);

    // Click
    el.addEventListener("click", function () {
      openPanel(b);
    });

    map.appendChild(el);
  });

  // Render non-building labels (football field, futsal, basketball)
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
      color = "oklch(0.62 0.072 158)";
      typeLabel = "อาคารเรียน";
    } else if (b.type === "dormitory") {
      color = "oklch(0.5 0.062 176)";
      typeLabel = "หอพัก";
    } else if (b.type === "sports") {
      color = "oklch(0.85 0.112 99)";
      typeLabel = "กีฬา";
    } else if (b.type === "facilities") {
      color = "oklch(0.6 0 0)";
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
