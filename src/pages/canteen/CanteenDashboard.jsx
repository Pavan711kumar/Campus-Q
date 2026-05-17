import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { CheckCircle2, Clock3, Flame, ShoppingBag } from 'lucide-react';
import { db, collections } from '../../lib/firebase.js';
import { MetricCard } from '../../components/MetricCard.jsx';
import { Card } from '../../components/ui/Card.jsx';

export default function CanteenDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, collections.orders), where('status', 'in', ['placed', 'accepted', 'preparing', 'ready', 'completed']));
    return onSnapshot(q, (snapshot) => setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))));
  }, []);

  const stats = useMemo(() => ({
    incoming: orders.filter((order) => order.status === 'placed').length,
    active: orders.filter((order) => ['accepted', 'preparing', 'ready'].includes(order.status)).length,
    completed: orders.filter((order) => order.status === 'completed').length
  }), [orders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black">Canteen dashboard</h1>
        <p className="mt-2 text-stone-600">Realtime operator view for faster pickup batches.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Incoming" value={stats.incoming} helper="Needs action" icon={<Flame />} />
        <MetricCard label="Active" value={stats.active} helper="Accepted/preparing/ready" icon={<ShoppingBag />} />
        <MetricCard label="Completed" value={stats.completed} helper="Today demo counter" icon={<CheckCircle2 />} />
      </div>
      <Card>
        <div className="flex items-center gap-3">
          <Clock3 className="text-green-600" />
          <div>
            <h2 className="text-xl font-black">Smart slot load</h2>
            <p className="text-sm text-stone-500">Pickup slots help the canteen prepare orders in predictable batches.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
