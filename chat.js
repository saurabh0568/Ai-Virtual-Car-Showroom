const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onmessage = (event) => {
        let chat = document.getElementById("chat");
        let message = document.createElement("p");
        message.textContent = event.data;
        chat.appendChild(message);
    };

    function sendMessage() {
        let input = document.getElementById("messageInput");
        ws.send(input.value);
        input.value = ""; // Clear input after sending
    }

    // Import the chatbot class from the other file
    class CarShowroomChatbot {
        constructor() {
            this.carDatabase = {
                sedans: [
                { model: "Luxury S1", price: 35000, mpg: 28, features: ["leather seats", "panoramic sunroof", "premium sound system"] },
                { model: "Economy E3", price: 22000, mpg: 38, features: ["backup camera", "bluetooth", "cruise control"] },
                { model: "Sport GT", price: 42000, mpg: 25, features: ["sport suspension", "turbo engine", "racing seats"] }
                ],
                suvs: [
                { model: "Family XL", price: 38000, mpg: 24, features: ["third row seating", "advanced safety", "entertainment system"] },
                { model: "Compact C2", price: 28000, mpg: 32, features: ["all-wheel drive", "hands-free liftgate", "roof rails"] },
                { model: "Luxury LX", price: 52000, mpg: 22, features: ["premium leather", "adaptive cruise", "360 camera"] }
                ],
                electric: [
                { model: "EV Prime", price: 45000, range: 310, features: ["fast charging", "autopilot", "zero emissions"] },
                { model: "EV Sport", price: 65000, range: 280, features: ["dual motor", "premium interior", "performance package"] },
                { model: "EV City", price: 32000, range: 220, features: ["compact size", "affordable", "low maintenance"] }
                ]
            };
            
            this.financingOptions = {
                loan: {
                rates: "Starting at 3.9% APR",
                terms: "36-72 months",
                requirements: "Credit score 650+, proof of income"
                },
                lease: {
                rates: "Starting at $299/month",
                terms: "24-48 months",
                requirements: "Credit score 680+, proof of income"
                },
                cashback: {
                description: "Up to $3,000 cashback on select models",
                eligibility: "New vehicles only, cannot be combined with special financing"
                }
            };
            
            this.commonQuestions = {
                "test drive": "You can schedule a test drive directly through our website or by calling our showroom. For virtual test drives, we offer video walkarounds and detailed 360° interior/exterior views.",
                "warranty": "All new vehicles come with a 3-year/36,000-mile basic warranty and a 5-year/60,000-mile powertrain warranty. Extended warranties are available for purchase.",
                "trade in": "We accept trade-ins and offer competitive market valuations. You can get an estimated value through our online tool or bring your vehicle to our showroom for an in-person appraisal.",
                "delivery": "Delivery options include showroom pickup or home delivery within 50 miles. Delivery is typically available within 3-5 days after purchase completion.",
                "customization": "Most models can be customized with various packages and accessories. Custom orders typically take 4-8 weeks for delivery."
            };
            }
        
            processMessage(message) {
            message = message.toLowerCase();
            
            // Check for greetings
            if (this.containsAny(message, ["hello", "hi", "hey", "start"])) {
                return this.getWelcomeMessage();
            }
            
            // Check for car type inquiries
            if (this.containsAny(message, ["sedan", "car"])) {
                return this.getCarTypeInfo("sedans");
            }
            
            if (this.containsAny(message, ["suv", "crossover", "family"])) {
                return this.getCarTypeInfo("suvs");
            }
            
            if (this.containsAny(message, ["electric", "ev", "battery"])) {
                return this.getCarTypeInfo("electric");
            }
            
            // Check for pricing inquiries
            if (this.containsAny(message, ["price", "cost", "afford", "how much"])) {
                return this.getPricingInfo(message);
            }
            
            // Check for financing inquiries
            if (this.containsAny(message, ["finance", "loan", "lease", "payment", "interest", "credit"])) {
                return this.getFinancingInfo(message);
            }
            
            // Check for common questions
            if (this.containsAny(message, ["test drive", "test-drive"])) {
                return this.commonQuestions["test drive"];
            }
            
            if (this.containsAny(message, ["warranty", "guarantee", "repair"])) {
                return this.commonQuestions["warranty"];
            }
            
            if (this.containsAny(message, ["trade in", "trade-in", "tradein", "my car"])) {
                return this.commonQuestions["trade in"];
            }
            
            if (this.containsAny(message, ["delivery", "pickup", "collect"])) {
                return this.commonQuestions["delivery"];
            }
            
            if (this.containsAny(message, ["custom", "customize", "personalize", "options"])) {
                return this.commonQuestions["customization"];
            }
            
            // Compare vehicles
            if (this.containsAny(message, ["compare", "difference", "vs", "versus"])) {
                return this.getComparisonInfo(message);
            }
            
            // Handle unknown queries
            return "I'm not sure I understand your question. Would you like information about our sedans, SUVs, electric vehicles, financing options, or scheduling a test drive?";
            }
            
            containsAny(text, keywords) {
            return keywords.some(keyword => text.includes(keyword));
            }
            
            getWelcomeMessage() {
            return "Welcome to our Virtual Car Showroom! I can help you explore our vehicle lineup, discuss financing options, or answer questions about the buying process. What type of vehicle are you interested in today? We have sedans, SUVs, and electric vehicles available.";
            }
            
            getCarTypeInfo(type) {
            let response = `Here are our available ${type}:\n\n`;
            
            this.carDatabase[type].forEach(car => {
                response += `${car.model} - $${car.price.toLocaleString()}\n`;
                if (type === "electric") {
                response += `Range: ${car.range} miles\n`;
                } else {
                response += `Fuel efficiency: ${car.mpg} mpg\n`;
                }
                response += `Key features: ${car.features.join(", ")}\n\n`;
            });
            
            response += "Would you like more detailed information about any specific model?";
            return response;
            }
            
            getPricingInfo(message) {
            // Check if the message contains a specific vehicle type
            let vehicleType = "";
            if (this.containsAny(message, ["sedan", "car"])) {
                vehicleType = "sedans";
            } else if (this.containsAny(message, ["suv", "crossover"])) {
                vehicleType = "suvs";
            } else if (this.containsAny(message, ["electric", "ev"])) {
                vehicleType = "electric";
            }
            
            if (vehicleType) {
                const vehicles = this.carDatabase[vehicleType];
                const lowest = Math.min(...vehicles.map(v => v.price));
                const highest = Math.max(...vehicles.map(v => v.price));
                
                return `Our ${vehicleType} range from $${lowest.toLocaleString()} to $${highest.toLocaleString()}. Monthly payments can be as low as $${Math.round(lowest/60).toLocaleString()} with approved financing. Would you like to see specific models or discuss financing options?`;
            }
            
            return "Our vehicles range from $22,000 for our Economy E3 sedan to $65,000 for our top-of-the-line EV Sport. We offer flexible financing options to fit various budgets. Which price range are you considering?";
            }
            
            getFinancingInfo(message) {
            if (this.containsAny(message, ["loan"])) {
                const loan = this.financingOptions.loan;
                return `We offer auto loans starting at ${loan.rates} with terms from ${loan.terms}. Requirements include ${loan.requirements}. Would you like to pre-qualify or discuss specific payment scenarios?`;
            }
            
            if (this.containsAny(message, ["lease"])) {
                const lease = this.financingOptions.lease;
                return `Our lease options start at ${lease.rates} with terms from ${lease.terms}. Requirements include ${lease.requirements}. Leasing is a great option if you prefer lower monthly payments and like to upgrade vehicles regularly.`;
            }
            
            if (this.containsAny(message, ["cash", "rebate", "discount"])) {
                const cashback = this.financingOptions.cashback;
                return `We currently offer ${cashback.description}. ${cashback.eligibility}. Would you like to know which models qualify for the maximum cashback?`;
            }
            
            return "We offer various financing options including loans, leases, and cashback incentives. Our finance team can help find the best option based on your credit profile and budget. Would you like details about loans, leases, or current promotions?";
            }
            
            getComparisonInfo(message) {
            // Compare electric vs gas
            if (this.containsAny(message, ["electric", "ev"]) && this.containsAny(message, ["gas", "petrol", "traditional"])) {
                return "Electric vehicles offer lower operating costs, zero emissions, and instant torque for better acceleration. Gas vehicles typically have longer range and faster refueling. Our EV Prime costs about $45,000 and has a 310-mile range, while a comparable Luxury S1 sedan costs $35,000 with a fuel range of approximately 420 miles. Would you like to discuss the total cost of ownership?";
            }
            
            // Compare sedan vs SUV
            if (this.containsAny(message, ["sedan"]) && this.containsAny(message, ["suv", "crossover"])) {
                return "Sedans typically offer better fuel efficiency and handling, while SUVs provide more interior space and higher ground clearance. For example, our Economy E3 sedan gets 38 mpg and costs $22,000, while our Compact C2 SUV gets 32 mpg and costs $28,000. Which aspects are most important for your needs?";
            }
            
            return "I'd be happy to compare specific models or vehicle types. Would you like to compare sedans vs SUVs, electric vs gas vehicles, or specific models in our lineup?";
            }
        }
        
        // Example usage
        const chatbot = new CarShowroomChatbot();

        document.addEventListener("DOMContentLoaded", function () {
            const chatContainer = document.getElementById("chat-container");
            const messageInput = document.getElementById("message-input");
            const sendButton = document.getElementById("send-button");

            function addMessage(text, isUser = false) {
                const messageDiv = document.createElement("div");
                messageDiv.classList.add("message");
                messageDiv.classList.add(isUser ? "user-message" : "bot-message");
                messageDiv.innerHTML = text;
                chatContainer.appendChild(messageDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }

            function handleUserMessage() {
                const message = messageInput.value.trim();
                if (message === "") return;

                addMessage(message, true);
                messageInput.value = "";

                setTimeout(() => {
                    const botResponse = chatbot.processMessage(message);
                    addMessage(botResponse, false);
                }, 500);
            }

            sendButton.addEventListener("click", handleUserMessage);
            messageInput.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    handleUserMessage();
                }
            });

            document.querySelectorAll(".category-button, .question-button").forEach(button => {
                button.addEventListener("click", function () {
                    messageInput.value = this.dataset.message;
                    handleUserMessage();
                });
            });
        });