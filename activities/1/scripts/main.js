'use strict';

/* ========================================
   MWIT Campus Tour — Building Data & Interaction
   ======================================== */

const BUILDINGS = [
  {
    id:'bldg1', nameTH:'อาคาร 1', nameEN:'Building 1',
    type:'academic', subtitle:'อาคารเรียนวิทยาศาสตร์ — ห้องปฏิบัติการและห้องเรียน',
    x:7.81, y:29.10, w:9.77, h:23.75,
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
    x:18.59, y:29.10, w:9.77, h:23.75,
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
    x:29.38, y:29.10, w:9.77, h:23.75,
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
    x:42.19, y:33.85, w:11.33, h:19.00,
    floors:[
      { floor:'ชั้น 1', rooms:['ยืม-คืนหนังสือ', 'นิตยสารและวารสาร', 'หนังสือพิมพ์', 'มุมนิทรรศการ'] },
      { floor:'ชั้น 2', rooms:['โซนอ่านหนังสือ', 'ห้องประชุมกลุ่ม', 'คอมพิวเตอร์สืบค้น'] },
    ],
  },
  {
    id:'auditorium', nameTH:'หอประชุม', nameEN:'Auditorium',
    type:'facility', subtitle:'หอประชุมใหญ่ โรงเรียนมหิดลวิทยานุสรณ์',
    x:56.09, y:32.07, w:13.28, h:22.57,
    floors:[
      { floor:'ชั้น 1', rooms:['หอประชุมใหญ่ (จุ 800 คน)', 'ห้องแต่งตัว', 'ห้องเก็บอุปกรณ์'] },
      { floor:'ชั้น 2', rooms:['ระเบียงที่นั่ง', 'ห้องควบคุมระบบแสง-เสียง'] },
    ],
  },
  {
    id:'dorm9', nameTH:'หอพัก 9', nameEN:'Dormitory 9',
    type:'dorm', subtitle:'หอพักนักเรียนชาย',
    x:75.00, y:25.53, w:5.86, h:26.13,
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
    id:'laundry', nameTH:'ห้องซักผ้า', nameEN:'Laundry',
    type:'facility', subtitle:'บริการซักรีดสำหรับนักเรียน',
    x:74.22, y:54.63, w:5.08, h:7.72,
    floors:[
      { floor:'ชั้น 1', rooms:['บริการซักรีด', 'เครื่องซักผ้าหยอดเหรียญ'] },
    ],
  },
  {
    id:'sun-garden', nameTH:'สวนอาทิตย์', nameEN:'Sun Garden',
    type:'landmark', subtitle:'สวนพักผ่อนหย่อนใจกลางแจ้ง',
    x:60.55, y:60.57, w:8.59, h:9.50,
    floors:[],
    description:'สวนเปิดโล่งพร้อมที่นั่งพักผ่อน เหมาะสำหรับนั่งเล่น อ่านหนังสือ หรือพักรับประทานอาหารกลางแจ้ง',
  },
  {
    id:'futsal', nameTH:'สนามฟุตซอล', nameEN:'Futsal Field',
    type:'sport', subtitle:'สนามกีฬาฟุตซอล',
    x:72.66, y:61.76, w:5.47, h:9.50,
    floors:[],
    description:'สนามฟุตซอลมาตรฐานกลางแจ้ง สำหรับการเรียนพละศึกษาและแข่งขัน',
  },
  {
    id:'dorm78', nameTH:'หอพัก 7-8', nameEN:'Dormitory 7 & 8',
    type:'dorm', subtitle:'หอพักนักเรียนหญิง',
    x:78.91, y:56.41, w:5.86, h:20.19,
    floors:[
      { floor:'ชั้น 1', rooms:['โถงต้อนรับ', 'ห้องพักครูเวร'] },
      { floor:'ชั้น 2', rooms:['ห้องพักนักเรียน (ชั้นละ 20 ห้อง)'] },
      { floor:'ชั้น 3', rooms:['ห้องพักนักเรียน (ชั้นละ 20 ห้อง)'] },
      { floor:'ชั้น 4', rooms:['ห้องพักนักเรียน (ชั้นละ 20 ห้อง)'] },
      { floor:'ชั้น 5', rooms:['ห้องพักนักเรียน (ชั้นละ 20 ห้อง)'] },
    ],
  },
  {
    id:'clinic', nameTH:'ห้องพยาบาล', nameEN:'Clinic',
    type:'facility', subtitle:'บริการทางการแพทย์เบื้องต้น',
    x:84.77, y:59.98, w:5.08, h:8.31,
    floors:[
      { floor:'ชั้น 1', rooms:['ห้องตรวจ', 'ห้องพักผู้ป่วย', 'ห้องปฐมพยาบาล'] },
    ],
  },
  {
    id:'kitchen', nameTH:'ห้องครัว', nameEN:'Kitchen',
    type:'facility', subtitle:'โรงครัวกลาง',
    x:80.47, y:48.10, w:5.47, h:6.53,
    floors:[
      { floor:'ชั้น 1', rooms:['ห้องเตรียมอาหาร', 'ห้องประกอบอาหาร', 'ห้องเก็บวัตถุดิบ'] },
    ],
  },
  {
    id:'sports-center', nameTH:'ศูนย์กีฬา', nameEN:'Sports Center',
    type:'sport', subtitle:'อาคารกีฬาและพลศึกษา',
    x:3.91, y:55.82, w:13.67, h:16.63,
    floors:[
      { floor:'ชั้น 1', rooms:['สนามบาสเกตบอลในร่ม', 'ห้องเปลี่ยนเครื่องแต่งกาย', 'ห้องเก็บอุปกรณ์'] },
      { floor:'ชั้น 2', rooms:['ห้องออกกำลังกาย', 'ลู่วิ่งในร่ม', 'ห้องสอนโยคะ'] },
    ],
  },
  {
    id:'watraiking', nameTH:'หลวงพ่อวัดไร่ขิง', nameEN:'Wat Rai Khing',
    type:'landmark', subtitle:'พระพุทธรูปศักดิ์สิทธิ์ประจำโรงเรียน',
    x:46.09, y:55.82, w:4.30, h:8.31,
    floors:[],
    description:'พระพุทธรูปหลวงพ่อวัดไร่ขิง ประดิษฐานอยู่บริเวณหน้าโรงเรียน เป็นที่เคารพสักการะของนักเรียนและบุคลากร',
  },
  {
    id:'front-field', nameTH:'สนามหน้าโรงเรียน', nameEN:'Front Field',
    type:'sport', subtitle:'สนามหญ้าหน้าโรงเรียน',
    x:19.53, y:55.82, w:15.63, h:15.44,
    floors:[],
    description:'สนามหญ้าขนาดใหญ่หน้าโรงเรียน ใช้สำหรับกิจกรรมกลางแจ้ง พิธีกรรม และการเข้าแถว',
  },
  {
    id:'workshop', nameTH:'โรงฝึกงาน', nameEN:'Workshop',
    type:'facility', subtitle:'อาคารปฏิบัติงานช่าง',
    x:40.63, y:56.41, w:5.47, h:8.31,
    floors:[
      { floor:'ชั้น 1', rooms:['โรงไม้', 'โรงโลหะ', 'ห้องเชื่อม', 'ห้องเก็บวัสดุ'] },
    ],
  },
  {
    id:'basketball', nameTH:'สนามบาสเกตบอล', nameEN:'Basketball Court',
    type:'sport', subtitle:'สนามบาสเกตบอลกลางแจ้ง',
    x:85.94, y:71.26, w:6.25, h:10.69,
    floors:[],
    description:'สนามบาสเกตบอลมาตรฐานกลางแจ้ง เปิดให้เล่นในเวลาว่าง',
  },
  {
    id:'center', nameTH:'โรงเรียนมหิดลวิทยานุสรณ์', nameEN:'MWIT',
    type:'center', subtitle:'',
    x:47.5, y:47.5, w:5.0, h:5.0,
    floors:[],
    description:'ศูนย์กลางโรงเรียนมหิดลวิทยานุสรณ์ สถานศึกษาวิทยาศาสตร์ชั้นนำของประเทศไทย',
  },
];

