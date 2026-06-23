import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { formatCurrency } from '../../lib/utils.js';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

const actions = {
  placed: [['Accept', 'accepted', 'primary'], ['Reject', 'rejected', 'danger']],
  accepted: [['Mark Preparing', 'preparing', 'orange']],
  preparing: [['Mark Ready', 'ready', 'primary']],
  ready: [['Complete', 'completed', 'outline']]
};

export default function IncomingOrdersPage() {
  const [orders, setOrders] = useState([]);
  const { notify } = useToast();

  useEffect(() => {
    let isMounted = true;
    api.get('/orders').then(res => {
      if (!isMounted) return;
      const rows = res.data;
      rows.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setOrders(rows);
    }).catch(async err => {
      console.error('API failed, trying Firestore:', err);
      try {
        const { getFirestore, collection, getDocs } = await import('firebase/firestore');
        const { app } = await import('../../lib/firebase.js');
        const db = getFirestore(app);
        const snapshot = await getDocs(collection(db, 'orders'));
        const rows = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (isMounted) {
          rows.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          setOrders(rows);
        }
      } catch (fbErr) {
        console.error('Firestore fallback failed:', fbErr);
      }
    });
    return () => { isMounted = false; };
  }, []);

  async function updateStatus(orderId, status) {
    try {
      await api.put(`/orders/${orderId}`, { status, updatedAt: Date.now() });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o));
      notify(`Order marked ${status}`);
    } catch (e) {
      console.error('API failed, trying Firestore:', e);
      try {
        const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
        const { app } = await import('../../lib/firebase.js');
        const db = getFirestore(app);
        await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: Date.now() });
        setOrders(orders.map(o => o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o));
        notify(`Order marked ${status}`);
      } catch (fbErr) {
        notify('Failed to update order', 'error');
      }
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-black">Incoming orders</h1>
          <p className="mt-2 text-stone-600">Accept, prepare, and mark ready in realtime.</p>
        </div>
        <Badge tone="green">{orders.filter((order) => order.status !== 'completed').length} live</Badge>
      </div>
      {!orders.length && <Card className="text-center text-stone-600">No live orders yet.</Card>}
      <div className="grid gap-4 lg:grid-cols-2">
        {orders.map((order) => (
          <Card key={order.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge tone="orange">Pickup {order.pickupSlot}</Badge>
                <h2 className="mt-3 text-xl font-black">{order.studentName}</h2>
                <p className="text-sm text-stone-500">Payment: {order.paymentStatus} | {formatCurrency(order.total)}</p>
              </div>
              <Badge tone={order.status === 'rejected' ? 'red' : order.status === 'ready' ? 'green' : 'stone'}>{order.status}</Badge>
            </div>
            <ul className="mt-4 rounded-2xl bg-stone-50 p-4 text-sm">
              {(order.items || []).map((item) => <li key={item.id} className="font-semibold">{item.quantity} x {item.name}</li>)}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {(actions[order.status] || []).map(([label, status, variant]) => (
                <Button key={status} size="sm" variant={variant} onClick={() => updateStatus(order.id, status)}>{label}</Button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
