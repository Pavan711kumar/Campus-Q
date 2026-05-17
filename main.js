import { db, ORDER_COLLECTION } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
const state = {
  currentPage: 'login',
  user: {
    name: '',
    phone: '',
    block: '',
    room: ''
  },
  cart: [],
  foods: [
    { id: 1, name: 'Premium Burger', price: 149, img: '/images/burger.png' },
    { id: 2, name: 'Gourmet Pizza', price: 249, img: '/images/pizza.png' },
    { id: 3, name: 'Student Pasta', price: 120, img: '/images/burger.png' }, // Fallback to burger if Pasta failed
    { id: 4, name: 'Sushi Selection', price: 299, img: '/images/pizza.png' }  // Fallback to pizza if Sushi failed
  ],
  mcp: {
    stats: {
      breakfast: 145,
      lunch: 210,
      revenue: 12500,
      activeOrders: 12
    }
  }
};

function navigate(pageId) {
  // Close any open modals
  const cartModal = document.getElementById('cart-modal');
  if (cartModal) cartModal.classList.remove('show');

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    state.currentPage = pageId;
    window.scrollTo(0, 0);
  }
}
window.navigate = navigate;

function initApp() {
  const app = document.getElementById('app');

  // Login View
  const loginView = document.createElement('div');
  loginView.id = 'login';
  loginView.className = 'view active fade-in';
  loginView.innerHTML = `
    <div class="login-header">
      <h1>Student Canteen</h1>
      <p style="color: var(--text-muted)">Order food with student deals</p>
    </div>
    <div class="glass-card">
      <div class="input-group">
        <label>Student Name</label>
        <input type="text" id="name" placeholder="Enter Your Name">
      </div>
      <div class="input-group">
        <label>Phone Number</label>
        <input type="tel" id="phone" placeholder="Enter Your Phone Number">
      </div>
      <div class="input-group">
        <label>Block Name</label>
        <input type="text" id="block" placeholder="Enter Block Name">
      </div>
      <div class="input-group">
        <label>Class Room Number</label>
        <input type="text" id="room" placeholder="Enter Class Room Number">
      </div>
      <button class="btn-primary" onclick="handleSubmitLogin()">Submit</button>
    </div>
  `;
  app.appendChild(loginView);

  // Main Page View
  const mainView = document.createElement('div');
  mainView.id = 'main';
  mainView.className = 'view fade-in';
  mainView.innerHTML = `
    <div class="login-header" style="margin-bottom: 20px">
      <h2>Welcome, <span id="welcome-name">Student</span></h2>
      <p style="color: var(--text-muted)">What would you like to eat today?</p>
    </div>
    <div class="food-grid" id="food-list"></div>
    <div class="cart-btn" onclick="toggleCart()">🛒</div>
  `;
  app.appendChild(mainView);

  // Payment View
  const paymentView = document.createElement('div');
  paymentView.id = 'payment';
  paymentView.className = 'view fade-in';
  paymentView.innerHTML = `
    <div class="login-header">
      <h2>Payment Options</h2>
    </div>
    <div class="glass-card" style="display: flex; flex-direction: column; gap: 15px">
      <button class="btn-primary" style="background: #2563eb" onclick="handlePayment('UPI')">UPI PAYMENTS</button>
      <hr style="border: none; border-top: 1px solid var(--glass-border); margin: 10px 0">
      <button class="btn-primary" style="background: var(--card-bg)" onclick="handlePayment('COD')">Cash on Delivery</button>
    </div>
  `;
  app.appendChild(paymentView);

  // Tracking View
  const trackingView = document.createElement('div');
  trackingView.id = 'tracking';
  trackingView.className = 'view fade-in';
  trackingView.innerHTML = `
    <div class="login-header">
      <h2>Order Tracking</h2>
      <p style="color: var(--success)">Your food is on the way!</p>
    </div>
    <div class="glass-card tracking-stepper">
      <div class="step completed">
        <div class="step-icon"></div>
        <div>
          <p style="font-weight: bold">Order Confirmed</p>
          <p style="font-size: 0.8rem; color: var(--text-muted)">We've received your order</p>
        </div>
      </div>
      <div class="step active">
        <div class="step-icon"></div>
        <div>
          <p style="font-weight: bold">Preparing</p>
          <p style="font-size: 0.8rem; color: var(--text-muted)">Chef is making your meal</p>
        </div>
      </div>
      <div class="step">
        <div class="step-icon"></div>
        <div>
          <p style="font-weight: bold">Out for Delivery</p>
          <p style="font-size: 0.8rem; color: var(--text-muted)">Rider is picking up</p>
        </div>
      </div>
      <div class="step">
        <div class="step-icon"></div>
        <div>
          <p style="font-weight: bold">Delivered</p>
          <p style="font-size: 0.8rem; color: var(--text-muted)">Enjoy your food!</p>
        </div>
      </div>
    </div>
    <button class="btn-primary" style="margin-top: 20px" onclick="location.reload()">Order More</button>
  `;
  app.appendChild(trackingView);

  // MCP View (Management Control Panel)
  const mcpView = document.createElement('div');
  mcpView.id = 'mcp';
  mcpView.className = 'view fade-in';
  mcpView.innerHTML = `
    <div class="login-header">
      <h1>Canteen Dashboard</h1>
      <p style="color: var(--text-muted)">Daily Management Control Panel</p>
    </div>
    
    <div class="mcp-grid">
      <div class="glass-card stat-card">
        <div class="stat-label">Breakfast</div>
        <div class="stat-value">${state.mcp.stats.breakfast}</div>
        <div class="stat-meta">Attendance Today</div>
      </div>
      <div class="glass-card stat-card">
        <div class="stat-label">Lunch</div>
        <div class="stat-value">${state.mcp.stats.lunch}</div>
        <div class="stat-meta">Attendance Today</div>
      </div>
      <div class="glass-card stat-card">
        <div class="stat-label">Revenue</div>
        <div class="stat-value">₹${state.mcp.stats.revenue.toFixed(2)}</div>
        <div class="stat-meta">Total Sales Today</div>
      </div>
      <div class="glass-card stat-card">
        <div class="stat-label">Active Orders</div>
        <div class="stat-value">${state.mcp.stats.activeOrders}</div>
        <div class="stat-meta">In Preparation</div>
      </div>
    </div>

    <div class="glass-card chart-container">
      <h3>Weekly Attendance Trend</h3>
      <div class="mcp-chart">
        <div class="chart-bar" style="height: 60%" data-label="Mon"></div>
        <div class="chart-bar" style="height: 80%" data-label="Tue"></div>
        <div class="chart-bar" style="height: 45%" data-label="Wed"></div>
        <div class="chart-bar" style="height: 90%" data-label="Thu"></div>
        <div class="chart-bar" style="height: 75%" data-label="Fri"></div>
      </div>
    </div>

    <button class="btn-primary" style="margin-top: 20px" onclick="navigate('main')">Back to Menu</button>
  `;
  app.appendChild(mcpView);

  // Cart Modal
  const cartModal = document.createElement('div');
  cartModal.id = 'cart-modal';
  cartModal.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
      <h3>Your Cart</h3>
      <span onclick="toggleCart()" style="cursor: pointer">✕</span>
    </div>
    <div id="cart-items-list"></div>
    <div style="margin-top: 20px; display: flex; justify-content: space-between; font-weight: bold">
      <span>Total</span>
      <span id="cart-total">₹0.00</span>
    </div>
    <button class="btn-primary" style="margin-top: 20px" onclick="navigate('payment')">Proceed to Payment</button>
  `;
  document.body.appendChild(cartModal);

  renderFoodList();
}

function renderFoodList() {
  const container = document.getElementById('food-list');
  container.innerHTML = state.foods.map(food => `
    <div class="food-card glass-card" onclick="addToCart(${food.id})">
      <img src="${food.img}" alt="${food.name}">
      <div class="food-info">
        <div class="food-name">${food.name}</div>
        <div style="color: var(--primary-color)">₹${food.price.toFixed(2)}</div>
      </div>
    </div>
  `).join('');
}

window.handleSubmitLogin = () => {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const block = document.getElementById('block').value;
  const room = document.getElementById('room').value;

  if (!name || !phone || !block || !room) {
    return alert('Please fill in all details');
  }

  state.user.name = name;
  state.user.phone = phone;
  state.user.block = block;
  state.user.room = room;

  document.getElementById('welcome-name').innerText = name;
  navigate('main');
};

window.addToCart = (id) => {
  const food = state.foods.find(f => f.id === id);
  state.cart.push(food);
  updateCartUI();
  // Brief animation on cart button
  const cartBtn = document.querySelector('.cart-btn');
  cartBtn.style.transform = 'scale(1.2)';
  setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
};

window.toggleCart = () => {
  document.getElementById('cart-modal').classList.toggle('show');
};

function updateCartUI() {
  const list = document.getElementById('cart-items-list');
  const totalEl = document.getElementById('cart-total');

  if (state.cart.length === 0) {
    list.innerHTML = '<p style="color: var(--text-muted)">Your cart is empty</p>';
    totalEl.innerText = '₹0.00';
    return;
  }

  list.innerHTML = state.cart.map((item, index) => `
    <div class="cart-item">
      <span>${item.name}</span>
      <span>₹${item.price.toFixed(2)}</span>
    </div>
  `).join('');

  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  totalEl.innerText = `₹${total.toFixed(2)}`;
}

window.handlePayment = async (method) => {
  console.log('Paid via', method);

  if (state.cart.length === 0) {
    alert('Please add at least one food item before payment.');
    navigate('main');
    return;
  }
  
  const order = {
    method: method,
    user: { ...state.user },
    cart: [...state.cart],
    total: state.cart.reduce((sum, item) => sum + item.price, 0),
    time: new Date().toLocaleTimeString(),
    timestamp: Date.now(),
    createdAt: serverTimestamp(),
    status: 'pending'
  };
  
  try {
    const docRef = await addDoc(collection(db, ORDER_COLLECTION), order);
    console.log(`Order saved to Firebase collection "${ORDER_COLLECTION}" with id: ${docRef.id}`);
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Error placing order. Please check your connection or Firebase permissions.");
    return;
  }

  // Clear cart
  state.cart = [];
  updateCartUI();

  const cartModal = document.getElementById('cart-modal');
  if (cartModal) cartModal.classList.remove('show');
  navigate('tracking');
};

// Secret gesture to access MCP (Click "Student Canteen" title 5 times)
let clickCount = 0;
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'H1' && e.target.closest('.login-header')) {
    clickCount++;
    if (clickCount === 5) {
      navigate('mcp');
      clickCount = 0;
    }
  } else {
    clickCount = 0;
  }
});

initApp();