/* ===== Render ===== */

function renderBuildings() {
  const map = document.getElementById('mapEl');
  if (!map) return;

  BUILDINGS.forEach((b) => {
    const el = document.createElement('div');
    let cls = 'bldg bldg-' + b.type;
    if (b.type !== 'academic' && b.type !== 'dorm') cls += ' bldg-no-windows';
    if (b.type === 'center') cls += ' bldg-center';
    el.className = cls;

    el.style.left   = b.x + '%';
    el.style.top    = b.y + '%';
    el.style.width  = b.w + '%';
    el.style.height = b.h + '%';
    el.dataset.id = b.id;

    el.innerHTML =
      '<span class="bldg-label">' + b.nameTH +
      '<span class="bldg-label-en">' + b.nameEN + '</span></span>';

    if (b.type !== 'center') {
      el.addEventListener('click', function () { openPanel(b); });
    }

    map.appendChild(el);
  });
}

/* ===== Panel ===== */

function openPanel(building) {
  const panel   = document.getElementById('panel');
  const nameEl  = document.getElementById('panelName');
  const subEl   = document.getElementById('panelSub');
  const bodyEl  = document.getElementById('panelBody');

  nameEl.textContent = building.nameTH + ' (' + building.nameEN + ')';
  subEl.textContent  = building.subtitle;

  bodyEl.innerHTML = '';

  if (building.floors && building.floors.length > 0) {
    building.floors.forEach(function (f) {
      const card = document.createElement('div');
      card.className = 'floor-card';

      const title = document.createElement('div');
      title.className = 'floor-title';
      title.textContent = f.floor;
      card.appendChild(title);

      const rooms = document.createElement('div');
      rooms.className = 'floor-rooms';

      f.rooms.forEach(function (r) {
        const pill = document.createElement('span');
        pill.className = 'room-pill';
        pill.textContent = r;
        rooms.appendChild(pill);
      });

      card.appendChild(rooms);
      bodyEl.appendChild(card);
    });
  } else if (building.description) {
    const desc = document.createElement('div');
    desc.className = 'panel-desc';
    desc.textContent = building.description;
    bodyEl.appendChild(desc);
  }

  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePanel() {
  const panel = document.getElementById('panel');
  panel.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== Init ===== */

document.addEventListener('DOMContentLoaded', function () {
  renderBuildings();

  const panel      = document.getElementById('panel');
  const closeBtn   = document.getElementById('panelClose');
  const overlay    = document.getElementById('panelOverlay');
  const scrollBtn  = document.getElementById('scrollToMap');

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
