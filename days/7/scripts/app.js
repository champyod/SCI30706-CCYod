// ดึงธาตุ (Elements) ต่างๆ จาก HTML มาเตรียมใช้งาน
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const calcBtn = document.getElementById('calcBtn');
const resultBox = document.getElementById('resultBox');
const bmiValueShow = document.getElementById('bmiValue');
const bmiStatusShow = document.getElementById('bmiStatus');

// เมื่อคลิกปุ่มคำนวณ
calcBtn.addEventListener('click', function() {
    // ดึงค่าแปลงเป็นตัวเลขเลขทศนิยม
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);

    // ตรวจสอบว่ากรอกข้อมูลครบถ้วนถูกต้องไหม
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        alert('กรุณากรอกน้ำหนักและส่วนสูงให้ถูกต้องก่อนนะครับ');
        return; // หยุดการทำงานถ้ากรอกไม่ครบ
    }

    // สูตรคำนวณ BMI: น้ำหนัก (กก.) / ส่วนสูงหน่วยเป็นเมตรยกกำลังสอง
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // แสดงค่า BMI โดยล็อกทศนิยมไว้ 2 ตำแหน่ง
    bmiValueShow.innerText = bmi.toFixed(2);

    // ล้างสี (Class) เก่าๆ ออกก่อนคำนวณใหม่
    resultBox.className = "result-box"; 

    // วิเคราะห์ผล BMI และเปลี่ยนสีกล่องข้อความ
    let status = "";
    if (bmi < 18.5) {
        status = "น้ำหนักน้อย / ผอมไปหน่อยนะ";
        resultBox.classList.add('underweight');
    } else if (bmi >= 18.5 && bmi < 23) {
        status = "น้ำหนักปกติ / หุ่นดีสุขภาพดี";
        resultBox.classList.add('normal');
    } else if (bmi >= 23 && bmi < 25) {
        status = "น้ำหนักเกิน / เริ่มอวบแล้วนะ";
        resultBox.classList.add('underweight'); // ใช้สีเหลืองเตือน
    } else {
        status = "อ้วน / ต้องเริ่มออกกำลังกายแล้วนะ";
        resultBox.classList.add('overweight');
    }

    // แสดงข้อความผลลัพธ์
    bmiStatusShow.innerText = status;
});