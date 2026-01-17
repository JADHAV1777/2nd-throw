// Load cart from memory on page load
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCart(); // Refresh UI on load

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart)); // Save every time
    updateCart();
}



const express = require('express');
const Razorpay = require('razorpay');
const app = express();
app.use(express.json());

const razorpay = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET'
});

// 1. DYNAMIC PRODUCT LIST (In reality, this comes from a Database like MongoDB)
const products = [
    { id: "car_01", name: "Model S-EV", price: 6499000, stock: 2 },
    { id: "phone_01", name: "Quantum X Pro", price: 119999, stock: 15 }
];

// 2. SECURE ORDER CREATION (The "Handshake")
app.post('/create-order', async (req, res) => {
    const { productId } = req.body;
    const item = products.find(p => p.id === productId);

    if (!item || item.stock <= 0) return res.status(400).send("Out of stock");

    // SERVER-SIDE price validation (User cannot hack the price here)
    const options = {
        amount: item.price * 100, // Amount in Paise
        currency: "INR",
        receipt: `receipt_${item.id}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
