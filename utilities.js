
// Array of Objects
const menuItems = [
    { id: "item-1", name: "36-Hour Sourdough Loaf", price: 8.50 },
    { id: "item-2", name: "French Butter Croissant", price: 4.25 }
];

// LocalStorage Helpers
function getStoredWishlist() {
    const data = localStorage.getItem("bakeryWishlist");
    return data ? JSON.parse(data) : [];
}

function saveWishlist(wishlist) {
    localStorage.setItem("bakeryWishlist", JSON.stringify(wishlist));
}

// UI Badge Updater
function updateWishlistBadge() {
    const badge = document.getElementById("wishlist-badge");
    if (badge) {
        badge.textContent = getStoredWishlist().length;
    }
}
