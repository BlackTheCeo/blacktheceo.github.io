
    <fieldset>
        <legend>Pre-Order & Contact Details</legend>

        <label for="cust-name">Full Name *</label>
        <input type="text" id="cust-name" name="cust-name">
        <span id="cust-name-error" class="error-msg"></span>

        <label for="cust-email">Email Address *</label>
        <input type="email" id="cust-email" name="cust-email">
        <span id="cust-email-error" class="error-msg"></span>

        <label for="pickup-qty">Total Item Quantity (1-50) *</label>
        <input type="number" id="pickup-qty" name="pickup-qty" min="1" max="50">
        <span id="pickup-qty-error" class="error-msg"></span>

        <label for="order-details">Order Details & Notes</label>
        <textarea id="order-details" rows="4"></textarea>

        <div id="wishlist-summary-container">
            <h3>Items in Your Wishlist:</h3>
            <div id="wishlist-summary"></div>
        </div>

        <button type="submit">Submit Pre-Order Request</button>
    </fieldset>
</form>
<nav>
<script src="script.js" defer></script>
    <!-- Add badge to navigation link -->
    <a href="contact.html">Pre-Order (<span id="wishlist-badge">0</span>)</a>
</nav>

<!-- Example Product Item with Wishlist Button -->
<ul id="bread-category">
    <li class="card">
        <h3>36-Hour Sourdough Loaf</h3>
        <p>Naturally leavened with crisp crust. $8.50</p>
        <button type="button" class="wishlist-btn" data-id="item-1">+ Add to Pre-Order Wishlist</button>
    </li>
</ul>
/* ==========================================================================
   NORTH STAR BAKERY - INTERACTIVITY & VALIDATION (script.js)
   ========================================================================== */

// --- 1. DATA STRUCTURES (Arrays & Objects) ---
const menuItems = [
    { id: "item-1", name: "36-Hour Sourdough Loaf", category: "bread", price: 8.50 },
    { id: "item-2", name: "French Butter Croissant", category: "pastry", price: 4.25 },
    { id: "item-3", name: "Seasonal Fruit Danish", category: "pastry", price: 5.00 },
    { id: "item-4", name: "Organic Multigrain Bread", category: "bread", price: 9.00 }
];

let userWishlist = [];

// --- 2. INITIALIZATION & STORAGE LOAD ---
document.addEventListener("DOMContentLoaded", () => {
    loadSavedData();
    setupWishlistButtons();
    initValidation();
});

function loadSavedData() {
    // Load saved wishlist array from localStorage
    const storedWishlist = localStorage.getItem("bakeryWishlist");
    if (storedWishlist) {
        userWishlist = JSON.parse(storedWishlist);
    }
    updateWishlistUI();

    // Pre-fill form fields on contact.html if stored data exists
    const storedUser = localStorage.getItem("bakeryUserData");
    if (storedUser) {
        const userData = JSON.parse(storedUser);
        const nameInput = document.getElementById("cust-name");
        const emailInput = document.getElementById("cust-email");
        if (nameInput && userData.name) nameInput.value = userData.name;
        if (emailInput && userData.email) emailInput.value = userData.email;
    }
}

function saveToStorage() {
    localStorage.setItem("bakeryWishlist", JSON.stringify(userWishlist));
}

// --- 3. INTERACTIVE WISHLIST FEATURE ---
function setupWishlistButtons() {
    const buttons = document.querySelectorAll(".wishlist-btn");
    buttons.forEach(button => {
        const itemId = button.getAttribute("data-id");
        
        // Reflect initial saved state on button label
        if (userWishlist.includes(itemId)) {
            button.textContent = "Saved in Wishlist ✓";
            button.classList.add("active");
        }

        button.addEventListener("click", () => toggleWishlist(itemId, button));
    });
}

function toggleWishlist(itemId, buttonElement) {
    const index = userWishlist.indexOf(itemId);
    
    if (index === -1) {
        userWishlist.push(itemId);
        if (buttonElement) {
            buttonElement.textContent = "Saved in Wishlist ✓";
            buttonElement.classList.add("active");
        }
    } else {
        userWishlist.splice(index, 1);
        if (buttonElement) {
            buttonElement.textContent = "+ Add to Pre-Order Wishlist";
            buttonElement.classList.remove("active");
        }
    }

    saveToStorage();
    updateWishlistUI();
}

