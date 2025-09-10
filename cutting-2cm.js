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

    // ข้อมูลราคาค่าตัดสำหรับกระเบื้องหนา 2 CM.
    const cuttingCosts = {
        '60x60': {
            '40x60': 115.00, '30x60': 205.00, '20x60': 385.00, '15x60': 505.00, '10x60': 750.00,
            '5x60': 1480.00, '59.70x59.70': 165.00, '10x30': 1125.00, '15x30': 760.00,
            '30x30': 390.00, '10x10': 2015.00
        },
        '60x120': {
            '40x120': 280.00, '30x120': 535.00, '20x120': 905.00, '15x120': 1200.00,
            '10x120': 1790.00, '5x120': 3565.00, '60x60': 390.00, '30x60': 535.00,
            '10x60': 2015.00, '15x60': 1350.00, '40x40': 575.00, '15x40': 1790.00,
            '30x30': 760.00, '10x30': 3385.00
        }
    };

    function populateOriginalTileSizes() {
        originalTileSizeSelect.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'เลือกขนาดกระเบื้องเดิม';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        originalTileSizeSelect.appendChild(defaultOption);

        Object.keys(cuttingCosts).forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size.replace('x', ' x ');
            originalTileSizeSelect.appendChild(option);
        });
    }

    function populateCutTileSizes(selectedOriginalSize) {
        cutTileSizeSelect.innerHTML = '';
        cutTileSizeSelect.disabled = true;

        if (selectedOriginalSize && cuttingCosts[selectedOriginalSize]) {
            const cutSizes = Object.keys(cuttingCosts[selectedOriginalSize]);
            if (cutSizes.length > 0) {
                cutTileSizeSelect.disabled = false;
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
        displayCutSize.textContent = 'N/A';
    }

    originalTileSizeSelect.addEventListener('change', function() {
        populateCutTileSizes(this.value);
        resetResults();
    });

    cutTileSizeSelect.addEventListener('change', function() {
        calculateCuttingCost();
    });

    calculateBtn.addEventListener('click', calculateCuttingCost);

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
        if (cuttingCosts[originalTileSize] && cuttingCosts[originalTileSize][cutTileSize] !== undefined) {
            costPerSqM = cuttingCosts[originalTileSize][cutTileSize];
        } else {
             alert(`ไม่พบราคาค่าตัดสำหรับกระเบื้องขนาดตั้งต้น ${originalTileSize} และขนาดที่ตัด ${cutTileSize} ในฐานข้อมูล กรุณาตรวจสอบข้อมูล`);
             resetResults();
             return;
        }
        
        costPerSqMCut.textContent = costPerSqM.toFixed(2);

        const piecesWidthNormal = Math.floor(tileWidth / cutWidth);
        const piecesLengthNormal = Math.floor(tileLength / cutLength);
        const piecesOption1 = piecesWidthNormal * piecesLengthNormal;

        const piecesWidthRotated = Math.floor(tileWidth / cutLength);
        const piecesLengthRotated = Math.floor(tileLength / cutWidth);
        const piecesOption2 = piecesWidthRotated * piecesLengthRotated;

        const piecesFromTile = Math.max(piecesOption1, piecesOption2);

        if (piecesFromTile === 0) {
            alert('ไม่สามารถตัดกระเบื้องขนาดที่ต้องการจากกระเบื้องเดิมได้ กรุณาตรวจสอบขนาด');
            resetResults();
            return;
        }
        piecesPerTile.textContent = piecesFromTile;

        const cutTileAreaCm2 = cutWidth * cutLength;
        const piecesNeededTotal = Math.ceil(areaSqM / (cutTileAreaCm2 / 10000));
        const totalTilesNeeded = Math.ceil(piecesNeededTotal / piecesFromTile);

        tilesNeeded.textContent = totalTilesNeeded;

        const actualTotalCutPieces = totalTilesNeeded * piecesFromTile;
        actualCutPieces.textContent = actualTotalCutPieces;

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

    populateOriginalTileSizes();
    cutTileSizeSelect.disabled = true;
});