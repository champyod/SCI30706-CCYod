// ดึงธาตุ (Elements) ต่างๆ จาก HTML มาเตรียมใช้งาน
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const calcBtn = document.getElementById('calcBtn');
const resultBox = document.getElementById('resultBox');
const bmiValueShow = document.getElementById('bmiValue');
const bmiStatusShow = document.getElementById('bmiStatus');
const historyBtn = document.getElementById('historyBtn');
const historyList = document.getElementById('historyList');

const STORAGE_KEY = 'bmi_history';

// ----- Local Storage Helpers -----

function getHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveToHistory(entry) {
    const history = getHistory();
    history.unshift(entry);           // ใหม่สุดไว้หน้า
    if (history.length > 20) history.length = 20; // เก็บแค่ 20 รายการล่าสุด
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function deleteHistoryItem(index) {
    const history = getHistory();
    history.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// ----- แสดงรายการประวัติ -----

function renderHistory() {
    const history = getHistory();
    historyList.replaceChildren();

    if (history.length === 0) {
        const empty = document.createElement('p');
        empty.style.cssText = 'text-align:center; color:#94a3b8; font-size:13px; margin:8px 0;';
        empty.innerText = 'ยังไม่มีประวัติ';
        historyList.appendChild(empty);
        return;
    }

    history.forEach(function(entry, index) {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML =
            '<div>' +
                '<div><strong>' + entry.weight + ' กก.</strong> / ' + entry.height + ' ซม.</div>' +
                '<div class="hi-status">' + entry.status + '</div>' +
            '</div>' +
            '<div style="text-align:right">' +
                '<div class="hi-bmi">' + entry.bmi + '</div>' +
                '<div class="hi-date">' + entry.date + '</div>' +
            '</div>';

        // คลิกเพื่อโหลดค่าเก่ากลับมา
        item.addEventListener('click', function() {
            weightInput.value = entry.weight;
            heightInput.value = entry.height;
            calcBtn.click();
            historyList.classList.add('hidden');
            historyBtn.innerText = 'ดูประวัติที่บันทึกไว้';
        });

        // คลิกขวา / Long-press เพื่อลบ (ใช้ contextmenu)
        item.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            deleteHistoryItem(index);
            renderHistory();
        });

        historyList.appendChild(item);
    });

    // ปุ่มลบทั้งหมด
    const clearBtn = document.createElement('button');
    clearBtn.className = 'history-clear-btn';
    clearBtn.innerText = 'ลบประวัติทั้งหมด';
    clearBtn.addEventListener('click', function() {
        if (confirm('ลบประวัติทั้งหมด?')) {
            localStorage.removeItem(STORAGE_KEY);
            renderHistory();
        }
    });
    historyList.appendChild(clearBtn);
}

// ----- ปุ่ม toggle ประวัติ -----

historyBtn.addEventListener('click', function() {
    const isHidden = historyList.classList.contains('hidden');
    if (isHidden) {
        renderHistory();
        historyList.classList.remove('hidden');
        historyBtn.innerText = 'ซ่อนประวัติ';
    } else {
        historyList.classList.add('hidden');
        historyBtn.innerText = 'ดูประวัติที่บันทึกไว้';
    }
});

// ----- คำนวณ BMI -----

function calculateBMI() {
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        alert('กรุณากรอกน้ำหนักและส่วนสูงให้ถูกต้องก่อนนะครับ');
        return;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    bmiValueShow.innerText = bmi.toFixed(2);

    resultBox.className = "result-box";

    let status = "";
    if (bmi < 18.5) {
        status = "น้ำหนักน้อย / ผอมไปหน่อยนะ";
        resultBox.classList.add('underweight');
    } else if (bmi >= 18.5 && bmi < 23) {
        status = "น้ำหนักปกติ / หุ่นดีสุขภาพดี";
        resultBox.classList.add('normal');
    } else if (bmi >= 23 && bmi < 25) {
        status = "น้ำหนักเกิน / เริ่มอวบแล้วนะ";
        resultBox.classList.add('underweight');
    } else {
        status = "อ้วน / ต้องเริ่มออกกำลังกายแล้วนะ";
        resultBox.classList.add('overweight');
    }

    bmiStatusShow.innerText = status;

    // ผลลัพธ์แสดงผล
    resultBox.classList.remove('hidden');

    // บันทึกเข้า localStorage
    const now = new Date();
    const dateStr =
        now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) +
        ' ' +
        now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    saveToHistory({
        weight: weight,
        height: height,
        bmi: bmi.toFixed(2),
        status: status,
        date: dateStr
    });

}

calcBtn.addEventListener('click', calculateBMI);