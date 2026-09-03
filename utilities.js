// Array of Objects (Data Structure)
const menuItems = [
    { id: "item-1", name: "36-Hour Sourdough Loaf", price: 8.50 },
    { id: "item-2", name: "French Butter Croissant", price: 4.25 }
];

// Function 1: Retrieve Wishlist from localStorage
function getWishlist() {
    const stored = localStorage.getItem("bakeryWishlist");
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse wishlist:", e);
        return [];
    }
}

// Function 2: Save Wishlist to localStorage
function saveWishlist(wishlistArray) {
    localStorage.setItem("bakeryWishlist", JSON.stringify(wishlistArray));
}

// Function 3: Update Navigation Wishlist Badge
function updateWishlistBadge() {
    const badge = document.getElementById("wishlist-badge");
    if (badge) {
        const wishlist = getWishlist();
        badge.textContent = wishlist.length;
    }
}
