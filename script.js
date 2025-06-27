document.addEventListener('DOMContentLoaded', function() {
    const tileWidthInput = document.getElementById('tileWidth');
    const tileLengthInput = document.getElementById('tileLength');
    const cutWidthInput = document.getElementById('cutWidth');
    const cutLengthInput = document.getElementById('cutLength');
    const areaSqMInput = document.getElementById('areaSqM');
    const calculateBtn = document.getElementById('calculateBtn');

    const displayTileSize = document.getElementById('displayTileSize');
    const displayCutSize = document.getElementById('displayCutSize');
    const piecesPerTile = document.getElementById('piecesPerTile');
    const tilesNeeded = document.getElementById('tilesNeeded');
    const costPerSqMCut = document.getElementById('costPerSqMCut');
    const totalCuttingCost = document.getElementById('totalCuttingCost');

    // *** ข้อมูลราคาค่าตัดใหม่ที่คุณให้มา ***
    // โครงสร้างข้อมูล: { 'ขนาดตั้งต้น_กว้างxยาว': { 'ขนาดที่ตัด_กว้างxยาว': ราคาต่อตรม. } }
    // ตัวอย่าง: '30x60': { '10x60': 520, '15x60': 245, ... }
    const cuttingCosts = {
        '30x60': {
            '10x60': 520, '15x60': 245, '20x60': 130, '10x30': 670, '15x30': 455,
            '20x30': 345, '30x30': 130, '30x50': 80, '10x20': 995, '20x20': 345,
            '10x15': 1320, '15x15': 895, '10x10': 670
        },
        '60x60': {
            '40x60': 120, '33x60': 90, '30x60': 130, '25x60': 130, '20x60': 275,
            '15x60': 360, '12x60': 440, '10x60': 520, '8x60': 610, '6x60': 860,
            '5x60': 1030, '59.70x59.70': 130, '50x50': 140, '40x40': 130,
            '6x30': 1120, '10x30': 670, '15x30': 455, '20x30': 345, '30x30': 245,
            '20x20': 510, '15x15': 895, '10x10': 670, '18.70x60': 275
        },
        '60x90': {
            '30x90': 220, '20x90': 355, '15x90': 460, '10x90': 680, '10x60': 570,
            '60x60': 100, '30x60': 190
        },
        '30x30': {
            '15x30': 450, '10x30': 665, '6x30': 1095, '10x10': 670
        },
        '20x120': {
            '15x90': 295, '15x120': 300, '10x120': 455
        },
        '80x80': {
            '40x80': 190, '20x80': 390, '15x80': 485, '10x80': 755, '30x60': 125,
            '10x60': 485, '40x40': 275
        },
        '45x90': {
            '22.5x90': 280, '20x90': 315, '15x90': 455, '10x90': 600, '45x45': 215,
            '30x45': 315
        },
        '60x120': {
            '40x120': 120, '30x120': 205, '25x120': 210, '20x120': 360, '15x120': 460,
            '13x120': 455, '10x120': 670, '5x120': 1320, '3.5x120': 1870,
            '15x90': 390, '45x90': 130, '15x80': 470, '60x60': 130, '40x60': 170,
            '30x60': 205, '20x60': 295, '10x60': 570, '7.5x60': 750, '15x60': 385,
            '50x50': 130, '40x40': 190, '15x40': 470, '30x30': 245, '20x30': 345,
            '10x30': 800
        }
    };

    calculateBtn.addEventListener('click', calculateCuttingCost);

    // เพิ่ม event listener สำหรับการกด Enter ในช่อง input ทั้งหมด
    document.querySelectorAll('.input-group input[type="number"]').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateCuttingCost();
            }
        });
    });

    function calculateCuttingCost() {
        const tileWidth = parseFloat(tileWidthInput.value);
        const tileLength = parseFloat(tileLengthInput.value);
        const cutWidth = parseFloat(cutWidthInput.value);
        const cutLength = parseFloat(cutLengthInput.value);
        const areaSqM = parseFloat(areaSqMInput.value);

        // ตรวจสอบค่าที่ป้อน
        if (isNaN(tileWidth) || isNaN(tileLength) || isNaN(cutWidth) || isNaN(cutLength) || isNaN(areaSqM) ||
            tileWidth <= 0 || tileLength <= 0 || cutWidth <= 0 || cutLength <= 0 || areaSqM <= 0) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง (ต้องเป็นตัวเลขและมากกว่า 0)');
            resetResults();
            return;
        }

        displayTileSize.textContent = `${tileWidth} ซม. x ${tileLength} ซม.`;
        displayCutSize.textContent = `${cutWidth} ซม. x ${cutLength} ซม.`;

        // สร้าง key สำหรับค้นหาราคาค่าตัด
        const originalTileKey = `${tileWidth}x${tileLength}`;
        const originalTileKeyRotated = `${tileLength}x${tileWidth}`; // เผื่อกรณีป้อนสลับด้าน

        const cutSizeKey = `${cutWidth}x${cutLength}`;
        const cutSizeKeyRotated = `${cutLength}x${cutWidth}`; // เผื่อกรณีป้อนสลับด้าน

        let costPerSqM = 0;
        let foundPrice = false;

        // ตรวจสอบราคาจากขนาดตั้งต้นที่ป้อนโดยตรง
        if (cuttingCosts[originalTileKey] && (cuttingCosts[originalTileKey][cutSizeKey] !== undefined || cuttingCosts[originalTileKey][cutSizeKeyRotated] !== undefined)) {
            costPerSqM = cuttingCosts[originalTileKey][cutSizeKey] || cuttingCosts[originalTileKey][cutSizeKeyRotated];
            foundPrice = true;
        }
        // ถ้าไม่พบในขนาดตั้งต้นที่ป้อน ให้ลองขนาดตั้งต้นแบบกลับด้าน
        else if (cuttingCosts[originalTileKeyRotated] && (cuttingCosts[originalTileKeyRotated][cutSizeKey] !== undefined || cuttingCosts[originalTileKeyRotated][cutSizeKeyRotated] !== undefined)) {
            costPerSqM = cuttingCosts[originalTileKeyRotated][cutSizeKey] || cuttingCosts[originalTileKeyRotated][cutSizeKeyRotated];
            foundPrice = true;
        }

        if (!foundPrice) {
            alert(`ไม่พบราคาค่าตัดสำหรับกระเบื้องขนาดตั้งต้น ${tileWidth}x${tileLength} และขนาดที่ตัด ${cutWidth}x${cutLength} ในฐานข้อมูล กรุณาตรวจสอบข้อมูล หรือเพิ่มราคาใน 'cuttingCosts' ใน script.js`);
            resetResults();
            return;
        }

        costPerSqMCut.textContent = costPerSqM.toFixed(2);

        // คำนวณจำนวนชิ้นที่ได้จากกระเบื้อง 1 แผ่น (ยังคงใช้การคำนวณนี้เพื่อหาจำนวนแผ่นที่ต้องใช้)
        const piecesWidthNormal = Math.floor(tileWidth / cutWidth);
        const piecesLengthNormal = Math.floor(tileLength / cutLength);
        const piecesOption1 = piecesWidthNormal * piecesLengthNormal;

        const piecesWidthRotated = Math.floor(tileWidth / cutLength);
        const piecesLengthRotated = Math.floor(tileLength / cutWidth);
        const piecesOption2 = piecesWidthRotated * piecesLengthRotated;

        const piecesFromTile = Math.max(piecesOption1, piecesOption2);

        if (piecesFromTile === 0) {
            alert('ไม่สามารถตัดกระเบื้องขนาดที่ต้องการจากกระเบื้องเดิมได้ กรุณาตรวจสอบขนาด หรือหากมั่นใจว่าตัดได้แต่ระบบคำนวณไม่ได้ โปรดปรึกษาผู้ดูแลโค้ด');
            resetResults();
            return;
        }
        piecesPerTile.textContent = piecesFromTile;

        // คำนวณจำนวนกระเบื้องที่ต้องใช้ทั้งหมด (ประมาณการ)
        const cutTileAreaCm2 = cutWidth * cutLength;
        const piecesNeededTotal = Math.ceil(areaSqM / (cutTileAreaCm2 / 10000));
        const totalTilesNeeded = Math.ceil(piecesNeededTotal / piecesFromTile);

        tilesNeeded.textContent = totalTilesNeeded;

        // คำนวณค่าตัดทั้งหมด
        const totalCost = areaSqM * costPerSqM;
        totalCuttingCost.textContent = totalCost.toFixed(2);
    }

    function resetResults() {
        displayTileSize.textContent = 'N/A';
        displayCutSize.textContent = 'N/A';
        piecesPerTile.textContent = '0';
        tilesNeeded.textContent = '0';
        costPerSqMCut.textContent = '0.00';
        totalCuttingCost.textContent = '0.00';
    }

    // เริ่มต้นคำนวณเมื่อโหลดหน้า เพื่อแสดงค่าเริ่มต้น
    calculateCuttingCost();
});