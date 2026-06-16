import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, ShoppingBag, Store, UsersRound } from 'lucide-react';
import api from '../../lib/api.js';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { MetricCard } from '../../components/MetricCard.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const { notify } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    api.get('/users').then(res => {
      if (isMounted) setUsers(res.data);
    }).catch(console.error);
    
    api.get('/orders').then(res => {
      if (isMounted) setOrders(res.data);
    }).catch(console.error);

    return () => { isMounted = false; };
  }, []);

  const stats = useMemo(() => ({
    totalUsers: users.length,
    canteens: users.filter((user) => user.role === 'canteen').length,
    totalOrders: orders.length,
    activeOrders: orders.filter((order) => ['placed', 'accepted', 'preparing', 'ready'].includes(order.status)).length
  }), [users, orders]);

  async function toggleUser(user) {
    try {
      await api.put(`/users/${user.id}`, { disabled: !user.disabled });
      setUsers(users.map(u => u.id === user.id ? { ...u, disabled: !user.disabled } : u));
      notify(user.disabled ? 'User enabled' : 'User disabled');
    } catch (e) {
      notify('Failed to update user', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black">Admin dashboard</h1>
        <p className="mt-2 text-stone-600">Minimal controls for users, canteens, and live order load.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Users" value={stats.totalUsers} icon={<UsersRound />} />
        <MetricCard label="Canteens" value={stats.canteens} icon={<Store />} />
        <MetricCard label="Orders" value={stats.totalOrders} icon={<ShoppingBag />} />
        <MetricCard label="Active" value={stats.activeOrders} icon={<ShieldCheck />} />
      </div>
      <Card>
        <h2 className="text-2xl font-black">Users</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-stone-500">
              <tr>
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="py-3 font-bold">{user.name}</td>
                  <td>{user.email}</td>
                  <td><Badge tone="stone">{user.role}</Badge></td>
                  <td><Badge tone={user.disabled ? 'red' : 'green'}>{user.disabled ? 'Disabled' : 'Active'}</Badge></td>
                  <td className="text-right"><Button size="sm" variant="outline" onClick={() => toggleUser(user)}>{user.disabled ? 'Enable' : 'Disable'}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
