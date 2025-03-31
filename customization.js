const selectedOptions = {};
        
// Update selection tags
function updateSelectionTags() {
    const selectionTags = document.getElementById('selection-tags');
    
    if (Object.keys(selectedOptions).length === 0) {
        selectionTags.innerHTML = `<div class="selection-tag"><i class="fas fa-info-circle"></i> Select options to begin</div>`;
        return;
    }
    
    let tagsHTML = '';
    for (const [category, value] of Object.entries(selectedOptions)) {
        const formattedCategory = category.replace(/_/g, ' ');
        tagsHTML += `<div class="selection-tag"><i class="fas fa-check-circle"></i> ${formattedCategory}: ${value}</div>`;
    }
    
    selectionTags.innerHTML = tagsHTML;
}

// Add click event listeners to options
document.querySelectorAll(".category").forEach(category => {
    const categoryName = category.getAttribute("data-category");

    category.querySelectorAll(".option").forEach(option => {
        option.addEventListener("click", () => {
            // Remove selection from all options in this category
            category.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
            
            // Mark the clicked option as selected
            option.classList.add("selected");
            
            // Store selected value
            selectedOptions[categoryName] = option.getAttribute("data-value");
            
            // Update selection tags
            updateSelectionTags();
        });
    });
});

// Add click event listener to predict button
document.getElementById("predictButton").addEventListener("click", async () => {
    // Check if all required options are selected
    const requiredCategories = [
        "Car_Brand", "Model", "Engine_Type", "Driving_Condition", 
        "Road_Type", "Weather_Condition", "Driver_Experience"
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
        const predictButton = document.getElementById("predictButton");
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
        
        // Display results
        document.getElementById("fuel-efficiency").textContent = result.Fuel_Efficiency;
        document.getElementById("safety-rating").textContent = result.Safety_Rating;
        document.getElementById("price").textContent = `$${result.Price}`;
        document.getElementById("comfort-rating").textContent = result.Comfort_Rating;
        
        // Show results container
        document.getElementById("result-container").style.display = "block";
        
        // Scroll to results
        document.getElementById("result-container").scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message || "Failed to get prediction. Please try again later."}`);
    } finally {
        // Reset button state
        predictButton.innerHTML = originalButtonText;
        predictButton.disabled = false;
    }
});
