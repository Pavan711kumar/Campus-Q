const statuses = ['placed', 'accepted', 'preparing', 'ready', 'completed'];
const labels = {
  placed: 'Order Placed',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  completed: 'Completed',
  rejected: 'Rejected'
};

export function OrderStatus({ status }) {
  if (status === 'rejected') {
    return <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-700">Rejected</p>;
  }

  const current = statuses.indexOf(status);
  return (
    <div className="grid gap-2 sm:grid-cols-5">
      {statuses.map((item, index) => (
        <div key={item} className={`rounded-xl px-3 py-2 text-center text-xs font-bold ${index <= current ? 'bg-green-600 text-white' : 'bg-stone-100 text-stone-500'}`}>
          {labels[item]}
        </div>
      ))}
    </div>
  );
}
