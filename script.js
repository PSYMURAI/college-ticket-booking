document.addEventListener("DOMContentLoaded", function () {
    const eventCards = document.querySelectorAll(".event-card");
    const paymentContainer = document.querySelector(".payment-container");
    const registrationButton = document.getElementById("registration-button");
    const registrationPopup = document.getElementById("registration-popup");
    const closeRegistrationPopup = document.getElementById("close-registration-popup");

    let selectedEvents = [];

    // Initially hide the payment container and registration popup
    paymentContainer.style.display = "none";
    registrationPopup.style.display = "none";
    
    // Initially hide the "Register" button
    registrationButton.style.display = "none";

    eventCards.forEach((card) => {
        card.addEventListener("click", function () {
            if (selectedEvents.length < 2) {
                const eventId = card.getAttribute("data-event-id");

                if (!card.classList.contains("selected")) {
                    card.classList.add("selected");
                    selectedEvents.push(eventId);
                } else {
                    card.classList.remove("selected");
                    selectedEvents = selectedEvents.filter(event => event !== eventId);
                }

                if (selectedEvents.length > 0) {
                    // Show the payment container when cards are selected
                    paymentContainer.style.display = "block";
                    // Show the "Register" button when at least one card is selected
                    registrationButton.style.display = "block";
                } else {
                    // Hide the payment container and "Register" button when no cards are selected
                    paymentContainer.style.display = "none";
                    registrationButton.style.display = "none";
                }

                updateCardState();
                updatePaymentAmount();
            }
        });
    });

    registrationButton.addEventListener("click", function () {
        // Show the registration form pop-up
        registrationPopup.style.display = "block";
    });

    closeRegistrationPopup.addEventListener("click", function () {
        // Close the registration form pop-up
        registrationPopup.style.display = "none";
    });

    function updateCardState() {
        eventCards.forEach((card) => {
            if (selectedEvents.length >= 2 && !card.classList.contains("selected")) {
                card.classList.add("disabled");
                card.style.pointerEvents = "none";
            } else {
                card.classList.remove("disabled");
                card.style.pointerEvents = "auto";
            }
        });
    }

    function updatePaymentAmount() {
        const paymentAmount = selectedEvents.length === 2 ? 200 : selectedEvents.length * 100;
        const paymentAmountElement = document.getElementById("payment-amount");
        paymentAmountElement.textContent = `Total Amount: ${paymentAmount} Rs`;
        const barcodeImage = document.getElementById("barcode-image");
        barcodeImage.src = selectedEvents.length === 2 ? "200qr.jpg" : "100qr.jpg";
    }
});
