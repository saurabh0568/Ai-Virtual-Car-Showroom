const socket = io('http://localhost:5500');
let roomId = '';
let isSyncing = false;
let manualScrollTimeout = null;
let targetScrollY = 0;
let animationFrame;

function joinRoom() {
    const input = document.getElementById('roomIdInput');
    roomId = input.value.trim();
    if (roomId !== "") {
        socket.emit('join-room', roomId);
        document.getElementById('joinBox').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    } else {
        alert('Please enter a Room ID');
    }
}

// --- CHAT SYSTEM ---
document.getElementById('send-chat').addEventListener('click', () => {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message !== '') {
        socket.emit('chat-message', { room: roomId, message });
        input.value = '';
    }
});

socket.on('chat-message', (data) => {
    const messagesDiv = document.getElementById('chat-messages');
    const newMsg = document.createElement('div');
    newMsg.textContent = data.message;
    messagesDiv.appendChild(newMsg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// --- SCROLL SYNC SYSTEM ---
window.addEventListener('scroll', () => {
    if (!isSyncing) {
        socket.emit('scroll-sync', { room: roomId, scroll: window.scrollY });
    }
    clearTimeout(manualScrollTimeout);
    manualScrollTimeout = setTimeout(() => {
        isSyncing = false;
    }, 100);
});

socket.on('scroll-sync', (data) => {
    isSyncing = true;
    targetScrollY = data.scroll;
    animateScroll();
});

function animateScroll() {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        const distance = targetScrollY - currentScroll;
        if (Math.abs(distance) > 1) {
            window.scrollTo(0, currentScroll + distance * 0.2); // smooth movement
            animateScroll(); // keep animating until close
        } else {
            window.scrollTo(0, targetScrollY); // final snap
        }
    });
}
// Car data array with 21 cars
const carData = [
    {
        make: "BMW",
        model: "7 Series",
        year: 2022,
        type: "Sedan",
        fuel: "Electric",
        transmission: "Automatic",
        seats: 5,
        price: 3797359,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Hyundai",
        model: "Kona",
        year: 2019,
        type: "SUV",
        fuel: "Electric",
        transmission: "Automatic",
        seats: 4,
        price: 2461345,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Honda",
        model: "Civic",
        year: 2021,
        type: "Sedan",
        fuel: "Petrol",
        transmission: "Automatic",
        seats: 6,
        price: 5952043,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Nissan",
        model: "Altima",
        year: 2020,
        type: "Sedan",
        fuel: "Electric",
        transmission: "Automatic",
        seats: 6,
        price: 1950000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Nissan",
        model: "Sentra",
        year: 2019,
        type: "Sedan",
        fuel: "Petrol",
        transmission: "Automatic",
        seats: 5,
        price: 1750000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Ford",
        model: "F-150",
        year: 2020,
        type: "SUV",
        fuel: "Electric",
        transmission: "Manual",
        seats: 6,
        price: 3550000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Toyota",
        model: "Camry",
        year: 2022,
        type: "Sedan",
        fuel: "Hybrid",
        transmission: "Automatic",
        seats: 5,
        price: 2850000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Mercedes-Benz",
        model: "E-Class",
        year: 2021,
        type: "Sedan",
        fuel: "Diesel",
        transmission: "Automatic",
        seats: 5,
        price: 6750000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Audi",
        model: "Q5",
        year: 2022,
        type: "SUV",
        fuel: "Petrol",
        transmission: "Automatic",
        seats: 5,
        price: 5450000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Chevrolet",
        model: "Malibu",
        year: 2020,
        type: "Sedan",
        fuel: "Petrol",
        transmission: "Automatic",
        seats: 5,
        price: 1950000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Volkswagen",
        model: "Tiguan",
        year: 2021,
        type: "SUV",
        fuel: "Diesel",
        transmission: "Automatic",
        seats: 7,
        price: 3250000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Hyundai",
        model: "Tucson",
        year: 2022,
        type: "SUV",
        fuel: "Hybrid",
        transmission: "Automatic",
        seats: 5,
        price: 2950000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Toyota",
        model: "Corolla",
        year: 2021,
        type: "Sedan",
        fuel: "Petrol",
        transmission: "Automatic",
        seats: 5,
        price: 1850000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "BMW",
        model: "X5",
        year: 2022,
        type: "SUV",
        fuel: "Electric",
        transmission: "Automatic",
        seats: 7,
        price: 7950000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Honda",
        model: "CR-V",
        year: 2021,
        type: "SUV",
        fuel: "Petrol",
        transmission: "Automatic",
        seats: 5,
        price: 3150000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Ford",
        model: "Mustang",
        year: 2022,
        type: "Coupe",
        fuel: "Petrol",
        transmission: "Manual",
        seats: 4,
        price: 4950000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Mercedes-Benz",
        model: "S-Class",
        year: 2023,
        type: "Sedan",
        fuel: "Electric",
        transmission: "Automatic",
        seats: 5,
        price: 12950000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Audi",
        model: "A4",
        year: 2021,
        type: "Sedan",
        fuel: "Petrol",
        transmission: "Automatic",
        seats: 5,
        price: 4250000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Toyota",
        model: "RAV4",
        year: 2022,
        type: "SUV",
        fuel: "Hybrid",
        transmission: "Automatic",
        seats: 5,
        price: 3350000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Chevrolet",
        model: "Corvette",
        year: 2022,
        type: "Convertible",
        fuel: "Petrol",
        transmission: "Manual",
        seats: 2,
        price: 8950000,
        image: "/api/placeholder/400/250"
    },
    {
        make: "Volkswagen",
        model: "Golf",
        year: 2021,
        type: "Hatchback",
        fuel: "Petrol",
        transmission: "Manual",
        seats: 5,
        price: 2550000,
        image: "/api/placeholder/400/250"
    }
];

// Function to format price with commas
function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

// Function to create car cards
function createCarCards() {
    const carGroupsContainer = document.getElementById('car-groups');
    
    // Clear loading message
    carGroupsContainer.innerHTML = '';

    carGroupsContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    
    // Loop through car data and create cards
    carData.forEach((car, index) => {
        // Create card element
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); height: 100%; display: flex; flex-direction: column;">
                <div style="height: 200px; overflow: hidden;">
                    <img src="${car.image}" alt="${car.make} ${car.model}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h3 style="margin: 0; font-size: 18px; color: #0a1429;">${car.make} ${car.model}</h3>
                        <span style="color: #777; font-size: 14px;">${car.year}</span>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0;">
                        <span style="display: flex; align-items: center; font-size: 14px; color: #555;">
                            <i class="fas fa-car-side" style="margin-right: 5px; color: #1a4b8c;"></i> ${car.type}
                        </span>
                        <span style="display: flex; align-items: center; font-size: 14px; color: #555;">
                            <i class="fas fa-gas-pump" style="margin-right: 5px; color: #1a4b8c;"></i> ${car.fuel}
                        </span>
                        <span style="display: flex; align-items: center; font-size: 14px; color: #555;">
                            <i class="fas fa-cog" style="margin-right: 5px; color: #1a4b8c;"></i> ${car.transmission}
                        </span>
                        <span style="display: flex; align-items: center; font-size: 14px; color: #555;">
                            <i class="fas fa-chair" style="margin-right: 5px; color: #1a4b8c;"></i> ${car.seats} Seats
                        </span>
                    </div>
                    <div style="margin-top: auto;">
                        <h4 style="font-size: 20px; margin: 15px 0 10px; color: #1a4b8c;">${formatPrice(car.price)}</h4>
                        <div style="display: flex; justify-content: space-between;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" class="compare-checkbox" style="margin-right: 5px;"> Compare
                            </label>
                            <button class="wishlist-btn" style="background: none; border: none; cursor: pointer; color: #777;">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        carGroupsContainer.appendChild(carCard);
    });
    
    // Update counters
    document.getElementById('car-count').textContent = carData.length;
    
    // Count unique brands
    const uniqueBrands = new Set(carData.map(car => car.make));
    document.getElementById('brand-count').textContent = uniqueBrands.size;
    
    // Set up event listeners for wishlist buttons
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#e74c3c';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '#777';
            }
        });
    });
    
    // Set up compare functionality
    const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
    compareCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('.compare-checkbox:checked');
            if (checkedBoxes.length > 3 && this.checked) {
                alert('You can compare up to 3 cars at a time.');
                this.checked = false;
            }
        });
    });
}

