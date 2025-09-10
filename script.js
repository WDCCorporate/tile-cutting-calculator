document.addEventListener('DOMContentLoaded', function() {
    const originalTileSizeSelect = document.getElementById('originalTileSize');
    const cutTileSizeSelect = document.getElementById('cutTileSize');
    const areaSqMInput = document.getElementById('areaSqM');
    const calculateBtn = document.getElementById('calculateBtn');

    const displayTileSize = document.getElementById('displayTileSize');
    const displayCutSize = document.getElementById('displayCutSize');
    const piecesPerTile = document.getElementById('piecesPerTile');
	    const actualCutPieces = document.getElementById('actualCutPieces');
    const tilesNeeded = document.getElementById('tilesNeeded');
    const costPerSqMCut = document.getElementById('costPerSqMCut');
    const totalCuttingCost = document.getElementById('totalCuttingCost');

    // ข้อมูลราคาค่าตัดจ้า
    const cuttingCosts = {
        '30x60': {
            '10x60': 500, '15x60': 230, '20x60': 125, '10x30': 645, '15x30': 440,
            '20x30': 330, '30x30': 125, '30x50': 75, '10x20': 955, '20x20': 335,
            '10x15': 1270, '15x15': 855, '10x10': 645
        },
        '60x60': {
            '40x60': 75, '33x60': 75, '30x60': 125, '25x60': 125, '20x60': 260,
            '15x60': 340, '12x60': 420, '10x60': 500, '8x60': 580, '6x60': 820,
            '5x60': 980, '59.70x59.70': 125, '50x50': 125, '40x40': 125,
            '6x30': 1060, '10x30': 645, '15x30': 440, '20x30': 335, '30x30': 230,
            '20x20': 490, '15x15': 855, '10x10': 645, '18.70x60': 260
        },
        '60x90': {
            '30x90': 230, '20x90': 335, '15x90': 440, '10x90': 645, '10x60': 540,
            '60x60': 90, '30x60': 180
        },
        '30x30': {
            '15x30': 435, '10x30': 640, '6x30': 1055, '10x10': 640
        },
        '20x120': {
            '15x90': 280, '15x120': 280, '10x120': 440
        },
        '80x80': {
            '40x80': 180, '20x80': 375, '15x80': 460, '10x80': 725, '30x60': 120,
            '10x60': 440, '40x40': 255
        },
        '60x120': {
            '40x120': 110, '30x120': 195, '25x120': 195, '20x120': 335, '15x120': 440,
            '13x120': 440, '10x120': 645, '5x120': 1270, '3.5x120': 1790,
            '15x90': 400, '45x90': 125, '15x80': 440, '60x60': 125, '40x60': 110,
            '30x60': 195, '20x60': 280, '10x60': 540, '7.5x60': 715, '15x60': 370,
            '50x50': 125, '40x40': 180, '15x40': 440, '30x30': 230, '20x30': 335,
            '10x30': 770
        }
    };

    function populateOriginalTileSizes() {
        // Clear existing options
        originalTileSizeSelect.innerHTML = '';
        // Add a default disabled option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'เลือกขนาดกระเบื้องเดิม';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        originalTileSizeSelect.appendChild(defaultOption);

        // Populate with unique keys from cuttingCosts
        Object.keys(cuttingCosts).forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size.replace('x', ' x ');
            originalTileSizeSelect.appendChild(option);
        });
    }

    function populateCutTileSizes(selectedOriginalSize) {
        cutTileSizeSelect.innerHTML = ''; // Clear existing options
        cutTileSizeSelect.disabled = true; // Disable until a valid original size is selected

        if (selectedOriginalSize && cuttingCosts[selectedOriginalSize]) {
            const cutSizes = Object.keys(cuttingCosts[selectedOriginalSize]);
            if (cutSizes.length > 0) {
                cutTileSizeSelect.disabled = false;
                // Add a default disabled option for cut size
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'เลือกขนาดที่ต้องการตัด';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                cutTileSizeSelect.appendChild(defaultOption);

                cutSizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size.replace('x', ' x ');
                    cutTileSizeSelect.appendChild(option);
                });
            }
        }
        // Reset display if no cut sizes are available or selected
        displayCutSize.textContent = 'N/A';
    }

    // Event listener for when original tile size changes
    originalTileSizeSelect.addEventListener('change', function() {
        populateCutTileSizes(this.value);
        resetResults(); // Reset results when original tile size changes
    });

    // Event listener for when cut tile size changes
    cutTileSizeSelect.addEventListener('change', function() {
        calculateCuttingCost();
    });

    calculateBtn.addEventListener('click', calculateCuttingCost);

    // เพิ่ม event listener สำหรับการกด Enter ในช่อง input พื้นที่
    areaSqMInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateCuttingCost();
        }
    });

    function calculateCuttingCost() {
        const originalTileSize = originalTileSizeSelect.value;
        const cutTileSize = cutTileSizeSelect.value;
        const areaSqM = parseFloat(areaSqMInput.value);

        if (!originalTileSize || !cutTileSize || isNaN(areaSqM) || areaSqM <= 0) {
            alert('กรุณาเลือกขนาดกระเบื้องและระบุพื้นที่รวมที่ต้องการตัดให้ถูกต้อง');
            resetResults();
            return;
        }

        const [tileWidth, tileLength] = originalTileSize.split('x').map(Number);
        const [cutWidth, cutLength] = cutTileSize.split('x').map(Number);

        displayTileSize.textContent = `${tileWidth} ซม. x ${tileLength} ซม.`;
        displayCutSize.textContent = `${cutWidth} ซม. x ${cutLength} ซม.`;

        let costPerSqM = 0;
        // Check for direct match first
        if (cuttingCosts[originalTileSize] && cuttingCosts[originalTileSize][cutTileSize] !== undefined) {
            costPerSqM = cuttingCosts[originalTileSize][cutTileSize];
        } else {
            // Check for rotated cut size if direct match not found
            const [cutWidthRotated, cutLengthRotated] = [cutLength, cutWidth];
            const cutTileSizeRotated = `${cutWidthRotated}x${cutLengthRotated}`;
            if (cuttingCosts[originalTileSize] && cuttingCosts[originalTileSize][cutTileSizeRotated] !== undefined) {
                costPerSqM = cuttingCosts[originalTileSize][cutTileSizeRotated];
            } else {
                // If still not found, try original tile size rotated
                const [tileWidthRotated, tileLengthRotated] = [tileLength, tileWidth];
                const originalTileSizeRotated = `${tileWidthRotated}x${tileLengthRotated}`;
                if (cuttingCosts[originalTileSizeRotated] && cuttingCosts[originalTileSizeRotated][cutTileSize] !== undefined) {
                    costPerSqM = cuttingCosts[originalTileSizeRotated][cutTileSize];
                } else if (cuttingCosts[originalTileSizeRotated] && cuttingCosts[originalTileSizeRotated][cutTileSizeRotated] !== undefined) {
                    costPerSqM = cuttingCosts[originalTileSizeRotated][cutTileSizeRotated];
                } else {
                     alert(`ไม่พบราคาค่าตัดสำหรับกระเบื้องขนาดตั้งต้น ${originalTileSize} และขนาดที่ตัด ${cutTileSize} ในฐานข้อมูล กรุณาตรวจสอบข้อมูล`);
                     resetResults();
                     return;
                }
            }
        }
        
        costPerSqMCut.textContent = costPerSqM.toFixed(2);

        // Calculate pieces from tile (using both orientations)
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

        // Calculate total tiles needed
        const cutTileAreaCm2 = cutWidth * cutLength;
        const piecesNeededTotal = Math.ceil(areaSqM / (cutTileAreaCm2 / 10000));
        const totalTilesNeeded = Math.ceil(piecesNeededTotal / piecesFromTile);

        tilesNeeded.textContent = totalTilesNeeded;

        // เพิ่มการคำนวณจำนวนกระเบื้องที่ได้หลังตัดทั้งหมด
        const actualTotalCutPieces = totalTilesNeeded * piecesFromTile;
        actualCutPieces.textContent = actualTotalCutPieces;

        // Calculate total cutting cost
        const totalCost = areaSqM * costPerSqM;
        totalCuttingCost.textContent = totalCost.toFixed(2);
    }

    function resetResults() {
        displayTileSize.textContent = 'N/A';
        displayCutSize.textContent = 'N/A';
        piecesPerTile.textContent = '0';
        actualCutPieces.textContent = '0';
        tilesNeeded.textContent = '0';
        costPerSqMCut.textContent = '0.00';
        totalCuttingCost.textContent = '0.00';
    }

    // Initial population of dropdowns and calculation on page load
    populateOriginalTileSizes();
    // Initially disable cut tile size dropdown until an original size is selected
    cutTileSizeSelect.disabled = true;
});
