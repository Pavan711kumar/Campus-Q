import { Card } from './ui/Card.jsx';

export function MetricCard({ label, value, helper, icon }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-stone-500">{label}</p>
        <p className="mt-1 text-3xl font-black text-stone-950">{value}</p>
        {helper && <p className="mt-1 text-xs font-semibold text-green-700">{helper}</p>}
      </div>
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-green-50 text-green-700">{icon}</div>
    </Card>
  );
}
