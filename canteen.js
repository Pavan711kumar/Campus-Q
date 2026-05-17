import { db, ORDER_COLLECTION } from './firebase-config.js';
import { collection, onSnapshot, deleteDoc, doc, query } from 'firebase/firestore';

function renderOrders(orders) {
  const container = document.getElementById('orders-container');

  if (orders.length === 0) {
    container.innerHTML = '<div class="glass-card" style="text-align: center;"><p style="color: var(--text-muted)">No active orders.</p></div>';
    return;
  }

  container.innerHTML = orders.map(order => {
    const user = order.user || {};
    const cart = Array.isArray(order.cart) ? order.cart : [];
    const total = typeof order.total === 'number'
      ? order.total
      : cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    return `
    <div class="glass-card fade-in" style="position: relative;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
        <h3 style="color: var(--primary-color)">Order #${order.id.slice(-4).toUpperCase()}</h3>
        <span style="color: var(--text-muted); font-size: 0.8rem;">${order.time || 'Pending time'}</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div>
          <strong style="color: var(--accent-color)">User Details</strong>
          <p>Name: ${user.name || 'Not provided'}</p>
          <p>Phone: ${user.phone || 'Not provided'}</p>
        </div>
        <div>
          <strong style="color: var(--accent-color)">Delivery Details</strong>
          <p>Block: ${user.block || 'Not provided'}</p>
          <p>Room: ${user.room || 'Not provided'}</p>
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <strong style="color: var(--accent-color)">Order Items</strong>
        <ul style="list-style: none; padding-left: 0; margin-top: 5px;">
          ${cart.length
            ? cart.map(item => `<li style="margin-bottom: 5px;">${item.name || 'Item'} - Rs ${(Number(item.price) || 0).toFixed(2)}</li>`).join('')
            : '<li style="margin-bottom: 5px;">No items listed</li>'}
        </ul>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid var(--glass-border);">
        <div>
          <strong style="color: var(--accent-color)">Payment Details</strong>
          <p style="margin-top: 5px;">Method: ${order.method || 'Not provided'}</p>
          <p>Total: <strong style="color: var(--success)">Rs ${total.toFixed(2)}</strong></p>
        </div>
        <button class="btn-primary" style="width: auto; padding: 10px 20px; font-size: 0.9rem;" onclick="completeOrder('${order.id}')">Mark Completed</button>
      </div>
    </div>
  `;
  }).join('');
}

window.completeOrder = async (id) => {
  try {
    await deleteDoc(doc(db, ORDER_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting order: ", error);
    alert("Could not complete order. Please check permissions.");
  }
};

// Listen for updates from Firestore.
const q = query(collection(db, ORDER_COLLECTION));
onSnapshot(q, (snapshot) => {
  const orders = [];
  snapshot.forEach((doc) => {
    orders.push({ id: doc.id, ...doc.data() });
  });
  orders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  renderOrders(orders);
}, (error) => {
  console.error("Error fetching orders: ", error);
  const container = document.getElementById('orders-container');
  container.innerHTML = '<div class="glass-card" style="text-align: center;"><p style="color: var(--error)">Error loading orders. Ensure Firestore is created and rules allow read access for this app.</p></div>';
});
