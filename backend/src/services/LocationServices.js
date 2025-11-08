const fs = require('fs');
const path = require('path');
const zlib = require('zlib');


const compressedData = fs.readFileSync(
    path.join(__dirname, '../data/data.json.gz')
);


const jsonData = zlib.gunzipSync(compressedData).toString('utf8');
const allData = JSON.parse(jsonData);

// Lấy tất cả tỉnh/thành
const getAllProvinces = () => {
    return new Promise((resolve) => {
        const provinces = allData.map(province => ({
            code: province.level1_id,
            name: province.name,
            type: province.type
        }));

        resolve({
            status: 'OK',
            message: 'SUCCESS',
            data: provinces
        });
    });
};

// Lấy quận/huyện theo tỉnh
const getDistrictsByProvince = (provinceCode) => {
    return new Promise((resolve) => {
        let districts = [];
        const province = allData.find(p => p.level1_id === provinceCode);

        if (province && province.level2s) {
            districts = province.level2s.map(district => ({
                code: district.level2_id,
                name: district.name,
                type: district.type,
                provinceCode: provinceCode
            }));
        }

        resolve({
            status: 'OK',
            message: 'SUCCESS',
            data: districts
        });
    });
};

// Lấy phường/xã theo quận
const getWardsByDistrict = (districtCode) => {
    return new Promise((resolve) => {
        let wards = [];
        let found = false;

        for (const province of allData) {
            if (province.level2s) {
                const district = province.level2s.find(d => d.level2_id === districtCode);
                if (district && district.level3s) {
                    wards = district.level3s.map(ward => ({
                        code: ward.level3_id,
                        name: ward.name,
                        type: ward.type,
                        districtCode: districtCode
                    }));
                    found = true;
                    break;
                }
            }
            if (found) break;
        }

        resolve({
            status: 'OK',
            message: 'SUCCESS',
            data: wards
        });
    });
};

module.exports = {
    getAllProvinces,
    getDistrictsByProvince,
    getWardsByDistrict
};