function updateWishlistUI() {
    // Update live navigation badge counter
    const badge = document.getElementById("wishlist-badge");
    if (badge) {
        badge.textContent = userWishlist.length;
    }

    // Render summary list inside contact pre-order form if present
    const summaryContainer = document.getElementById("wishlist-summary");
    const orderDetailsInput = document.getElementById("order-details");

    if (summaryContainer) {
        if (userWishlist.length === 0) {
            summaryContainer.innerHTML = "<p><em>No items saved in your wishlist yet. Browse our menu to add items!</em></p>";
        } else {
            const savedObjects = menuItems.filter(item => userWishlist.includes(item.id));
            const listHTML = savedObjects.map(item => `<li>${item.name} - $${item.price.toFixed(2)}</li>`).join("");
            summaryContainer.innerHTML = `<ul>${listHTML}</ul>`;
            
            // Auto pre-fill textarea with saved wishlist items
            if (orderDetailsInput && !orderDetailsInput.value) {
                orderDetailsInput.value = "Wishlist Items:\n" + savedObjects.map(item => `- ${item.name}`).join("\n");
            }
        }
    }
}

// --- 4. FORM VALIDATION & INLINE FEEDBACK ---
function initValidation() {
    const orderForm = document.getElementById("preorder-form");
    if (!orderForm) return;

    // Real-time input clearing on typing
    const fields = ["cust-name", "cust-email", "pickup-qty"];
    fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener("input", () => clearFieldError(fieldId));
        }
    });

    orderForm.addEventListener("submit", validateForm);
}

function validateForm(event) {
    let isValid = true;

    // Check 1: Required Field & Minimum Length Check (Name)
    const nameInput = document.getElementById("cust-name");
    if (nameInput) {
        if (nameInput.value.trim().length < 2) {
            showFieldError("cust-name", "Please enter your full name (at least 2 characters).");
            isValid = false;
        } else {
            clearFieldError("cust-name");
        }
    }

    // Check 2: Email Format Validation (Regex)
    const emailInput = document.getElementById("cust-email");
    if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showFieldError("cust-email", "Please enter a valid email address (e.g., name@example.com).");
            isValid = false;
        } else {
            clearFieldError("cust-email");
        }
    }

    // Check 3: Numeric Range Validation (Quantity)
    const qtyInput = document.getElementById("pickup-qty");
    if (qtyInput) {
        const qtyVal = parseInt(qtyInput.value, 10);
        if (isNaN(qtyVal) || qtyVal < 1 || qtyVal > 50) {
   /* NORTH STAR BAKERY - INTERACTIVITY & VALIDATION */

const menuItems = [
    { id: "item-1", name: "36-Hour Sourdough Loaf", category: "bread", price: 8.50 },
    { id: "item-2", name: "French Butter Croissant", category: "pastry", price: 4.25 },
    { id: "item-3", name: "Seasonal Fruit Danish", category: "pastry", price: 5.00 },
    { id: "item-4", name: "Organic Multigrain Bread", category: "bread", price: 9.00 }
];

let userWishlist = [];

document.addEventListener("DOMContentLoaded", () => {
    loadSavedData();
    setupWishlistButtons();
    initValidation();
});

function loadSavedData() {
    const storedWishlist = localStorage.getItem("bakeryWishlist");
    if (storedWishlist) {
        userWishlist = JSON.parse(storedWishlist);
    }
    updateWishlistUI();

    const storedUser = localStorage.getItem("bakeryUserData");
    if (storedUser) {
        const userData = JSON.parse(storedUser);
        const nameInput = document.getElementById("cust-name");
        const emailInput = document.getElementById("cust-email");
        if (nameInput && userData.name) nameInput.value = userData.name;
        if (emailInput && userData.email) emailInput.value = userData.email;
    }
}

function saveToStorage() {
    localStorage.setItem("bakeryWishlist", JSON.stringify(userWishlist));
}

function setupWishlistButtons() {
    const buttons = document.querySelectorAll(".wishlist-btn");
    buttons.forEach(button => {
        const itemId = button.getAttribute("data-id");
        if (userWishlist.includes(itemId)) {
            button.textContent = "Saved in Wishlist ✓";
            button.classList.add("active");
        }
        button.addEventListener("click", () => toggleWishlist(itemId, button));
    });
}

function toggleWishlist(itemId, buttonElement) {
    const index = userWishlist.indexOf(itemId);
    
    if (index === -1) {
        userWishlist.push(itemId);
        if (buttonElement) {
            buttonElement.textContent = "Saved in Wishlist ✓";
            buttonElement.classList.add("active");
        }
    } else {
        userWishlist.splice(index, 1);
        if (buttonElement) {
            buttonElement.textContent = "+ Add to Pre-Order Wishlist";
            buttonElement.classList.remove("active");
        }
    }

    saveToStorage();
    updateWishlistUI();
}

function updateWishlistUI() {
    const badge = document.getElementById("wishlist-badge");
    if (badge) {
        badge.textContent = userWishlist.length;
    }

    const summaryContainer = document.getElementById("wishlist-summary");
    const orderDetailsInput = document.getElementById("order-details");

    if (summaryContainer) {
        if (userWishlist.length === 0) {
            summaryContainer.innerHTML = "<p><em>No items saved in your wishlist yet. Browse our menu to add items!</em></p>";
        } else {
            const savedObjects = menuItems.filter(item => userWishlist.includes(item.id));
            const listHTML = savedObjects.map(item => `<li>${item.name} - $${item.price.toFixed(2)}</li>`).join("");
            summaryContainer.innerHTML = `<ul>${listHTML}</ul>`;

            if (orderDetailsInput && !orderDetailsInput.value) {
                orderDetailsInput.value = "Wishlist Items:\n" + savedObjects.map(item => `- ${item.name}`).join("\n");
            }
        }
    }
}

function initValidation() {
    const orderForm = document.getElementById("preorder-form");
    if (!orderForm) return;

    const fields = ["cust-name", "cust-email", "pickup-qty"];
    fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener("input", () => clearFieldError(fieldId));
        }
    });

    orderForm.addEventListener("submit", validateForm);
}

