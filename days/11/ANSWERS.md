# ANSWERS — MWIT Interactive Web Workbook สัปดาห์ที่ 11

## ☁️ Upgrade Your Web App: เปลี่ยนการบันทึกข้อมูลจาก Local Storage ไปสู่ Supabase Cloud Database

> โปรเจกต์: **FinGoal — วางแผนการเงิน** (Mini Project · Financial Helper)
> ตาราง: **`finance_logs`** — 1 row = 1 รายการรายรับ/รายจ่าย
> บทเรียนนี้ครอบคลุมเฉพาะ **Create + Read** (บันทึกด้วย `insert()` และโหลดด้วย `select()`)
> — ยังไม่รวม Update, Delete และ Authentication (อยู่ในบทถัดไป)

---

## 🖨️ วิธีใช้: เติมฟอร์มแล้วพิมพ์เป็น PDF

1. เปิดไฟล์ **`ANSWERS-workbook-filled.html`** ใน Browser (Chrome / Edge / Firefox)
2. คำตอบถูกกรอกไว้ครบทุกช่องแล้ว — ตรวจทานได้ในแต่ละแท็บ (เริ่มต้น → STEP 5)
3. ไปที่แท็บ **STEP 5** กดปุ่ม **"พิมพ์ / บันทึกเป็น PDF"** (หรือกด `Ctrl+P`)
4. ในหน้าต่างพิมพ์ เลือก **"Save as PDF"** แล้วกด Save → ได้ไฟล์ PDF ส่งครู

---

# คำตอบตามช่องฟอร์ม (field → answer)

## เริ่มต้น — เลือกโปรเจกต์

| ช่องฟอร์ม | คำตอบ |
|---|---|
| โปรเจกต์ | 💰 **Financial Helper** |
| ชื่อเว็บของฉัน (`projectName`) | **FinGoal — วางแผนการเงิน** |

---

## STEP 1 — 🧱 ออกแบบ Table

### ช่อง: เว็บรับข้อมูลอะไรบ้าง? (`inputs`)

> ฟอร์มบันทึกรายการ รับข้อมูล: **ชื่อรายการ (item)**, **จำนวนเงินรับ (income)**, **จำนวนเงินจ่าย (expense)**

### ช่อง: ตอนนี้ Local Storage เก็บอะไร? (`storage`)

> เก็บ **array ของ object** รายการทั้งหมดด้วย `localStorage.setItem(...)` เช่น key `"fingoal_transactions"` เก็บเป็น `JSON.stringify(data)`

### ช่อง: หนึ่ง row ในเว็บของคุณหมายถึงอะไร? (`rowMeaning`)

> **1 row = 1 รายการรายรับหรือรายจ่าย** ที่ผู้ใช้บันทึกหนึ่งครั้ง

### Table ที่ออกแบบ: `finance_logs`

| Column | Type | หน้าที่ | ตัวอย่าง |
|---|---|---|---|
| `id` | int8 (PK, อัตโนมัติ) | รหัสของแต่ละ row | อัตโนมัติ |
| `created_at` | timestamptz (อัตโนมัติ) | เวลาที่บันทึก | อัตโนมัติ |
| `item` | text | ชื่อรายการ | `ค่าอาหาร` |
| `income` | float8 | จำนวนเงินรับ (บาท) | `500` |
| `expense` | float8 | จำนวนเงินจ่าย (บาท) | `120` |

> **หมายเหตุ:** ข้อมูลที่ใช้เป็นข้อมูลทดลองเท่านั้น เนื่องจากบทนี้ยังไม่มีระบบ Login
> ข้อมูลอาจมองเห็นร่วมกันได้ตาม RLS policy ที่ครูกำหนด

---

## STEP 2 — 🔌 เชื่อมต่อ Supabase

### เพิ่ม Supabase JavaScript Library

วางก่อน `</body>` และก่อน `script.js` ของเว็บ:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="script.js"></script>
```

### สร้าง Client ใน `script.js`

```js
const SUPABASE_URL = "https://yqwnlrgfbmrktuulmwon.supabase.co";
const SUPABASE_KEY = "sb_publishable_…";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
```

### Checklist (ติ๊กครบทุกข้อในฟอร์ม)

- ✅ สร้าง table แล้ว (`connect0`)
- ✅ ใส่ URL และ Publishable Key แล้ว (`connect1`)
- ✅ Console ไม่พบ `supabase is not defined` (`connect2`)

**สิ่งที่ได้เรียนรู้:**
- ใช้เฉพาะ **Publishable Key** (อนุญาตให้อยู่ในหน้าเว็บได้) — ห้ามนำ **Service Role Key** มาวางในเว็บเด็ดขาด เพราะมีสิทธิ์ข้าม RLS
- สร้าง table ใน Supabase ให้เรียบร้อยก่อน แล้วใส่ URL + Publishable Key

---

## STEP 3 — 💾 Upgrade Save: จาก `setItem()` เป็น `insert()`

### ก่อน — Local Storage

```js
localStorage.setItem("myData", JSON.stringify(data));
```

### หลัง — Cloud (Supabase)

```js
const { data, error } = await supabaseClient
  .from("finance_logs")
  .insert([{ item, income, expense }]);