// Set up filter functionality
document.getElementById('apply-filters').addEventListener('click', function() {
    // This would normally filter the cars based on selected criteria
    // For now, we'll just reload all cars
    createCarCards();
});

document.getElementById('clear-filters').addEventListener('click', function() {
    // Clear all checkboxes
    const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reload all cars
    createCarCards();
});

// Search functionality
document.getElementById('search-input').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    if (searchTerm === '') {
        createCarCards(); // Reset to show all cars
        return;
    }
    
    // Filter cars based on search term
    const filteredCars = carData.filter(car => 
        car.make.toLowerCase().includes(searchTerm) || 
        car.model.toLowerCase().includes(searchTerm) ||
        car.type.toLowerCase().includes(searchTerm) ||
        car.fuel.toLowerCase().includes(searchTerm)
    );
    
    // Update display with filtered cars
    const carGroupsContainer = document.getElementById('car-groups');
    carGroupsContainer.innerHTML = '';
    
    if (filteredCars.length === 0) {
        carGroupsContainer.innerHTML = '<div class="no-results">No cars found matching your search.</div>';
        document.getElementById('car-count').textContent = 0;
    } else {
        filteredCars.forEach(car => {
            // Create card element (same as in createCarCards function)
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            carCard.innerHTML = `
                <div style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); height: 100%; display: flex; flex-direction: column;">
                    <div style="height: 200px; overflow: hidden;">
                        <img src="${car.image}" alt="${car.make} ${car.model}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h3 style="margin: 0; font-size: 18px; color: #0a1429;">${car.make} ${car.model}</h3>
                            <span style="color: #777; font-size: 14px;">${car.year}</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0;">
                            <span style="display: flex; align-items: center; font-size: 14px; color: #555;">
                                <i class="fas fa-car-side" style="margin-right: 5px; color: #1a4b8c;"></i> ${car.type}
                            </span>
                            <span style="display: flex; align-items: center; font-size: 14px; color: #555;">
                                <i class="fas fa-gas-pump" style="margin-right: 5px; color: #1a4b8c;"></i> ${car.fuel}
                            </span>
                            <span style="display: flex; align-items: center; font-size: 14px; color: #555;">
                                <i class="fas fa-cog" style="margin-right: 5px; color: #1a4b8c;"></i> ${car.transmission}
                            </span>
                            <span style="display: flex; align-items: center; font-size: 14px; color: #555;">
                                <i class="fas fa-chair" style="margin-right: 5px; color: #1a4b8c;"></i> ${car.seats} Seats
                            </span>
                        </div>
                        <div style="margin-top: auto;">
                            <h4 style="font-size: 20px; margin: 15px 0 10px; color: #1a4b8c;">${formatPrice(car.price)}</h4>
                            <div style="display: flex; justify-content: space-between;">
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="checkbox" class="compare-checkbox" style="margin-right: 5px;"> Compare
                                </label>
                                <button class="wishlist-btn" style="background: none; border: none; cursor: pointer; color: #777;">
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            carGroupsContainer.appendChild(carCard);
        });
        
        document.getElementById('car-count').textContent = filteredCars.length;
    }
});

// Add Font Awesome
if (!document.getElementById('fontawesome-css')) {
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.id = 'fontawesome-css';
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);
}

// Add some additional CSS for car cards
const style = document.createElement('style');
style.textContent = `
    .car-card {
        margin-bottom: 25px;
    }
    
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px;
        font-size: 18px;
        color: #777;
    }
    
    .wishlist-btn .fas.fa-heart {
        color: #e74c3c;
    }
`;
document.head.appendChild(style);

// Initialize car cards when DOM content is loaded
document.addEventListener('DOMContentLoaded', createCarCards);