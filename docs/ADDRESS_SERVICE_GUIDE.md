# การใช้งาน Address Service

## ภาพรวม
ระบบได้รับการปรับปรุงให้ดึงข้อมูลที่อยู่ไทย (จังหวัด, อำเภอ, ตำบล, รหัสไปรษณีย์) จาก API แทนการใช้ข้อมูล hardcoded

## API ที่ใช้
- **Thailand Address Database API** จาก [jquery.Thailand.js](https://github.com/earthchie/jquery.Thailand.js)
- API นี้เป็น open-source และให้บริการฟรี
- ข้อมูลครอบคลุมที่อยู่ทั้งหมดในประเทศไทย

## คุณสมบัติ

### 1. ดึงข้อมูลจังหวัด
```typescript
import * as AddressService from '@/services/addressService';

const provinces = await AddressService.getProvinces();
// ผลลัพธ์: ["กรุงเทพมหานคร", "กระบี่", ...]
```

### 2. ดึงข้อมูลอำเภอตามจังหวัด
```typescript
const districts = await AddressService.getDistricts("กรุงเทพมหานคร");
// ผลลัพธ์: ["เขตพระนคร", "เขตดุสิต", ...]
```

### 3. ดึงข้อมูลตำบลตามจังหวัดและอำเภอ
```typescript
const subdistricts = await AddressService.getSubdistricts(
  "กรุงเทพมหานคร",
  "เขตพระนคร"
);
// ผลลัพธ์: ["แขวงพระบรมมหาราชวัง", "แขวงวังบูรพาภิรมย์", ...]
```

### 4. ค้นหารหัสไปรษณีย์
```typescript
const zipCode = await AddressService.getZipCode(
  "กรุงเทพมหานคร",
  "เขตพระนคร",
  "แขวงพระบรมมหาราชวัง"
);
// ผลลัพธ์: "10200"
```

### 5. ค้นหาที่อยู่จากรหัสไปรษณีย์
```typescript
const addresses = await AddressService.getAddressByZipCode("10200");
// ผลลัพธ์: [
//   {
//     province: "กรุงเทพมหานคร",
//     district: "เขตพระนคร",
//     subdistrict: "แขวงพระบรมมหาราชวัง"
//   }
// ]
```

## การทำงานใน CustomerManagement

### 1. โหลดข้อมูลจังหวัด
- เมื่อ component mount ระบบจะโหลดจังหวัดทั้งหมดจาก API
- ข้อมูลจะถูกเก็บใน state `provinces`

### 2. เลือกจังหวัด
- เมื่อผู้ใช้เลือกจังหวัด ระบบจะโหลดอำเภอที่เกี่ยวข้อง
- ข้อมูลจะถูกเก็บใน state `billingDistricts` หรือ `shippingDistricts`

### 3. เลือกอำเภอ
- เมื่อผู้ใช้เลือกอำเภอ ระบบจะโหลดตำบลที่เกี่ยวข้อง
- ข้อมูลจะถูกเก็บใน state `billingSubdistricts` หรือ `shippingSubdistricts`

### 4. เลือกตำบล (Auto-fill รหัสไปรษณีย์)
- เมื่อผู้ใช้เลือกตำบล ระบบจะค้นหาและกรอกรหัสไปรษณีย์อัตโนมัติ
- ผู้ใช้สามารถแก้ไขรหัสไปรษณีย์ได้ภายหลัง

## Caching
- ระบบมี caching mechanism เพื่อลดการเรียก API ซ้ำ
- ข้อมูลจังหวัดจะถูก cache หลังจากโหลดครั้งแรก
- ข้อมูลอำเภอและตำบลจะถูก cache ตามจังหวัดและอำเภอที่เคยเรียก

## Fallback
- หาก API ล้มเหลว ระบบจะใช้ข้อมูล hardcoded เป็น fallback
- ข้อมูล fallback มีเพียงบางจังหวัด (กรุงเทพฯ, ชลบุรี, เชียงใหม่)
- แนะนำให้ตรวจสอบการเชื่อมต่อ internet ของผู้ใช้

## การปรับแต่ง

### เปลี่ยน API Source
หากต้องการใช้ API อื่น สามารถแก้ไขได้ที่ไฟล์ `src/services/addressService.ts`

```typescript
// เปลี่ยน URL ของ API
const API_URL = 'YOUR_API_URL_HERE';
```

### เพิ่มข้อมูล Fallback
แก้ไขได้ที่ส่วน fallback ในแต่ละฟังก์ชัน:

```typescript
// Fallback: ถ้า API ล้มเหลว ให้ใช้ข้อมูล hardcode
return [
  "กรุงเทพมหานคร", "กระบี่", // ... เพิ่มเติม
];
```

## ข้อควรระวัง

1. **CORS**: API ที่ใช้อาจมีข้อจำกัดเรื่อง CORS หากใช้งานใน production
2. **Rate Limiting**: บาง API อาจมีการจำกัดจำนวนคำขอต่อนาที
3. **Internet Connection**: ต้องมีการเชื่อมต่ออินเทอร์เน็ตเพื่อดึงข้อมูลจาก API

## ทางเลือกอื่น

### 1. สร้าง API เอง (แนะนำ)
สามารถสร้าง API บน PHP backend ของตัวเองได้:

```php
// api-lucky/admin/get_provinces.php
<?php
header('Content-Type: application/json; charset=utf-8');

// เชื่อมต่อ database
$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8");

$sql = "SELECT DISTINCT province FROM thailand_addresses ORDER BY province";
$result = $conn->query($sql);

$provinces = [];
while ($row = $result->fetch_assoc()) {
    $provinces[] = $row['province'];
}

echo json_encode($provinces);
?>
```

### 2. ใช้ npm package
```bash
npm install thai-address-autocomplete
```

### 3. ดาวน์โหลด JSON มาเก็บใน project
- ดาวน์โหลดข้อมูลจาก GitHub
- เก็บเป็น local JSON file
- ใช้ import แบบ static

## สรุป
ระบบปัจจุบันใช้ Address Service ที่:
- ✅ ดึงข้อมูลจาก API แบบ real-time
- ✅ มี caching เพื่อประสิทธิภาพ
- ✅ มี fallback กรณี API ล้มเหลว
- ✅ Auto-fill รหัสไปรษณีย์
- ✅ รองรับที่อยู่ออกใบกำกับภาษีและที่อยู่จัดส่งแยกกัน
