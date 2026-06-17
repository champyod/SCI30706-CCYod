'use strict';

/* ========================================
   MWIT Campus Tour — Building Data & Interaction
   Center coordinates from MAIN-OPH-2025 reference
   ======================================== */

var BUILDINGS = [
  // --- Academic ---
  {
    id:'bldg1', nameTH:'อาคาร 1', nameEN:'Building 1',
    type:'academic', subtitle:'อาคารเรียนวิทยาศาสตร์ — ห้องปฏิบัติการและห้องเรียน',
    cx:60, cy:40, w:9, h:11,
    floors:[
      { floor:'ชั้น 1', rooms:['ห้องปฏิบัติการเคมี', 'ห้องเรียนเคมี'] },
      { floor:'ชั้น 2', rooms:['ห้องปฏิบัติการชีววิทยา', 'ห้องเรียนชีววิทยา'] },
      { floor:'ชั้น 3', rooms:['ห้องปฏิบัติการฟิสิกส์', 'ห้องเรียนฟิสิกส์'] },
      { floor:'ชั้น 4', rooms:['ห้องเรียนภาษา', 'ห้องเรียนสังคม'] },
    ],
  },
  {
    id:'bldg2', nameTH:'อาคาร 2', nameEN:'Building 2',
    type:'academic', subtitle:'อาคารเรียนคณิตศาสตร์ ภาษา และคอมพิวเตอร์',
    cx:65, cy:45, w:9, h:11,
    floors:[
      { floor:'ชั้น 1', rooms:['ห้องเรียนคณิตศาสตร์', 'ห้องปฏิบัติการคณิตศาสตร์'] },
      { floor:'ชั้น 2', rooms:['ห้องเรียนภาษาไทย', 'ห้องเรียนภาษาอังกฤษ'] },
      { floor:'ชั้น 3', rooms:['ห้องปฏิบัติการคอมพิวเตอร์ 1-3'] },
      { floor:'ชั้น 4', rooms:['ห้องเรียนศิลปะ', 'ห้องเรียนดนตรี'] },
    ],
  },
  {
    id:'bldg3', nameTH:'อาคาร 3', nameEN:'Building 3',
    type:'academic', subtitle:'อาคารเรียนสังคมศาสตร์และภาษาต่างประเทศ',
    cx:55, cy:50, w:9, h:11,
    floors:[
      { floor:'ชั้น 1', rooms:['ห้องปฏิบัติการวิทยาศาสตร์โลกทั้งโลก'] },
      { floor:'ชั้น 2', rooms:['ห้องเรียนวิชาเลือก (จิตวิทยา, กฎหมาย, เศรษฐศาสตร์)'] },
      { floor:'ชั้น 3', rooms:['ห้องเรียนสังคมศึกษา', 'ห้องเรียนประวัติศาสตร์'] },
      { floor:'ชั้น 4', rooms:['ห้องเรียนภาษาต่างประเทศ (ญี่ปุ่น, จีน, ฝรั่งเศส, เกาหลี)'] },
    ],
  },
  {
    id:'library', nameTH:'ห้องสมุด', nameEN:'Library',
    type:'academic', subtitle:'แหล่งเรียนรู้และค้นคว้า',
    cx:70, cy:40, w:7, h:9,
    floors:[
      { floor:'ชั้น 1', rooms:['ยืม-คืนหนังสือ', 'นิตยสารและวารสาร', 'หนังสือพิมพ์', 'มุมนิทรรศการ'] },
      { floor:'ชั้น 2', rooms:['โซนอ่านหนังสือ', 'ห้องประชุมกลุ่ม', 'คอมพิวเตอร์สืบค้น'] },
    ],
  },

  // --- Facility ---
  {
    id:'auditorium', nameTH:'หอประชุม', nameEN:'Auditorium',
    type:'facility', subtitle:'หอประชุมใหญ่ โรงเรียนมหิดลวิทยานุสรณ์',
    cx:55, cy:35, w:10, h:9,
    floors:[
      { floor:'ชั้น 1', rooms:['หอประชุมใหญ่ (จุ 800 คน)', 'ห้องแต่งตัว', 'ห้องเก็บอุปกรณ์'] },
      { floor:'ชั้น 2', rooms:['ระเบียงที่นั่ง', 'ห้องควบคุมระบบแสง-เสียง'] },
    ],
  },
  {
    id:'clinic', nameTH:'ห้องพยาบาล', nameEN:'Clinic',
    type:'facility', subtitle:'บริการทางการแพทย์เบื้องต้น',
    cx:50, cy:65, w:5, h:5,
    floors:[
      { floor:'ชั้น 1', rooms:['ห้องตรวจ', 'ห้องพักผู้ป่วย', 'ห้องปฐมพยาบาล'] },
    ],
  },
  {
    id:'kitchen', nameTH:'ห้องครัว', nameEN:'Kitchen',
    type:'facility', subtitle:'โรงครัวกลาง',
    cx:40, cy:70, w:5, h:5,
    floors:[
      { floor:'ชั้น 1', rooms:['ห้องเตรียมอาหาร', 'ห้องประกอบอาหาร', 'ห้องเก็บวัตถุดิบ'] },
    ],
  },
  {
    id:'laundry', nameTH:'ห้องซักผ้า', nameEN:'Laundry',
    type:'facility', subtitle:'บริการซักรีดสำหรับนักเรียน',
    cx:65, cy:70, w:5, h:5,
    floors:[
      { floor:'ชั้น 1', rooms:['บริการซักรีด', 'เครื่องซักผ้าหยอดเหรียญ'] },
    ],
  },
  {
    id:'workshop', nameTH:'โรงฝึกงาน', nameEN:'Workshop',
    type:'facility', subtitle:'อาคารปฏิบัติงานช่าง',
    cx:80, cy:75, w:6, h:6,
    floors:[
      { floor:'ชั้น 1', rooms:['โรงไม้', 'โรงโลหะ', 'ห้องเชื่อม', 'ห้องเก็บวัสดุ'] },
    ],
  },

  // --- Dorm ---
  {
    id:'dorm9', nameTH:'หอพัก 9', nameEN:'Dormitory 9',
    type:'dorm', subtitle:'หอพักนักเรียนชาย',
    cx:70, cy:60, w:6, h:15,
    floors:[
      { floor:'ชั้น 1', rooms:['โถงต้อนรับ', 'ห้องพักครูเวร', 'ห้องซักรีด'] },
      { floor:'ชั้น 2', rooms:['ห้องพักนักเรียน (20 ห้อง)'] },
      { floor:'ชั้น 3', rooms:['ห้องพักนักเรียน (20 ห้อง)'] },
      { floor:'ชั้น 4', rooms:['ห้องพักนักเรียน (20 ห้อง)'] },
      { floor:'ชั้น 5', rooms:['ห้องพักนักเรียน (20 ห้อง)'] },
      { floor:'ชั้น 6', rooms:['ห้องพักนักเรียน (20 ห้อง)'] },
    ],
  },
  {
    id:'dorm78', nameTH:'หอพัก 7-8', nameEN:'Dormitory 7 & 8',
    type:'dorm', subtitle:'หอพักนักเรียนหญิง',
    cx:75, cy:50, w:6, h:13,
    floors:[
      { floor:'ชั้น 1', rooms:['โถงต้อนรับ', 'ห้องพักครูเวร'] },
      { floor:'ชั้น 2', rooms:['ห้องพักนักเรียน (ชั้นละ 20 ห้อง)'] },
      { floor:'ชั้น 3', rooms:['ห้องพักนักเรียน (ชั้นละ 20 ห้อง)'] },
      { floor:'ชั้น 4', rooms:['ห้องพักนักเรียน (ชั้นละ 20 ห้อง)'] },
      { floor:'ชั้น 5', rooms:['ห้องพักนักเรียน (ชั้นละ 20 ห้อง)'] },
    ],
  },

  // --- Sport ---
  {
    id:'sports-center', nameTH:'ศูนย์กีฬา', nameEN:'Sports Center',
    type:'sport', subtitle:'อาคารกีฬาและพลศึกษา',
    cx:20, cy:30, w:10, h:8,
    floors:[
      { floor:'ชั้น 1', rooms:['สนามบาสเกตบอลในร่ม', 'ห้องเปลี่ยนเครื่องแต่งกาย', 'ห้องเก็บอุปกรณ์'] },
      { floor:'ชั้น 2', rooms:['ห้องออกกำลังกาย', 'ลู่วิ่งในร่ม', 'ห้องสอนโยคะ'] },
    ],
  },
  {
    id:'front-field', nameTH:'สนามหน้าโรงเรียน', nameEN:'Front Field',
    type:'sport', subtitle:'สนามหญ้าหน้าโรงเรียน',
    cx:45, cy:25, w:10, h:6,
    floors:[],
    description:'สนามหญ้าขนาดใหญ่หน้าโรงเรียน ใช้สำหรับกิจกรรมกลางแจ้ง พิธีกรรม และการเข้าแถว',
  },
  {
    id:'futsal', nameTH:'สนามฟุตซอล', nameEN:'Futsal Field',
    type:'sport', subtitle:'สนามกีฬาฟุตซอล',
    cx:35, cy:65, w:6, h:7,
    floors:[],
    description:'สนามฟุตซอลมาตรฐานกลางแจ้ง สำหรับการเรียนพละศึกษาและแข่งขัน',
  },
  {
    id:'basketball', nameTH:'สนามบาสเกตบอล', nameEN:'Basketball Court',
    type:'sport', subtitle:'สนามบาสเกตบอลกลางแจ้ง',
    cx:89.5, cy:77, w:6, h:7,
    floors:[],
    description:'สนามบาสเกตบอลมาตรฐานกลางแจ้ง เปิดให้เล่นในเวลาว่าง',
  },

  // --- Landmark ---
  {
    id:'watraiking', nameTH:'หลวงพ่อวัดไร่ขิง', nameEN:'Wat Rai Khing',
    type:'landmark', subtitle:'พระพุทธรูปศักดิ์สิทธิ์ประจำโรงเรียน',
    cx:15, cy:45, w:4, h:6,
    floors:[],
    description:'พระพุทธรูปหลวงพ่อวัดไร่ขิง ประดิษฐานอยู่บริเวณหน้าโรงเรียน เป็นที่เคารพสักการะของนักเรียนและบุคลากร',
  },
  {
    id:'sun-garden', nameTH:'สวนอาทิตย์', nameEN:'Sun Garden',
    type:'landmark', subtitle:'สวนพักผ่อนหย่อนใจกลางแจ้ง',
    cx:25, cy:55, w:7, h:5,
    floors:[],
    description:'สวนเปิดโล่งพร้อมที่นั่งพักผ่อน เหมาะสำหรับนั่งเล่น อ่านหนังสือ หรือพักรับประทานอาหารกลางแจ้ง',
  },

  // --- Center marker ---
  {
    id:'center', nameTH:'โรงเรียนมหิดลวิทยานุสรณ์', nameEN:'MWIT',
    type:'center', subtitle:'',
    cx:50, cy:50, w:5, h:5,
    floors:[],
    description:'ศูนย์กลางโรงเรียนมหิดลวิทยานุสรณ์ สถานศึกษาวิทยาศาสตร์ชั้นนำของประเทศไทย',
  },
];

