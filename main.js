document.addEventListener("DOMContentLoaded", () => {
    // Sync badge counter on load
    updateWishlistBadge();

    // INTERACTIVE FEATURE: Wishlist Button Toggles (products.html)
    const wishlistButtons = document.querySelectorAll(".wishlist-btn");
    if (wishlistButtons.length > 0) {
        let currentWishlist = getWishlist();

        wishlistButtons.forEach((button) => {
            const itemId = button.getAttribute("data-id");

            if (currentWishlist.includes(itemId)) {
                button.textContent = "Saved in Wishlist ✓";
                button.classList.add("active");
            }

            button.addEventListener("click", () => {
                currentWishlist = getWishlist();
                const index = currentWishlist.indexOf(itemId);

                if (index === -1) {
                    currentWishlist.push(itemId);
                    button.textContent = "Saved in Wishlist ✓";
                    button.classList.add("active");
                } else {
                    currentWishlist.splice(index, 1);
                    button.textContent = "+ Add to Pre-Order Wishlist";
                    button.classList.remove("active");
                }

                saveWishlist(currentWishlist);
                updateWishlistBadge();
            });
        });
    }

    // FORM VALIDATION & CLIENT-SIDE STORAGE (contact.html)
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
            if (nameErr) nameErr.textContent = "";
            if (emailErr) emailErr.textContent = "";
            if (qtyErr) qtyErr.textContent = "";
            if (name) name.style.borderColor = "";
            if (email) email.style.borderColor = "";
            if (qty) qty.style.borderColor = "";

            let isValid = true;

            // Name validation
            if (!name || !name.value.trim() || name.value.trim().length < 2) {
                if (nameErr) nameErr.textContent = "Please enter your full name (at least 2 characters).";
                if (name) name.style.borderColor = "red";
                isValid = false;
            }

            // Email validation
            if (!email || !email.value.includes("@")) {
                if (emailErr) emailErr.textContent = "Please enter a valid email address.";
                if (email) email.style.borderColor = "red";
                isValid = false;
            }

            // Quantity validation
            const qtyVal = parseInt(qty ? qty.value : "0", 10);
            if (isNaN(qtyVal) || qtyVal < 1 || qtyVal > 50) {
                if (qtyErr) qtyErr.textContent = "Please enter a quantity between 1 and 50.";
                if (qty) qty.style.borderColor = "red";
                isValid = false;
            }

            // Save to Local Storage
            if (isValid) {
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