```

การอ่านค่าจาก input และการคำนวณเดิมยังใช้เหมือนเดิม — เปลี่ยนเฉพาะปลายทางที่เก็บข้อมูล

### ช่อง: ถ้ากด Save สองครั้ง จะมีข้อมูลใน table กี่ row และเพราะเหตุใด? (`predictSave`)

> **2 rows** — เพราะทุกครั้งที่เรียก `insert()` จะ**เพิ่ม row ใหม่** ไม่เหมือน `setItem()` ที่เขียนทับค่าของ key เดิม
> ดังนั้นกด Save กี่ครั้ง = มี row เพิ่มกี่ row

---

## STEP 4 — 📊 Upgrade Load: อ่านหลาย rows ด้วย `select()`

```js
async function loadData() {
  const { data, error } = await supabaseClient
    .from("finance_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error(error.message); return; }

  historyList.innerHTML = data.map(item => `
    <div class="history-item">
      ${item.item} · รับ ${item.income} บาท · จ่าย ${item.expense} บาท
    </div>
  `).join("");
}
```

- `select("*")` → ขอข้อมูลทุก column
- `order()` → เรียงรายการใหม่ไว้ด้านบน
- `data` → array ของ objects
- `map()` → สร้าง HTML จากข้อมูลแต่ละ row

### ช่อง: ผลต่างจาก Local Storage ที่สังเกตได้คืออะไร? (`crossBrowser`)

> ข้อมูลใน Browser ที่สอง **โผล่ขึ้นมาเหมือนกัน** เพราะถูกดึงจาก **Supabase cloud database ตัวเดียวกัน** —
> ต่างจาก Local Storage ที่เก็บข้อมูล**เฉพาะ browser ที่บันทึก** ถ้าเปิดอีกเครื่องจะไม่เห็น

---

## STEP 5 — 🧪 Test Like a Developer & Reflection

### Checklist การทดสอบ (ติ๊กครบทุกข้อ)

- ✅ กรอกข้อมูลครบแล้ว Save สำเร็จ (`test0`)
- ✅ ข้อมูลปรากฏเป็น row ใหม่ใน Supabase (`test1`)
- ✅ Refresh แล้ว Load ข้อมูลกลับมาได้ (`test2`)
- ✅ เปิดอีก Browser แล้วเห็นข้อมูล (`test3`)
- ✅ กรอกไม่ครบแล้วเว็บไม่บันทึก (`test4`)
- ✅ เว็บเดิมยังคำนวณและแสดงผลได้ (`test5`)
- ✅ ไม่มี Service Role Key และข้อมูลส่วนตัวจริง (`test6`)

### Reflection — คำตอบทั้ง 4 ข้อ

**1. Local Storage และ Supabase ต่างกันอย่างไร? (`reflect1`)**

> Local Storage เก็บข้อมูล**เฉพาะใน browser/เครื่องนั้น** เปิดอีกเครื่องจะไม่เห็นและล้างได้ง่าย
> ส่วน Supabase เก็บบน **cloud server กลาง** ทุกอุปกรณ์ที่เชื่อมต่อ table เดียวกันเห็นข้อมูลชุดเดียวกัน ซิงก์ผ่านอินเทอร์เน็ต

**2. เหตุใดชื่อ property จึงต้องตรงกับชื่อ column? (`reflect2`)**

> เพราะ `insert()` / `select()` จะ**จับคู่ชื่อ property ใน object กับชื่อ column ในตารางโดยตรง**
> ถ้าชื่อไม่ตรงกันจะเจอ error `column ... does not exist` ทำให้บันทึกหรือโหลดข้อมูลไม่ได้

**3. หนึ่ง object กลายเป็นหนึ่ง row ได้อย่างไร? (`reflect3`)**

> เมื่อเรียก `insert([object])` Supabase จะ**สร้าง 1 row ใหม่**ในตาราง โดยแต่ละ property กลายเป็นค่าในแต่ละ column
> เช่น `{ item: "ค่าอาหาร", income: 500 }` กลายเป็น row ที่มี `item = "ค่าอาหาร"` และ `income = 500`
> ส่วน `id` กับ `created_at` เติมให้อัตโนมัติ

**4. ถ้ามีข้อมูลผิดหนึ่งรายการ เราจะรู้ได้อย่างไรว่าต้องลบ row ใด? (`reflect4`)**

> ดูจาก column **`id`** ซึ่งเป็น **primary key ไม่ซ้ำกัน**ในแต่ละ row —
> ใช้ `id` ระบุ row ที่ต้องการลบ เช่น `.delete().eq("id", id)` (เนื้อหาบทถัดไป)

---

*MWIT Interactive Web Programming Workbook · Upgrade Your Web App (Week 11) — FinGoal (Financial Helper · finance_logs)*
