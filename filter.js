// Function to show car details
    function showDetails(carType) {
        alert("Showing details for " + carType);
    }

    // Function to filter cars based on selected options
    function filterCars() {
        // Get selected filters
        let selectedVehicleTypes = [];
        let selectedBrands = [];
        let selectedPriceRanges = [];

        // Capture the vehicle types
        document.querySelectorAll('.filter-group:nth-child(1) input:checked').forEach(function (checkbox) {
            selectedVehicleTypes.push(checkbox.nextElementSibling.textContent.trim());
        });

        // Capture the brands
        document.querySelectorAll('.filter-group:nth-child(2) input:checked').forEach(function (checkbox) {
            selectedBrands.push(checkbox.nextElementSibling.textContent.trim());
        });

        // Capture the price ranges
        document.querySelectorAll('.filter-group:nth-child(3) input:checked').forEach(function (checkbox) {
            selectedPriceRanges.push(checkbox.nextElementSibling.textContent.trim());
        });

        // Filter the cars based on selected filters
        const allCars = document.querySelectorAll('.car-card');
        allCars.forEach(function (car) {
            const carType = car.querySelector('.car-spec span:nth-child(3)').textContent.trim();
            const brand = car.querySelector('.car-title').textContent.trim();
            const price = parseFloat(car.querySelector('.car-price').textContent.replace('$', '').replace(',', '').trim());

            let isMatch = true;

            // Filter by vehicle type
            if (selectedVehicleTypes.length > 0 && !selectedVehicleTypes.includes(carType)) {
                isMatch = false;
            }

            // Filter by brand
            if (selectedBrands.length > 0 && !selectedBrands.includes(brand)) {
                isMatch = false;
            }

            // Filter by price range
            if (selectedPriceRanges.length > 0) {
                let priceRangeMatch = false;
                selectedPriceRanges.forEach(function (range) {
                    if (range === 'Under $50,000' && price < 50000) priceRangeMatch = true;
                    if (range === '$50,000 - $100,000' && price >= 50000 && price <= 100000) priceRangeMatch = true;
                    if (range === '$100,000+' && price > 100000) priceRangeMatch = true;
                });
                if (!priceRangeMatch) isMatch = false;
            }

            // Show or hide the car based on the filter
            if (isMatch) {
                car.style.display = 'block';
            } else {
                car.style.display = 'none';
            }
        });
    }
