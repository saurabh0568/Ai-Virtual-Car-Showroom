document.addEventListener("DOMContentLoaded", function () {
    const socket = io();
    let roomId = '';

    const filters = document.querySelectorAll(".filter-option input");
    const carCards = document.querySelectorAll(".car-card");
    const searchBox = document.querySelector(".search-box input");

    function applyFilters(triggeredBySocket = false) {
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

        // Emit to others only if it's not triggered by socket
        if (!triggeredBySocket && roomId) {
            socket.emit('filters-updated', { roomId, selectedFilters });
        }

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

    function applyFiltersRemotely(selectedFilters) {
        filters.forEach(filter => {
            const category = filter.closest(".filter-group").querySelector("h4").textContent.trim();
            const value = filter.nextSibling.textContent.trim();
            let shouldCheck = false;

            if (category === "Vehicle Type" && selectedFilters.vehicleType.includes(value)) shouldCheck = true;
            if (category === "Brand" && selectedFilters.brand.includes(value)) shouldCheck = true;
            if (category === "Price Range" && selectedFilters.priceRange.includes(value)) shouldCheck = true;

            filter.checked = shouldCheck;
        });

        applyFilters(true); // avoid re-emitting
    }

    filters.forEach(filter => {
        filter.addEventListener("change", () => applyFilters());
    });

    searchBox.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        carCards.forEach(card => {
            const carName = card.querySelector(".car-title").textContent.toLowerCase();
            card.style.display = carName.includes(query) ? "block" : "none";
        });
    });

    document.getElementById('messageInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && roomId) {
            const msg = e.target.value;
            socket.emit('chat-message', { roomId, user: 'You', message: msg });
            e.target.value = '';
            appendMessage('You: ' + msg);
        }
    });

    socket.on('chat-message', data => {
        appendMessage(`${data.user}: ${data.message}`);
    });

    socket.on('scroll', (scrollY) => {
        document.getElementById('mainContent').scrollTo(0, scrollY);
    });

    document.getElementById('mainContent').addEventListener('scroll', (e) => {
        if (roomId) {
            socket.emit('scroll', { roomId, scrollY: e.target.scrollTop });
        }
    });

    socket.on('filters-updated', (data) => {
        if (data && data.selectedFilters) {
            applyFiltersRemotely(data.selectedFilters);
        }
    });

    // Optional: Button click sync example
    const demoButton = document.getElementById('demoButton');
    if (demoButton) {
        demoButton.addEventListener('click', () => {
            alert("Button clicked locally");
            if (roomId) {
                socket.emit('button-clicked', { roomId, buttonId: 'demoButton' });
            }
        });

        socket.on('button-clicked', (data) => {
            if (data.buttonId === 'demoButton') {
                alert("Button clicked by someone else");
            }
        });
    }

    function appendMessage(msg) {
        const messages = document.getElementById('messages');
        const div = document.createElement('div');
        div.textContent = msg;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    window.joinRoom = function () {
        const input = document.getElementById('roomIdInput');
        if (input.value.trim() === '') {
            alert('Please enter a Room ID!');
            return;
        }

        roomId = input.value;
        socket.emit('join-room', roomId);

        document.getElementById('joinBox').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    }

    window.showDetails = function (carType) {
        alert("Showing details for " + carType);
    }

    window.chatBot = function () {
        alert("Our support team is ready to assist you. This feature will be available soon!");
    }
    window.openChatbot = function (event) {
        event.preventDefault(); // Prevent default link behavior

        if (roomId) {
            socket.emit('chatbot-opened', { roomId });
        }

        window.location.href = 'chatbot.html';
    };

    socket.on('chatbot-opened', () => {
        // Only redirect if not already on chat.html
        if (!window.location.href.includes('chatbot.html')) {
            window.location.href = 'chatbot.html';
        }
    });
    window.returnFromChat = function () {
        if (roomId) {
            socket.emit('chatbot-closed', { roomId });
        }
        window.location.href = 'index.html'; // or your main page file name
    };
    
    socket.on('chatbot-closed', () => {
        if (!window.location.href.includes('index.html')) {
            window.location.href = 'index.html'; // Sync return to main page
        }
    });
    
    window.joinRoom = function () {
        const input = document.getElementById('roomIdInput');
        if (input.value.trim() === '') {
            alert('Please enter a Room ID!');
            return;
        }
    
        roomId = input.value;
        localStorage.setItem('roomId', roomId); // store it for use in chat.html
    
        socket.emit('join-room', roomId);
        document.getElementById('joinBox').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    };
    

});
