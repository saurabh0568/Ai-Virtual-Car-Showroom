 let allCars = [];
        let filteredCars = [];
        const makes = ["Audi", "BMW", "Chevrolet", "Ford", "Honda", "Hyundai", "Mercedes-Benz", "Nissan", "Toyota", "Volkswagen"];
        
        // Normalize object keys to lowercase
        const normalize = obj => {
            const result = {};
            for (const key in obj) {
                result[key.toLowerCase()] = obj[key];
            }
            return result;
        };
        
        // Fetch car data from Flask API
        async function fetchCars() {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/cars');
                const data = await response.json();
                
                if (!data.cars || data.cars.length === 0) {
                    document.getElementById('car-groups').innerHTML = '<div class="error-message">No car data found.</div>';
                    return;
                }
                
                // Store normalized data
                allCars = data.cars.map(normalize);
                filteredCars = [...allCars];
                
                // Update stats
                document.getElementById('car-count').textContent = allCars.length;
                document.getElementById('brand-count').textContent = makes.filter(make => 
                    allCars.some(car => (car.make || '').toLowerCase() === make.toLowerCase())
                ).length;
                
                // Populate filters
                populateFilters();
                
                // Display cars
                displayCars(filteredCars);
            } catch (err) {
                console.error('Fetch error:', err);
                document.getElementById('car-groups').innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Failed to load car data. Please try again later.</div>';
            }
        }
        
        // Populate filter options dynamically
        function populateFilters() {
            // Collect unique values
            const types = [...new Set(allCars.map(car => car.type || car.bodytype || '').filter(Boolean))];
            const years = [...new Set(allCars.map(car => car.year || '').filter(Boolean))];
            
            // Populate vehicle type filters
            const typeFiltersContainer = document.getElementById('type-filters');
            typeFiltersContainer.innerHTML = '';
            
            types.forEach(type => {
                const label = document.createElement('label');
                label.className = 'filter-option';
                label.innerHTML = `
                    <input type="checkbox" value="${type}"> ${type}
                `;
                typeFiltersContainer.appendChild(label);
            });
            
            // Populate make filters
            const makeFiltersContainer = document.getElementById('make-filters');
            makeFiltersContainer.innerHTML = '';
            
            makes.forEach(make => {
                const count = allCars.filter(car => 
                    (car.make || '').toLowerCase() === make.toLowerCase()
                ).length;
                
                if (count > 0) {
                    const label = document.createElement('label');
                    label.className = 'filter-option';
                    label.innerHTML = `
                        <input type="checkbox" value="${make}"> ${make} (${count})
                    `;
                    makeFiltersContainer.appendChild(label);
                }
            });
        }
        
        // Display cars grouped by make
        function displayCars(cars) {
            const container = document.getElementById('car-groups');
            container.innerHTML = '';
            
            if (cars.length === 0) {
                container.innerHTML = '<div class="error-message"><i class="fas fa-search"></i> No cars match your filter criteria.</div>';
                return;
            }
            
            // Group cars by make
            makes.forEach(make => {
                const group = cars.filter(car => 
                    (car.make || '').toLowerCase() === make.toLowerCase()
                );
                
                if (group.length > 0) {
                    // Create make header
                    const header = document.createElement('div');
                    header.className = 'make-header';
                    header.innerHTML = `<i class="fas fa-car"></i> ${make} <span class="car-count">${group.length} vehicles</span>`;
                    container.appendChild(header);
                    
                    // Create card container
                    const cardGroup = document.createElement('div');
                    cardGroup.className = 'card-container';
                    
                    // Create cards for each car
                    group.forEach(car => {
                        const isFeatured = Math.random() > 0.7; // Randomly mark some cars as featured
                        
                        const card = document.createElement('div');
                        card.className = 'car-card';
                        
                        let cardContent = `
                            <div class="car-image">
                                <img src="/api/placeholder/400/200" alt="${car.make} ${car.model}">
                                ${isFeatured ? '<span class="car-badge">Featured</span>' : ''}
                                <div class="image-overlay">
                                    <button class="overlay-btn"><i class="far fa-eye"></i> Quick View</button>
                                </div>
                            </div>
                            <div class="car-details">
                                <h3 class="car-title">${car.model || 'Unknown Model'} <span class="car-year">${car.year || 'N/A'}</span></h3>
                                
                                <div class="car-specs">
                                    ${car.type ? `<span class="car-spec"><i class="fas fa-car"></i> ${car.type}</span>` : ''}
                                    ${car.fuel ? `<span class="car-spec"><i class="fas fa-gas-pump"></i> ${car.fuel}</span>` : ''}
                                    ${car.transmission ? `<span class="car-spec"><i class="fas fa-cog"></i> ${car.transmission}</span>` : ''}
                                </div>
                        `;
                        
                        // Add car details - limit to important ones
                        const importantKeys = ['engine', 'mileage', 'color', 'doors'];
                        const detailsList = document.createElement('ul');
                        detailsList.className = 'car-details-list';
                        
                        importantKeys.forEach(key => {
                            if (car[key]) {
                                const li = document.createElement('li');
                                li.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> <span>${car[key]}</span>`;
                                detailsList.appendChild(li);
                            }
                        });
                        
                        cardContent += detailsList.outerHTML;
                        
                        // Add price and action buttons
                        cardContent += `
                                <div class="car-price">$${(car.price || Math.floor(Math.random() * 50000 + 30000)).toLocaleString()}</div>
                                
                                <div class="car-actions">
                                    <button class="btn btn-primary" onclick="viewDetails('${car.make} ${car.model}')"><i class="far fa-eye"></i> View Details</button>
                                    <button class="btn btn-outline"><i class="fas fa-calendar-alt"></i> Test Drive</button>
                                </div>
                                <div class="car-quick-actions">
                                    <button title="Add to Compare"><i class="fas fa-exchange-alt"></i> Compare</button>
                                    <button title="Add to Wishlist"><i class="far fa-heart"></i></button>
                                    <button title="Add to Favorites"><i class="far fa-star"></i></button>
                                </div>
                            </div>
                        `;
                        
                        card.innerHTML = cardContent;
                        cardGroup.appendChild(card);
                    });
                    
                    container.appendChild(cardGroup);
                }
            });
        }
        
        // Apply filters
        function applyFilters() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            
            // Get checked filters
            const selectedTypes = [...document.querySelectorAll('#type-filters input:checked')].map(el => el.value);
            const selectedMakes = [...document.querySelectorAll('#make-filters input:checked')].map(el => el.value);
            const selectedYearRanges = [...document.querySelectorAll('#year-filters input:checked')].map(el => el.value);
            const selectedPriceRanges = [...document.querySelectorAll('#price-filters input:checked')].map(el => el.value);
            
            // Filter cars
            filteredCars = allCars.filter(car => {
                // Search filter
                if (searchTerm && !Object.values(car).some(value => 
                    String(value).toLowerCase().includes(searchTerm)
                )) {
                    return false;
                }
                
                // Type filter
                if (selectedTypes.length > 0) {
                    const carType = car.type || car.bodytype || '';
                    if (!selectedTypes.includes(carType)) {
                        return false;
                    }
                }
                
                // Make filter
                if (selectedMakes.length > 0) {
                    if (!selectedMakes.includes(car.make)) {
                        return false;
                    }
                }
                
                // Year filter
                if (selectedYearRanges.length > 0) {
                    const carYear = parseInt(car.year || '0');
                    if (!selectedYearRanges.some(range => {
                        const [min, max] = range.split('-').map(Number);
                        return carYear >= min && (max ? carYear <= max : true);
                    })) {
                        return false;
                    }
                }
                
                // Price filter
                if (selectedPriceRanges.length > 0) {
                    const carPrice = parseFloat(car.price || '0');
                    if (!selectedPriceRanges.some(range => {
                        const [min, max] = range.split('-').map(Number);
                        return carPrice >= min && (max ? carPrice <= max : true);
                    })) {
                        return false;
                    }
                }
                
                return true;
            });
            
            // Display filtered cars
            displayCars(filteredCars);
        }
        
        // Clear all filters
        function clearFilters() {
            // Clear checkboxes
            document.querySelectorAll('input[type="checkbox"]').forEach(el => {
                el.checked = false;
            });
            
            // Clear search
            document.getElementById('search-input').value = '';
            
            // Reset filtered cars
            filteredCars = [...allCars];
            
            // Display all cars
            displayCars(filteredCars);
        }
        
        // View car details (placeholder function)
        function viewDetails(carName) {
            alert(`Viewing details for ${carName}`);
            // This would normally redirect to a details page or open a modal
        }
        
        // Add event listeners
        document.addEventListener('DOMContentLoaded', () => {
            fetchCars();
            
            document.getElementById('search-input').addEventListener('input', applyFilters);
            document.getElementById('apply-filters').addEventListener('click', applyFilters);
            document.getElementById('clear-filters').addEventListener('click', clearFilters);
        });
