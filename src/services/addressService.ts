/**
 * Address Service
 * Service for fetching Thai address data (provinces, districts, subdistricts)
 */

export interface Province {
    id: number;
    name_th: string;
    name_en: string;
}

export interface District {
    id: number;
    name_th: string;
    name_en: string;
    province_id: number;
}

export interface Subdistrict {
    id: number;
    zip_code: string;
    name_th: string;
    name_en: string;
    amphure_id: number;
    province_id: number;
}

// Cache สำหรับเก็บข้อมูลที่ดึงมาแล้ว เพื่อลดการเรียก API
let apiDataCache: any = null; // Cache สำหรับเก็บข้อมูลทั้งหมดจาก API

const cache = {
    provinces: null as Province[] | null,
    districts: new Map<string, string[]>(),
    subdistricts: new Map<string, string[]>(),
};

/**
 * โหลดข้อมูลทั้งหมดจาก API ครั้งเดียว
 */
const loadAllData = async (): Promise<any> => {
    if (apiDataCache) {
        return apiDataCache;
    }

    console.log('📥 Fetching address data from API...');

    // ใช้ URL ที่เป็น Raw Database (JSON ปกติ ไม่ใช่แบบบีบอัด)
    const urls = [
        'https://raw.githubusercontent.com/earthchie/jquery.Thailand.js/master/jquery.Thailand.js/database/raw_database/raw_database.json',
        'https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/database/raw_database/raw_database.json'
    ];

    let lastError;

    for (const url of urls) {
        try {
            console.log(`Trying to fetch from: ${url}`);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Validate data structure
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Invalid data format received from API');
            }

            // ตรวจสอบว่าข้อมูลตัวแรกมี field ที่เราต้องการไหม
            const firstItem = data[0];
            if (!firstItem.province || !firstItem.amphoe || !firstItem.district) {
                throw new Error('Data structure mismatch: missing required fields');
            }

            apiDataCache = data;
            console.log(`✅ API data loaded successfully from: ${url}, total records: ${data.length}`);
            return data;
        } catch (error) {
            console.warn(`⚠️ Failed to fetch from ${url}:`, error);
            lastError = error;
            // Continue to next URL
        }
    }

    console.error('❌ All API sources failed');
    throw lastError || new Error('Failed to fetch address data from all sources');
};

/**
 * ดึงข้อมูลจังหวัดทั้งหมด
 */
export const getProvinces = async (): Promise<string[]> => {
    console.log('🔍 Getting provinces...');

    // ถ้ามี cache แล้วให้ใช้ cache
    if (cache.provinces) {
        console.log('✅ Returning cached provinces:', cache.provinces.length);
        return cache.provinces.map(p => p.name_th);
    }

    try {
        const data = await loadAllData();

        // แปลงข้อมูลให้เป็นรูปแบบที่ต้องการ
        const uniqueProvinces = [...new Set(data.map((item: any) => item.province))];
        // เรียงลำดับ ก-ฮ
        uniqueProvinces.sort();

        cache.provinces = uniqueProvinces.map((name, index) => ({
            id: index + 1,
            name_th: name as string,
            name_en: ''
        }));

        console.log('✅ Provinces loaded:', uniqueProvinces.length);
        return uniqueProvinces as string[];
    } catch (error) {
        console.error('❌ Error fetching provinces:', error);

        // Fallback: ถ้า API ล้มเหลว ให้ใช้ข้อมูล hardcode
        const fallbackProvinces = [
            "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น",
            "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย",
            "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา",
            "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์",
            "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พังงา",
            "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "ภูเก็ต", "มหาสารคาม",
            "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี",
            "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ",
            "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี",
            "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ",
            "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
        ];
        console.log('⚠️ Using fallback provinces:', fallbackProvinces.length);
        return fallbackProvinces;
    }
};

/**
 * ดึงข้อมูลอำเภอ/เขต ตามจังหวัดที่เลือก
 */
export const getDistricts = async (provinceName: string): Promise<string[]> => {
    if (!provinceName) {
        console.log('⚠️ No province name provided');
        return [];
    }

    console.log('🔍 Getting districts for province:', provinceName);

    // ตรวจสอบ cache
    if (cache.districts.has(provinceName)) {
        const cached = cache.districts.get(provinceName)!;
        console.log('✅ Returning cached districts:', cached.length);
        return cached;
    }

    try {
        const data = await loadAllData();

        // กรองข้อมูลตามจังหวัด
        const districts = data
            .filter((item: any) => item.province === provinceName)
            .map((item: any) => item.amphoe);

        // เอาค่าที่ไม่ซ้ำกัน และเรียงลำดับ
        const uniqueDistricts = [...new Set(districts)] as string[];
        uniqueDistricts.sort();

        // บันทึกลง cache
        cache.districts.set(provinceName, uniqueDistricts);

        console.log(`✅ Districts loaded for ${provinceName}:`, uniqueDistricts.length);
        return uniqueDistricts;
    } catch (error) {
        console.error('❌ Error fetching districts:', error);

        // Fallback: ข้อมูล mock
        const mockDistricts: Record<string, string[]> = {
            "กรุงเทพมหานคร": ["เขตพระนคร", "เขตดุสิต", "เขตหนองจอก", "เขตบางรัก", "เขตบางเขน", "เขตบางกะปิ", "เขตปทุมวัน", "เขตป้อมปราบศัตรูพ่าย", "เขตพระโขนง", "เขตมีนบุรี"],
            "ชลบุรี": ["เมืองชลบุรี", "บ้านบึง", "หนองใหญ่", "บางละมุง", "พานทอง", "พนัสนิคม", "ศรีราชา", "เกาะสีชัง", "สัตหีบ", "บ่อทอง"],
            "เชียงใหม่": ["เมืองเชียงใหม่", "จอมทอง", "แม่แจ่ม", "เชียงดาว", "ดอยสะเก็ด", "แม่แตง", "แม่ริม", "สะเมิง", "ฝาง", "แม่อาย"],
        };
        const fallback = mockDistricts[provinceName] || [];
        console.log(`⚠️ Using fallback districts for ${provinceName}:`, fallback.length);
        return fallback;
    }
};