/* ===== Render 3D Building Models ===== */

function renderBuildings() {
  var map = document.getElementById('mapEl');
  if (!map) return;

  BUILDINGS.forEach(function (b) {
    var left = b.cx - b.w / 2;
    var top  = b.cy - b.h / 2;

    var el = document.createElement('div');
    var cls = 'bldg bldg-' + b.type;
    if (b.type === 'academic' || b.type === 'dorm') cls += ' bldg-windows';
    if (b.type === 'center') cls += ' bldg-center';
    el.className = cls;
    el.style.left   = left + '%';
    el.style.top    = top + '%';
    el.style.width  = b.w + '%';
    el.style.height = b.h + '%';
    el.dataset.id = b.id;

    // Shadow layer (sits behind)
    var shadow = document.createElement('div');
    shadow.className = 'bldg-shadow';
    el.appendChild(shadow);

    // Front face
    var front = document.createElement('div');
    front.className = 'bldg-front';
    el.appendChild(front);

    // Label
    var label = document.createElement('span');
    label.className = 'bldg-label';
    label.innerHTML = b.nameTH + '<span class="bldg-label-en">' + b.nameEN + '</span>';
    el.appendChild(label);

    // Click
    if (b.type !== 'center') {
      el.addEventListener('click', function () { openPanel(b); });
    }

    map.appendChild(el);
  });
}

