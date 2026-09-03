document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize UI Badge on Page Load
    updateWishlistBadge();

    // 2. Interactive Feature: Wishlist Toggle (Menu Page)
    const wishlistButtons = document.querySelectorAll(".wishlist-btn");
    if (wishlistButtons.length > 0) {
        let wishlist = getStoredWishlist();

        wishlistButtons.forEach(button => {
            const id = button.getAttribute("data-id");

            if (wishlist.includes(id)) {
                button.textContent = "Saved in Wishlist ✓";
                button.classList.add("active");
            }

            button.addEventListener("click", () => {
                wishlist = getStoredWishlist();
                const index = wishlist.indexOf(id);

                if (index === -1) {
                    wishlist.push(id);
                    button.textContent = "Saved in Wishlist ✓";
                    button.classList.add("active");
                } else {
                    wishlist.splice(index, 1);
                    button.textContent = "+ Add to Pre-Order Wishlist";
                    button.classList.remove("active");
                }

                saveWishlist(wishlist);
                updateWishlistBadge();
            });
        });
    }

    // 3. Form Validation & User Feedback (Contact Page)
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

            // Reset errors
            [nameErr, emailErr, qtyErr].forEach(el => if (el) el.textContent = "");
            [name, email, qty].forEach(el => if (el) el.style.borderColor = "");

            let isValid = true;

            if (!name.value.trim() || name.value.trim().length < 2) {
                nameErr.textContent = "Please enter your full name (at least 2 characters).";
                name.style.borderColor = "red";
                isValid = false;
            }

            if (!email.value.includes("@")) {
                emailErr.textContent = "Please enter a valid email address.";
                email.style.borderColor = "red";
                isValid = false;
            }

            const qtyVal = parseInt(qty.value, 10);
            if (isNaN(qtyVal) || qtyVal < 1 || qtyVal > 50) {
                qtyErr.textContent = "Please enter a quantity between 1 and 50.";
                qty.style.borderColor = "red";
                isValid = false;
            }

            // 4. Client-Side Data Storage
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
