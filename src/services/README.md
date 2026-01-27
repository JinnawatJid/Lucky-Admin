# Services

โฟลเดอร์นี้เก็บ Service layer สำหรับการเรียกใช้งาน API และจัดการข้อมูล

## ไฟล์ที่มีอยู่

### addressService.ts
Service สำหรับจัดการข้อมูลที่อยู่ไทย (จังหวัด, อำเภอ, ตำบล, รหัสไปรษณีย์)

**ฟีเจอร์:**
- ดึงรายชื่อจังหวัดทั้งหมด
- ดึงรายชื่ออำเภอตามจังหวัด
- ดึงรายชื่อตำบลตามอำเภอ
- ค้นหารหัสไปรษณีย์จากที่อยู่
- ค้นหาที่อยู่จากรหัสไปรษณีย์
- Caching mechanism เพื่อลดการเรียก API
- Fallback data กรณี API ล้มเหลว

**วิธีใช้งาน:**
```typescript
import * as AddressService from '@/services/addressService';

// ดึงจังหวัด
const provinces = await AddressService.getProvinces();

// ดึงอำเภอ
const districts = await AddressService.getDistricts("กรุงเทพมหานคร");

// ดึงตำบล
const subdistricts = await AddressService.getSubdistricts(
  "กรุงเทพมหานคร",
  "เขตพระนคร"
);

// ค้นหารหัสไปรษณีย์
const zipCode = await AddressService.getZipCode(
  "กรุงเทพมหานคร",
  "เขตพระนคร",
  "แขวงพระบรมมหาราชวัง"
);
```

**ดูเอกสารเต็มได้ที่:** [ADDRESS_SERVICE_GUIDE.md](../docs/ADDRESS_SERVICE_GUIDE.md)

## Guidelines

### การสร้าง Service ใหม่

1. สร้างไฟล์ใหม่ในโฟลเดอร์นี้ เช่น `userService.ts`
2. Export functions ที่จำเป็น
3. เพิ่ม TypeScript interfaces สำหรับ type safety
4. เพิ่ม error handling
5. พิจารณาเพิ่ม caching หากเหมาะสม

**ตัวอย่าง:**
```typescript
// userService.ts

export interface User {
  id: string;
  name: string;
  email: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};
```

### Best Practices

1. **Separation of Concerns**: แยก business logic ออกจาก UI components
2. **Type Safety**: ใช้ TypeScript interfaces สำหรับทุก API response
3. **Error Handling**: จัดการ errors อย่างเหมาะสม
4. **Caching**: เพิ่ม caching สำหรับข้อมูลที่ไม่เปลี่ยนบ่อย
5. **Documentation**: เขียน JSDoc comments สำหรับทุก public function

### Testing

ควรเขียน unit tests สำหรับ services:

```typescript
// addressService.test.ts
import * as AddressService from './addressService';

describe('AddressService', () => {
  test('getProvinces should return array of provinces', async () => {
    const provinces = await AddressService.getProvinces();
    expect(Array.isArray(provinces)).toBe(true);
    expect(provinces.length).toBeGreaterThan(0);
  });

  test('getDistricts should return districts for given province', async () => {
    const districts = await AddressService.getDistricts('กรุงเทพมหานคร');
    expect(Array.isArray(districts)).toBe(true);
  });
});
```