function validateForm(event) {
    let isValid = true;

    const nameInput = document.getElementById("cust-name");
    if (nameInput) {
        if (nameInput.value.trim().length < 2) {
            showFieldError("cust-name", "Please enter your full name (at least 2 characters).");
            isValid = false;
        } else {
            clearFieldError("cust-name");
        }
    }

    const emailInput = document.getElementById("cust-email");
    if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showFieldError("cust-email", "Please enter a valid email address (e.g., name@example.com).");
            isValid = false;
        } else {
            clearFieldError("cust-email");
        }
    }

    const qtyInput = document.getElementById("pickup-qty");
    if (qtyInput) {
        const qtyVal = parseInt(qtyInput.value, 10);
        if (isNaN(qtyVal) || qtyVal < 1 || qtyVal > 50) {
            showFieldError("pickup-qty", "Order quantity must be a number between 1 and 50.");
            isValid = false;
        } else {
            clearFieldError("pickup-qty");
        }
    }

    if (!isValid) {
        event.preventDefault();
    } else {
        const userData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim()
        };
        localStorage.setItem("bakeryUserData", JSON.stringify(userData));
        alert("Pre-order request submitted successfully! Your information has been saved.");
    }
}

function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}-error`);

    if (input) {
        input.style.borderColor = "#c0392b";
        input.style.backgroundColor = "#fdf2e9";
    }
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.color = "#c0392b";
        errorSpan.style.display = "block";
        errorSpan.style.fontSize = "0.85rem";
        errorSpan.style.marginTop = "0.25rem";
    }
}

function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}-error`);

    if (input) {
        input.style.borderColor = "#6B3E26";
        input.style.backgroundColor = "#ffffff";
    }
    if (errorSpan) {
        errorSpan.textContent = "";
        errorSpan.style.display = "none";
    }
}