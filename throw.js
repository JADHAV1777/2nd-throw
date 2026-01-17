//let cart = [];
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// Indian Currency Formatter
const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0 // Removes paisa for cleaner look
});

// Add to Cart Functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
       
        cart.push({ name, price });
        updateCart();
    });
});

function updateCart() {
    // Update Badge Count
    cartCount.innerText = cart.length;

    // Update List
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted">Your cart is empty.</p>';
    } else {
        cartItems.innerHTML = cart.map((item) => `
            <div class="cart-item d-flex justify-content-between mb-2">
                <span>${item.name}</span>
                <span class="fw-bold">${inrFormatter.format(item.price)}</span>
            </div>
        `).join('');
    }

    // Update Total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.innerText = inrFormatter.format(total);
}
function proceedToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
   
    // Save the cart array to LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));
   
    // Redirect to the checkout page
    window.location.href = 'checkout.html';
}


// Load cart from memory on page load
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCart(); // Refresh UI on load

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart)); // Save every time
    updateCart();
}

