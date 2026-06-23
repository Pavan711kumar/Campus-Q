import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatCurrency } from '../../lib/utils.js';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { OrderStatus } from '../../components/OrderStatus.jsx';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;
    api.get('/orders', { params: { studentId: user.uid } })
      .then(res => {
        if (!isMounted) return;
        const rows = res.data;
        rows.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setOrders(rows);
      })
      .catch(async err => {
        console.error('API failed, trying Firestore for orders:', err);
        try {
          const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore');
          const { app } = await import('../../lib/firebase.js');
          const db = getFirestore(app);
          const q = query(collection(db, 'orders'), where('studentId', '==', user.uid));
          const snapshot = await getDocs(q);
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
  }, [user]);

  return (
    <div className="space-y-5">
      <h1 className="text-4xl font-black">Live order tracking</h1>
      {!orders.length && <Card className="text-center text-stone-600">No orders yet. Place one from the menu.</Card>}
      {orders.map((order) => (
        <Card key={order.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge tone="orange">Pickup {order.pickupSlot}</Badge>
              <h2 className="mt-3 text-xl font-black">{order.canteenName}</h2>
              <p className="text-sm text-stone-500">Payment: {order.paymentStatus} | {formatCurrency(order.total)}</p>
            </div>
            <Badge tone={order.status === 'ready' ? 'green' : order.status === 'rejected' ? 'red' : 'stone'}>{order.status}</Badge>
          </div>
          <div className="mt-4">
            <OrderStatus status={order.status} />
          </div>
          <ul className="mt-4 text-sm text-stone-600">
            {(order.items || []).map((item) => <li key={item.id}>{item.quantity} x {item.name}</li>)}
          </ul>
        </Card>
      ))}
    </div>
  );
}
