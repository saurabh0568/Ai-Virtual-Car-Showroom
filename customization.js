// Initialize variables
let selectedOptions = {};
const carModels = {
    "Ford": ["Mustang", "F-150"],
    "BMW": ["3 Series", "X5"],
    "Mercedes": ["E-Class", "GLE"],
    "Tesla": ["Model 3", "Model S"],
    "Toyota": ["Camry", "Corolla"],
    "Hyundai": ["Sonata", "Kona EV"]
};

// Map for car images (in a real app these would be actual image paths)
const carImages = {
    "Ford_Mustang":"/images/Mustang.png",
    "Ford_F-150": "/images/F-150.png",
    "BMW_3 Series": "/images/3 Series.png",
    "BMW_X5": "/images/X5.png",
    "Mercedes_E-Class": "/images/E-Class.png",
    "Mercedes_GLE": "/images/GLE.png",
    "Tesla_Model 3": "/images/Model 3.png",
    "Tesla_Model S": "/images/Model S.png",
    "Toyota_Camry": "/images/Camry.png",
    "Toyota_Corolla": "/images/Corolla.png",
    "Hyundai_Sonata": "/images/Sonata.png",
    "Hyundai_Kona EV": "/images/Kona EV.png"
};

// DOM elements
const allOptions = document.querySelectorAll('.option');
const modelOptionsContainer = document.getElementById('model-options');
const selectionTagsContainer = document.getElementById('selection-tags');
const carImage = document.getElementById('car-image');
const carBadge = document.getElementById('car-badge');
const predictButton = document.getElementById('predictButton');
const resetButton = document.getElementById('resetButton');
const resultContainer = document.getElementById('result-container');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializeListeners();
});

// Set up event listeners
function initializeListeners() {
    // Add click listeners to all option buttons
    allOptions.forEach(option => {
        option.addEventListener('click', () => {
            handleOptionSelection(option);
        });
    });

    // Add click listener to predict button
    predictButton.addEventListener('click', generatePrediction);

    // Add click listener to reset button
    resetButton.addEventListener('click', resetSelections);
}

// Handle option selection
function handleOptionSelection(option) {
    const category = option.parentElement.parentElement.dataset.category;
    const value = option.dataset.value;

    // If clicking on already selected option, deselect it
    if (option.classList.contains('selected')) {
        option.classList.remove('selected');
        delete selectedOptions[category];
        
        // If deselecting car brand, also reset model
        if (category === 'Car_Brand') {
            delete selectedOptions['Model'];
            updateModelOptions(null);
        }
    } else {
        // Deselect any other option in this category
        option.parentElement.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select this option
        option.classList.add('selected');
        selectedOptions[category] = value;
        
        // Special handling for Car_Brand to update available models
        if (category === 'Car_Brand') {
            updateModelOptions(value);
        }
        
        // Special handling for Model to update car image
        if (category === 'Model' && selectedOptions['Car_Brand']) {
            updateCarImage(selectedOptions['Car_Brand'], value);
        }
    }
    
    // Update selection tags
    updateSelectionTags();
}

// Update model options based on selected car brand
function updateModelOptions(brand) {
    // Clear existing model selection if any
    document.querySelectorAll('.category[data-category="Model"] .option.selected').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Clear the model options container
    modelOptionsContainer.innerHTML = '';
    
    if (!brand) {
        modelOptionsContainer.innerHTML = '<div class="placeholder-message">Please select a car brand first</div>';
        return;
    }
    
    // Add model options for the selected brand
    carModels[brand].forEach(model => {
        const modelOption = document.createElement('div');
        modelOption.className = 'option';
        modelOption.dataset.value = model;
        modelOption.innerHTML = `
            <img src="/api/placeholder/40/40" alt="${model}">
            <span>${model}</span>
        `;
        
        // Add click event
        modelOption.addEventListener('click', () => {
            handleOptionSelection(modelOption);
        });
        
        modelOptionsContainer.appendChild(modelOption);
    });
}

// Update car image when both brand and model are selected
function updateCarImage(brand, model) {
    const imageKey = `${brand}_${model}`;
    if (carImages[imageKey]) {
        carImage.src = carImages[imageKey];
        carBadge.textContent = `${brand} ${model}`;
    }
}

