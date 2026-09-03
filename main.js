document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. WISHLIST MANAGEMENT (Runs on all pages)
    // ==========================================
    let userWishlist = [];
    const storedWishlist = localStorage.getItem("bakeryWishlist");

    if (storedWishlist) {
        try {
            userWishlist = JSON.parse(storedWishlist);
        } catch (e) {
            console.error("Error parsing wishlist from localStorage:", e);
            userWishlist = [];
        }
    }

    // Helper to update the navigation badge counter
    function updateBadge() {
        const badge = document.getElementById("wishlist-badge");
        if (badge) {
            badge.textContent = userWishlist.length;
        }
    }

    // Initial badge render on load
    updateBadge();

    // Attach click listeners to wishlist buttons (if present on products.html)
    const wishlistButtons = document.querySelectorAll(".wishlist-btn");
    wishlistButtons.forEach((button) => {
        const itemId = button.getAttribute("data-id");

        // Set initial button state based on saved wishlist
        if (userWishlist.includes(itemId)) {
            button.textContent = "Saved in Wishlist ✓";
            button.classList.add("active");
        }

        // Toggle wishlist item on click
        button.addEventListener("click", () => {
            const index = userWishlist.indexOf(itemId);

            if (index === -1) {
                userWishlist.push(itemId);
                button.textContent = "Saved in Wishlist ✓";
                button.classList.add("active");
            } else {
                userWishlist.splice(index, 1);
                button.textContent = "+ Add to Pre-Order Wishlist";
                button.classList.remove("active");
            }

            localStorage.setItem("bakeryWishlist", JSON.stringify(userWishlist));
            updateBadge();
        });
    });

    // ==========================================
    // 2. FORM VALIDATION (Runs on contact.html)
    // ==========================================
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

            // Name validation
            if (!name.value.trim() || name.value.trim().length < 2) {
                nameErr.textContent = "Please enter your full name (at least 2 characters).";
                name.style.borderColor = "red";
                valid = false;
            }

            // Email validation
            if (!email.value.includes("@")) {
                emailErr.textContent = "Please enter a valid email address.";
                email.style.borderColor = "red";
                valid = false;
            }

            // Quantity validation
            const qtyVal = parseInt(qty.value, 10);
            if (isNaN(qtyVal) || qtyVal < 1 || qtyVal > 50) {
                qtyErr.textContent = "Please enter a quantity between 1 and 50.";
                qty.style.borderColor = "red";
                valid = false;
            }

            // Save user data if valid
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
