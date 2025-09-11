document.addEventListener('DOMContentLoaded', function() {
    const serviceSelect = document.getElementById('serviceSelect');
    const quantityInput = document.getElementById('quantityInput');
    const unitDisplay = document.getElementById('unitDisplay');
    const calculateInstallationBtn = document.getElementById('calculateInstallationBtn');

    const displayService = document.getElementById('displayService');
    const displayQuantity = document.getElementById('displayQuantity');
    const displayUnitPrice = document.getElementById('displayUnitPrice');
    const totalInstallationCost = document.getElementById('totalInstallationCost');

    // รายการและราคาค่าบริการสำหรับ Non-Tiles
    const servicePrices = [
        { name: 'รื้อพื้นไม้ Laminate ,SPC พร้อมขนทิ้ง', price: 135.00, unit: 'ตรม.' },
        { name: 'ปรับพื้นสกินผิวหน้า (การปรับแต่งผิวหน้าไม่เรียบ)', price: 135.00, unit: 'ตรม.' },
        { name: 'ปรับพื้นไม่เกิน 3-5 cm. (ปูน Self เทปรับผิวหน้า)', price: 330.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง Laminate ,SPC ,กระเบื้องยางปูกาว + บัวตัวจบช่าง (บัว 2")', price: 200.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง Laminate ,SPC ,กระเบื้องยางปูกาว + บัวตัวจบช่าง (บัว 4")', price: 200.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง Laminate ,SPC (บัว WDC)', price: 200.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง SPC ลายก้างปลา + บัวตัวจบช่าง (บัว 2")', price: 250.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง กระเบื้องยางปูกาว (บัว WDC)', price: 200.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง ไม้เอ็นจิเนียร์ ปูโฟม + บัวตัวจบช่าง', price: 495.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง ไม้เอ็นจิเนียร์ ปูกาว PU + บัวตัวจบช่าง', price: 620.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง ไม้เอ็นจิเนียร์ ปูโฟม (บัว WDC)', price: 500.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง ไม้เอ็นจิเนียร์ ปูกาว PU (บัว WDC)', price: 585.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง ไม้เอ็นจิเนียร์ ปูโฟม (ไม่เอาบัว)', price: 450.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง ไม้เอ็นจิเนียร์ ปูกาว PU (ไม่เอาบัว)', price: 540.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง ไม้เอ็นจิเนียร์ ลายก้างปลา ปูกาว PU + บัวตัวจบช่าง (ดัดแปลงลิ้น)', price: 950.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง ไม้เอ็นจิเนียร์ ลายก้างปลา ปูกาว PU + (บัว WDC) (ดัดแปลงลิ้น)', price: 900.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง Water Black Engineet + บัวตัวจบช่าง', price: 270.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง Water Black Engineet + (บัว WDC)', price: 270.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง Water Black Engineet ลายก้างปลา + บัวตัวจบช่าง', price: 360.00, unit: 'ตรม.' },
        { name: 'ติดตั้ง SPC ขั้นบันได รวมตัวจบช่าง (ไม่เกิน 120 cm.) / ขั้น', price: 450.00, unit: 'ขั้น' },
        { name: 'ติดตั้ง SPC ขั้นบันได รวมตัวจบ รวมบัวช่าง PVC (ไม่เกิน 120 cm.)/1ขั้น', price: 615.00, unit: 'ขั้น' },
        { name: 'ติดตั้ง SPC ขั้นบันได รวมตัวจบ รวมบัวช่าง PVC (ไม่เกิน 120 cm.)/2 ขั้น', price: 710.00, unit: 'ขั้น' },
        { name: 'ติดตั้ง วีว่า บอร์ด,ไม้อัด (ไม่เกิน 10 มิล)', price: 615.00, unit: 'ตรม.' },
        { name: 'ค่าโพเทคพื้น (ไม่รวมอุปกรณ์)', price: 45.00, unit: 'ตรม.' },
        { name: 'ค่าโพเทคพื้น (รวมอุปกรณ์ กระดาษลูกฟูก ,เทปกาว)', price: 100.00, unit: 'ตรม.' },
        { name: 'ค่าเดินทางต่างจังหวัด กิโลละ 10 บาท (คิดขาเดียว) เริ่มนับจากคลังลำลูกกา', price: 15.00, unit: 'กม.' },
        { name: 'ค่าที่พัก /คืน', price: 1500.00, unit: 'คืน' }
    ];

    function populateServiceOptions() {
        serviceSelect.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'เลือกรายการบริการ';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        serviceSelect.appendChild(defaultOption);

        servicePrices.forEach((service, index) => {
            const option = document.createElement('option');
            option.value = index;
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
        resetInstallationResults();
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

    serviceSelect.addEventListener('change', updateUnitDisplay);
    calculateInstallationBtn.addEventListener('click', calculateInstallationCost);
    quantityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateInstallationCost();
        }
    });

    populateServiceOptions();
    updateUnitDisplay();
    resetInstallationResults();

});
