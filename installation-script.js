document.addEventListener('DOMContentLoaded', function() {
    const serviceSelect = document.getElementById('serviceSelect');
    const quantityInput = document.getElementById('quantityInput');
    const unitDisplay = document.getElementById('unitDisplay');
    const calculateInstallationBtn = document.getElementById('calculateInstallationBtn');

    const displayService = document.getElementById('displayService');
    const displayQuantity = document.getElementById('displayQuantity');
    const displayUnitPrice = document.getElementById('displayUnitPrice');
    const totalInstallationCost = document.getElementById('totalInstallationCost');

    // รายการและราคาค่าบริการ
    const servicePrices = [
        { name: 'ติดตั้ง กระเบื้อง 40-60 cm.', price: 600.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง กระเบื้องพื้น/ผนัง 25x40 ,30x30 ,30x60 , 60x60 cm.', price: 600.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง กระเบื้องพื้น/ผนัง 40x80 ,45x80 ,80x80 ,60x90 cm.', price: 670.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง กระเบื้องพื้น/ผนัง 90x90 ,60x120 ,120x120 cm.', price: 710.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง กระเบื้องพื้น/ผนัง 120x240 cm.', price: 1500.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง กระเบื้องพื้น/ผนัง 150x300 cm.', price: 2000.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง กระเบื้องพื้น/ผนัง 160x320 cm.', price: 2250.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง กระเบื้องลายไม้พื้น/ผนัง 15x60 ,15x90 ,20x120 cm.', price: 630.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง Mosaic ,Subway พื้น/ผนัง 7.5x15 ,10x20 ,10x30 ,5x20 cm.', price: 800.00, unit: 'ตรม.' },
        { name: 'รื้อพื้นกระเบื้อง + พร้อมขนทิ้ง', price: 180.00, unit: 'ตรม.' },
        { name: 'ปรับพื้น (ไม่เกิน 3-5 cm.)', price: 330.00, unit: 'ตรม.' },
        { name: 'ฉาบผนัง', price: 330.00, unit: 'ตรม.' },
        { name: 'สกัดผิวผนัง', price: 70.00, unit: 'ตรม.' },
        { name: 'ทำกันชื้น', price: 315.00, unit: 'ตรม.' },
        { name: 'โพเทคพื้น,กระดาษลูกฟูก (เทปกาวช่าง)', price: 45.00, unit: 'ตรม.' },
        { name: 'งานเข้ามุม 45 องศา / เมตร', price: 285.00, unit: 'เมตร' },
        { name: 'เจารูกลมด้วยหัวเพชร / รู', price: 335.00, unit: 'รู' }
    ];

    function populateServiceOptions() {
        serviceSelect.innerHTML = ''; // Clear existing options
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'เลือกรายการบริการ';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        serviceSelect.appendChild(defaultOption);

        servicePrices.forEach((service, index) => {
            const option = document.createElement('option');
            option.value = index; // Use index as value to easily retrieve price
            option.textContent = service.name;
            serviceSelect.appendChild(option);
        });
    }

    function updateUnitDisplay() {
        const selectedIndex = serviceSelect.value;
        if (selectedIndex !== '') {
            unitDisplay.textContent = servicePrices[selectedIndex].unit;
        } else {
            unitDisplay.textContent = '';
        }
        resetInstallationResults(); // Reset results when service changes
    }

    function calculateInstallationCost() {
        const selectedIndex = serviceSelect.value;
        const quantity = parseFloat(quantityInput.value);

        if (selectedIndex === '' || isNaN(quantity) || quantity < 0) {
            alert('กรุณาเลือกรายการบริการและระบุจำนวนให้ถูกต้อง');
            resetInstallationResults();
            return;
        }

        const selectedService = servicePrices[selectedIndex];
        const totalCost = selectedService.price * quantity;

        displayService.textContent = selectedService.name;
        displayQuantity.textContent = `${quantity.toFixed(2)} ${selectedService.unit}`;
        displayUnitPrice.textContent = selectedService.price.toFixed(2);
        totalInstallationCost.textContent = totalCost.toFixed(2);
    }

    function resetInstallationResults() {
        displayService.textContent = 'N/A';
        displayQuantity.textContent = 'N/A';
        displayUnitPrice.textContent = '0.00';
        totalInstallationCost.textContent = '0.00';
    }

    // Event Listeners
    serviceSelect.addEventListener('change', updateUnitDisplay);
    calculateInstallationBtn.addEventListener('click', calculateInstallationCost);
    quantityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateInstallationCost();
        }
    });

    // Initial setup
    populateServiceOptions();
    updateUnitDisplay(); // Set initial unit display
    resetInstallationResults(); // Ensure results are reset on load
});
