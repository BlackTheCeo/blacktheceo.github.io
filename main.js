document.addEventListener("DOMContentLoaded", () => {
    // Sync wishlist badge on load
    const storedWishlist = localStorage.getItem("bakeryWishlist");
    if (storedWishlist) {
        const badge = document.getElementById("wishlist-badge");
        if (badge) badge.textContent = JSON.parse(storedWishlist).length;
    }

    // Form Handling
    const form = document.getElementById("preorder-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("cust-name");
            const email = document.getElementById("cust-email");
            const qty = document.getElementById("pickup-qty");

            const nameErr = document.getElementById("cust-name-error");
            const emailErr = document.getElementById("cust-email-error");
            const qtyErr = document.getElementById("pickup-qty-error");

            // Reset UI states
            nameErr.textContent = "";
            emailErr.textContent = "";
            qtyErr.textContent = "";
            name.style.borderColor = "";
            email.style.borderColor = "";
            qty.style.borderColor = "";

            let valid = true;

            if (!name.value.trim() || name.value.trim().length < 2) {
                nameErr.textContent = "Please enter your full name (at least 2 characters).";
                name.style.borderColor = "red";
                valid = false;
            }

            if (!email.value.includes("@")) {
                emailErr.textContent = "Please enter a valid email address.";
                email.style.borderColor = "red";
                valid = false;
            }

            const qtyVal = parseInt(qty.value, 10);
            if (isNaN(qtyVal) || qtyVal < 1 || qtyVal > 50) {
                qtyErr.textContent = "Please enter a quantity between 1 and 50.";
                qty.style.borderColor = "red";
                valid = false;
            }

            if (valid) {
                const userData = { 
                    name: name.value.trim(), 
                    email: email.value.trim(),
                    quantity: qtyVal
                };
                localStorage.setItem("bakeryUserData", JSON.stringify(userData));
                alert("Pre-order saved to Local Storage!");
                form.reset();
            }
        });
    }
});
