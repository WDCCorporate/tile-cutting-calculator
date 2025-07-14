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

    // ข้อมูลราคาค่าตัด
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
