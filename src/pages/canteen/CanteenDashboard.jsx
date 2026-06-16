import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Flame, ShoppingBag } from 'lucide-react';
import api from '../../lib/api.js';
import { MetricCard } from '../../components/MetricCard.jsx';
import { Card } from '../../components/ui/Card.jsx';

export default function CanteenDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;
    // Note: If a canteen logs in, we should ideally fetch only their orders.
    // For now, mirroring the original logic which fetches globally/filtered by status.
    api.get('/orders').then(res => {
      if (!isMounted) return;
      const validStatuses = ['placed', 'accepted', 'preparing', 'ready', 'completed'];
      setOrders(res.data.filter(o => validStatuses.includes(o.status)));
    }).catch(console.error);
    
    return () => { isMounted = false; };
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