// Update selection tags
function updateSelectionTags() {
    selectionTagsContainer.innerHTML = '';
    
    if (Object.keys(selectedOptions).length === 0) {
        selectionTagsContainer.innerHTML = '<div class="selection-tag"><i class="fas fa-info-circle"></i> Select options to begin</div>';
        return;
    }
    
    // Create tags for each selection
    for (const [category, value] of Object.entries(selectedOptions)) {
        const tag = document.createElement('div');
        tag.className = 'selection-tag';
        
        // Choose appropriate icon based on category
        let icon = 'fa-check';
        switch(category) {
            case 'Car_Brand': icon = 'fa-copyright'; break;
            case 'Model': icon = 'fa-tag'; break;
            case 'Engine_Type': icon = 'fa-cogs'; break;
            case 'Driving_Condition': icon = 'fa-road'; break;
            case 'Rim_Wheel_Size': icon = 'fa-circle'; break;
            case 'Rim_Wheel_Style': icon = 'fa-cog'; break;
            case 'Rim_Wheel_Material': icon = 'fa-tools'; break;
            case 'Power_Upgrade': icon = 'fa-bolt'; break;
            case 'Turbo_Supercharger': icon = 'fa-tachometer-alt'; break;
            case 'Weather_Condition': icon = 'fa-cloud-sun-rain'; break;
            case 'Driver_Experience': icon = 'fa-user-alt'; break;
        }
        
        tag.innerHTML = `<i class="fas ${icon}"></i> ${category.replace(/_/g, ' ')}: <strong>${value}</strong>`;
        selectionTagsContainer.appendChild(tag);
    }
}

// Generate prediction
async function generatePrediction() {
    // Check if all required options are selected
    const requiredCategories = [
        "Car_Brand", "Model", "Engine_Type", "Driving_Condition", 
        "Rim_Wheel_Size", "Rim_Wheel_Style", "Rim_Wheel_Material",
        "Power_Upgrade", "Turbo_Supercharger", "Weather_Condition", 
        "Driver_Experience"
    ];
    
    const missingCategories = requiredCategories.filter(
        category => !selectedOptions[category]
    );
    
    if (missingCategories.length > 0) {
        alert(`Please select options for: ${missingCategories.map(cat => cat.replace(/_/g, ' ')).join(', ')}`);
        return;
    }
    
    try {
        // Show loading state
        const originalButtonText = predictButton.innerHTML;
        predictButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Predicting...';
        predictButton.disabled = true;
        
        // Make API request
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedOptions)
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        // Update the result container with additional fields
        document.getElementById("fuel-efficiency").textContent = result.Fuel_Efficiency;
        document.getElementById("safety-rating").textContent = result.Safety_Rating;
        document.getElementById("price").textContent = `₹${result.Price_IR}`;
        document.getElementById("comfort-rating").textContent = result.Comfort_Rating;
        
        // Add new result items for the additional metrics if they don't exist
        const resultGrid = document.querySelector('.result-grid');
        
        // Check if Engine Performance element exists
        if (!document.getElementById("engine-performance")) {
            const enginePerfDiv = document.createElement('div');
            enginePerfDiv.className = 'result-item';
            enginePerfDiv.innerHTML = `
                <div class="label">Engine Performance</div>
                <div id="engine-performance" class="value">${result.Engine_Performance}</div>
                <div class="unit">HP</div>
            `;
            resultGrid.appendChild(enginePerfDiv);
        } else {
            document.getElementById("engine-performance").textContent = result.Engine_Performance;
        }
        
        // Check if Suspension Performance element exists
        if (!document.getElementById("suspension-performance")) {
            const suspensionPerfDiv = document.createElement('div');
            suspensionPerfDiv.className = 'result-item';
            suspensionPerfDiv.innerHTML = `
                <div class="label">Suspension Performance</div>
                <div id="suspension-performance" class="value">${result.Suspension_Performance}</div>
                <div class="unit">rating</div>
            `;
            resultGrid.appendChild(suspensionPerfDiv);
        } else {
            document.getElementById("suspension-performance").textContent = result.Suspension_Performance;
        }
        
        // Show results container with animation
        resultContainer.style.display = "block";
        
        // Scroll to results
        resultContainer.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message || "Failed to get prediction. Please try again later."}`);
    } finally {
        // Restore button state
        predictButton.innerHTML = '<i class="fas fa-calculator"></i> Generate Prediction';
        predictButton.disabled = false;
    }
}

// Reset all selections
function resetSelections() {
    // Clear all selected options
    allOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Reset model options
    updateModelOptions(null);
    
    // Clear selected options object
    selectedOptions = {};
    
    // Reset selection tags
    updateSelectionTags();
    
    // Reset car image
    carImage.src = "/api/placeholder/400/250";
    carBadge.textContent = "Select a model";
    
    // Hide results if visible
    resultContainer.style.display = "none";
}

function changeCarImage() {
    const model = document.getElementById("car-model-selector").value;
    const carImage = document.getElementById("car-image");
    const badge = document.getElementById("car-badge");

    if (model) {
        carImage.src = `images/${model}.png`; // Update with your actual image folder path
        badge.textContent = model;
    } else {
        carImage.src = "car_cover.png";
        badge.textContent = "Select a model";
    }
}