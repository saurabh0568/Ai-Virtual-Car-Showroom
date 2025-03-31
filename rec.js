// Display cars on page load
const carContainer = document.getElementById("carContainer");
const carDetails = document.getElementById("carDetails");

// Render car items
function loadCars() {
    cars.forEach(car => {
        const carDiv = document.createElement("div");
        carDiv.classList.add("car");
        carDiv.innerHTML = `
            <h3>${car.name}</h3>
            <p>Brand: ${car.brand}</p>
            <p>Budget: ${car.budget}</p>
        `;
        carDiv.addEventListener("click", () => displayDetails(car));
        carContainer.appendChild(carDiv);
    });
}

// Display car details and recommendations
function displayDetails(car) {
    // Show selected car details
    carDetails.innerHTML = `
        <h2>${car.name}</h2>
        <p><strong>Brand:</strong> ${car.brand}</p>
        <p><strong>Budget:</strong> ${car.budget}</p>
        <p>${car.description}</p>
        <div class="recommendations">
            <h3>Similar Recommendations</h3>
            <div id="recommendations"></div>
        </div>
    `;

    // Filter and display recommendations
    const recommendations = document.getElementById("recommendations");
    recommendations.innerHTML = "";

    const similarCars = cars.filter(c => c.brand === car.brand || c.budget === car.budget && c.id !== car.id);

    similarCars.forEach(similarCar => {
        const recDiv = document.createElement("div");
        recDiv.classList.add("car");
        recDiv.innerHTML = `
            <h4>${similarCar.name}</h4>
            <p>Brand: ${similarCar.brand}</p>
            <p>Budget: ${similarCar.budget}</p>
        `;
        recDiv.addEventListener("click", () => displayDetails(similarCar));
        recommendations.appendChild(recDiv);
    });
}

// Load cars on page load
window.onload = loadCars;
