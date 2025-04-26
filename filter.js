document.addEventListener("DOMContentLoaded", function () {
    const filters = document.querySelectorAll(".filter-option input");
    const carCards = document.querySelectorAll(".car-card");
    const searchBox = document.querySelector(".search-box input");

    function applyFilters() {
        const selectedFilters = {
            vehicleType: [],
            brand: [],
            priceRange: []
        };
        
        filters.forEach(filter => {
            if (filter.checked) {
                const category = filter.closest(".filter-group").querySelector("h4").textContent.trim();
                if (category === "Vehicle Type") {
                    selectedFilters.vehicleType.push(filter.nextSibling.textContent.trim());
                } else if (category === "Brand") {
                    selectedFilters.brand.push(filter.nextSibling.textContent.trim());
                } else if (category === "Price Range") {
                    selectedFilters.priceRange.push(filter.nextSibling.textContent.trim());
                }
            }
        });

        carCards.forEach(card => {
            const carType = card.querySelector(".car-specs .car-spec:nth-child(3) span").textContent;
            const carBrand = card.querySelector(".car-title").textContent.split(" ")[0];
            const carPrice = parseInt(card.querySelector(".car-price").textContent.replace(/[^0-9]/g, ""));
            
            let showCard = true;
            
            if (selectedFilters.vehicleType.length && !selectedFilters.vehicleType.includes(carType)) {
                showCard = false;
            }
            if (selectedFilters.brand.length && !selectedFilters.brand.includes(carBrand)) {
                showCard = false;
            }
            if (selectedFilters.priceRange.length) {
                const priceFilter = selectedFilters.priceRange;
                if (priceFilter.includes("Under $50,000") && carPrice >= 50000) showCard = false;
                if (priceFilter.includes("$50,000 - $100,000") && (carPrice < 50000 || carPrice > 100000)) showCard = false;
                if (priceFilter.includes("$100,000+") && carPrice <= 100000) showCard = false;
            }
            
            card.style.display = showCard ? "block" : "none";
        });
    }

    filters.forEach(filter => {
        filter.addEventListener("change", applyFilters);
    });
    
    searchBox.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        carCards.forEach(card => {
            const carName = card.querySelector(".car-title").textContent.toLowerCase();
            card.style.display = carName.includes(query) ? "block" : "none";
        });
    });
});

function showDetails(carType) {
    alert("Showing details for " + carType);
}

function chatBot() {
    alert("Our support team is ready to assist you. This feature will be available soon!");
}