/* ===== Panel ===== */

function openPanel(building) {
  var panel  = document.getElementById('panel');
  var nameEl = document.getElementById('panelName');
  var subEl  = document.getElementById('panelSub');
  var bodyEl = document.getElementById('panelBody');

  nameEl.textContent = building.nameTH + ' (' + building.nameEN + ')';
  subEl.textContent  = building.subtitle || '';
  bodyEl.innerHTML = '';

  if (building.floors && building.floors.length > 0) {
    building.floors.forEach(function (f) {
      var card = document.createElement('div');
      card.className = 'floor-card';

      var title = document.createElement('div');
      title.className = 'floor-title';
      title.textContent = f.floor;
      card.appendChild(title);

      var rooms = document.createElement('div');
      rooms.className = 'floor-rooms';

      f.rooms.forEach(function (r) {
        var pill = document.createElement('span');
        pill.className = 'room-pill';
        pill.textContent = r;
        rooms.appendChild(pill);
      });
      card.appendChild(rooms);
      bodyEl.appendChild(card);
    });
  } else if (building.description) {
    var desc = document.createElement('div');
    desc.className = 'panel-desc';
    desc.textContent = building.description;
    bodyEl.appendChild(desc);
  }

  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePanel() {
  var panel = document.getElementById('panel');
  panel.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== Init ===== */

document.addEventListener('DOMContentLoaded', function () {
  renderBuildings();

  var panel     = document.getElementById('panel');
  var closeBtn  = document.getElementById('panelClose');
  var overlay   = document.getElementById('panelOverlay');
  var scrollBtn = document.getElementById('scrollToMap');

  closeBtn.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      closePanel();
    }
  });

  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      document.getElementById('map').scrollIntoView({ behavior:'smooth' });
    });
  }
});