/**
 * ดึงข้อมูลตำบล/แขวง ตามอำเภอที่เลือก
 */
export const getSubdistricts = async (provinceName: string, districtName: string): Promise<string[]> => {
    if (!provinceName || !districtName) {
        console.log('⚠️ No province or district name provided');
        return [];
    }

    const cacheKey = `${provinceName}|${districtName}`;
    console.log('🔍 Getting subdistricts for:', cacheKey);

    // ตรวจสอบ cache
    if (cache.subdistricts.has(cacheKey)) {
        const cached = cache.subdistricts.get(cacheKey)!;
        console.log('✅ Returning cached subdistricts:', cached.length);
        return cached;
    }

    try {
        const data = await loadAllData();

        // กรองข้อมูลตามจังหวัดและอำเภอ
        const subdistricts = data
            .filter((item: any) => item.province === provinceName && item.amphoe === districtName)
            .map((item: any) => item.district);

        // เอาค่าที่ไม่ซ้ำกัน และเรียงลำดับ
        const uniqueSubdistricts = [...new Set(subdistricts)] as string[];
        uniqueSubdistricts.sort();

        // บันทึกลง cache
        cache.subdistricts.set(cacheKey, uniqueSubdistricts);

        console.log(`✅ Subdistricts loaded for ${cacheKey}:`, uniqueSubdistricts.length);
        return uniqueSubdistricts;
    } catch (error) {
        console.error('❌ Error fetching subdistricts:', error);

        // Fallback: ข้อมูล mock
        const mockSubdistricts: Record<string, string[]> = {
            "เขตพระนคร": ["แขวงพระบรมมหาราชวัง", "แขวงวังบูรพาภิรมย์", "แขวงวัดราชบพิธ", "แขวงสำราญราษฎร์", "แขวงศาลเจ้าพ่อเสือ"],
            "เมืองชลบุรี": ["ตำบลบางปลาสร้อย", "ตำบลมะขามหย่ง", "ตำบลบ้านโขด", "ตำบลแสนสุข", "ตำบลบ้านสวน"],
            "เมืองเชียงใหม่": ["ตำบลศรีภูมิ", "ตำบลพระสิงห์", "ตำบลหายยา", "ตำบลช้างม่อย", "ตำบลช้างคลาน"],
        };
        const fallback = mockSubdistricts[districtName] || [];
        console.log(`⚠️ Using fallback subdistricts for ${districtName}:`, fallback.length);
        return fallback;
    }
};

/**
 * ค้นหารหัสไปรษณีย์จากที่อยู่
 */
export const getZipCode = async (
    provinceName: string,
    districtName: string,
    subdistrictName: string
): Promise<string> => {
    if (!provinceName || !districtName || !subdistrictName) return '';

    try {
        const data = await loadAllData();

        // ค้นหาข้อมูลที่ตรงกัน
        const result = data.find((item: any) =>
            item.province === provinceName &&
            item.amphoe === districtName &&
            item.district === subdistrictName
        );

        // แปลงเป็น string เพราะบางที API อาจส่งมาเป็น number
        return result?.zipcode ? String(result.zipcode) : '';
    } catch (error) {
        console.error('Error fetching zipcode:', error);
        return '';
    }
};

/**
 * ค้นหาที่อยู่จากรหัสไปรษณีย์
 */
export const getAddressByZipCode = async (zipCode: string): Promise<{
    province: string;
    district: string;
    subdistrict: string;
}[]> => {
    if (!zipCode) return [];

    try {
        const data = await loadAllData();

        // ค้นหาข้อมูลที่ตรงกับรหัสไปรษณีย์
        // แปลง zipcode ใน data เป็น string ก่อนเปรียบเทียบ
        const results = data
            .filter((item: any) => String(item.zipcode) === String(zipCode))
            .map((item: any) => ({
                province: item.province,
                district: item.amphoe,
                subdistrict: item.district
            }));

        return results;
    } catch (error) {
        console.error('Error fetching address by zipcode:', error);
        return [];
    }
};
