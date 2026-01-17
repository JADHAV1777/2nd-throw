// Load cart from memory on page load
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCart(); // Refresh UI on load

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart)); // Save every time
    updateCart();
}


// Indian Currency Formatter
const inr = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
});

// Load data from localStorage (passed from the index page)
const cartData = JSON.parse(localStorage.getItem('cart')) || [];

function renderSummary() {
    const summaryList = document.getElementById('summary-items');
    const totalElement = document.getElementById('summary-total');
    const countBadge = document.getElementById('summary-count');

    if (cartData.length === 0) {
        summaryList.innerHTML = '<li class="list-group-item">Cart is empty</li>';
        return;
    }

    summaryList.innerHTML = cartData.map(item => `
        <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
                <h6 class="my-0">${item.name}</h6>
                <small class="text-muted">High-performance item</small>
            </div>
            <span class="text-muted">${inr.format(item.price)}</span>
        </li>
    `).join('');

    const total = cartData.reduce((acc, item) => acc + item.price, 0);
    totalElement.innerText = inr.format(total);
    countBadge.innerText = cartData.length;
}

// Professional Form Validation
(function () {
    'use strict'
    const form = document.getElementById('checkoutForm');
   
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            processPayment();
        }
        form.classList.add('was-validated');
    }, false);
})();

//function processPayment() {
  //  alert("Redirecting to Secure Gateway... \nTotal: " + document.getElementById('summary-total').innerText);
    // Real-world: You would initialize Razorpay or Stripe here.
    // Example: rzp.open();}

async function processPayment() {
    const totalAmount = cartData.reduce((acc, item) => acc + item.price, 0);
   
    // Professional Tip: Amount must be in PAISA (1 INR = 100 Paisa)
    const amountInPaisa = totalAmount * 100;

    const options = {
        "key": "rzp_test_YOUR_KEY_ID", // Replace with your Test Key from Razorpay Dashboard
        "amount": amountInPaisa,
        "currency": "INR",
        "name": "ELECTRO DRIVE",
        "description": "Purchase of Premium Electronics/Vehicle",
        "image": "https://your-logo-url.com/logo.png",
        "order_id": "", // In production, this comes from your Server-side API
        "handler": function (response){
            // This runs after successful payment
            alert("Payment Successful!");
            console.log("Payment ID:", response.razorpay_payment_id);
            console.log("Signature:", response.razorpay_signature);
           
            // Clear cart and redirect
            localStorage.removeItem('cart');
            window.location.href = "thank-you.html";
        },
        "prefill": {
            "name": document.getElementById('firstName').value + " " + document.getElementById('lastName').value,
            "email": document.getElementById('email').value,
            "contact": "9999999999"
        },
        "theme": {
            "color": "#0d6efd" // Matches our Bootstrap Primary Color
        }
    };

    const rzp1 = new Razorpay(options);
   
    rzp1.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
    });

    rzp1.open();
}
document.addEventListener('DOMContentLoaded', renderSummary);
