import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Clock3, Store, TimerReset, Utensils } from 'lucide-react';
import { db, collections } from '../../lib/firebase.js';
import { sampleCanteens, sampleMenuItems } from '../../data/sampleData.js';
import { estimatedWaitTime } from '../../lib/utils.js';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { MetricCard } from '../../components/MetricCard.jsx';

export default function StudentDashboard() {
  const [canteens, setCanteens] = useState(sampleCanteens);
  const [activeOrders, setActiveOrders] = useState(0);

  useEffect(() => {
    const unsubCanteens = onSnapshot(collection(db, collections.canteens), (snapshot) => {
      const rows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (rows.length) setCanteens(rows);
    });
    const unsubOrders = onSnapshot(query(collection(db, collections.orders), where('status', 'in', ['placed', 'accepted', 'preparing', 'ready'])), (snapshot) => {
      setActiveOrders(snapshot.size);
    });
    return () => {
      unsubCanteens();
      unsubOrders();
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="bg-stone-950 p-8 text-white">
          <Badge tone="orange">Smart Pickup Slots</Badge>
          <h1 className="mt-4 text-4xl font-black">Order before you reach the canteen.</h1>
          <p className="mt-3 max-w-2xl text-stone-300">Choose a pickup window, pay online, and watch your status update live.</p>
          <Link to="/student/menu"><Button className="mt-6" variant="orange">Browse menu</Button></Link>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-stone-500">CampusQ Impact</p>
          <p className="mt-2 text-4xl font-black text-green-700">65%</p>
          <p className="font-bold text-stone-900">Estimated waiting time reduced</p>
          <div className="mt-5 h-3 rounded-full bg-stone-100"><div className="h-3 w-[65%] rounded-full bg-green-600" /></div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Live orders" value={activeOrders} helper="Realtime counter" icon={<Utensils />} />
        <MetricCard label="Estimated wait" value={`${estimatedWaitTime(activeOrders)} min`} helper="Based on active orders" icon={<Clock3 />} />
        <MetricCard label="Pickup slots" value="15 min" helper="Optimized batches" icon={<TimerReset />} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black">Open canteens</h2>
          <Link className="font-bold text-green-700" to="/student/menu">View all items</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {canteens.map((canteen) => (
            <Card key={canteen.id} className="transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Store className="text-green-600" />
                  <h3 className="mt-3 text-xl font-black">{canteen.name}</h3>
                  <p className="text-sm text-stone-500">{canteen.location}</p>
                </div>
                <Badge tone={canteen.isOpen ? 'green' : 'red'}>{canteen.isOpen ? 'Open' : 'Closed'}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-green-50 p-3"><b>{canteen.waitTime || 10} min</b><br />wait time</div>
                <div className="rounded-xl bg-orange-50 p-3"><b>{canteen.liveOrders || 0}</b><br />live orders</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-black">Popular now</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sampleMenuItems.map((item) => (
            <Card key={item.name}>
              <img src={item.imageUrl} alt={item.name} className="h-32 w-full rounded-xl object-cover" />
              <h3 className="mt-3 font-black">{item.name}</h3>
              <p className="text-sm text-stone-500">{item.prepTime} min prep</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
