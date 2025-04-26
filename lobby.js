var socket = io();
var currentRoom = null;

// Join a room for real-time collaboration
function joinRoom() {
    let room = document.getElementById("roomInput").value;
    if (room) {
        socket.emit("join_room", { room: room });
        currentRoom = room;
    }
}

// Leave a room
function leaveRoom() {
    if (currentRoom) {
        socket.emit("leave_room", { room: currentRoom });
        currentRoom = null;
    }
}

// Select a car and notify others
function selectCar(carId) {
    document.querySelectorAll(".car-item").forEach(car => car.classList.remove("selected"));
    document.getElementById(carId).classList.add("selected");

    // Emit selection event
    if (currentRoom) {
        socket.emit("sync_action", { room: currentRoom, action: "select_car", value: carId });
    }
}

// Listen for car selection updates
socket.on("sync_action", (data) => {
    if (data.action === "select_car") {
        document.querySelectorAll(".car-item").forEach(car => car.classList.remove("selected"));
        document.getElementById(data.value).classList.add("selected");
    }
});

// Sync scrolling across all users
document.getElementById("showroom").addEventListener("scroll", (event) => {
    if (currentRoom) {
        socket.emit("sync_action", { room: currentRoom, action: "scroll", value: event.target.scrollTop });
    }
});

// Apply scrolling updates from other users
socket.on("sync_action", (data) => {
    if (data.action === "scroll") {
        document.getElementById("showroom").scrollTop = data.value;
    }
});

// Sync filter selection
document.getElementById("filterSelect").addEventListener("change", () => {
    let filterValue = document.getElementById("filterSelect").value;
    if (currentRoom) {
        socket.emit("sync_action", { room: currentRoom, action: "filter", value: filterValue });
    }
});

// Apply filter updates from other users
socket.on("sync_action", (data) => {
    if (data.action === "filter") {
        document.getElementById("filterSelect").value = data.value;
        applyFilter(data.value);
    }
});

// Apply filter function
function applyFilter(filter) {
    let cars = document.querySelectorAll(".car-item");
    cars.forEach(car => {
        if (filter === "all" || car.id.includes(filter)) {
            car.style.display = "block";
        } else {
            car.style.display = "none";
        }
    });
}
