import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, Flame, ShoppingBag, TimerReset, UsersRound } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';

export default function LandingPage() {
  return (
    <div className="page-shell">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-green-600 text-white"><TimerReset /></span>
          <span className="text-2xl font-black text-stone-950">CampusQ</span>
        </Link>
        <div className="flex gap-2">
          <Link to="/login"><Button variant="ghost">Login</Button></Link>
          <Link to="/signup"><Button>Start demo</Button></Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge tone="orange">Smart Pickup Slot System</Badge>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight text-stone-950 md:text-7xl">
              Campus food orders without the queue.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
              CampusQ lets students pre-order, reserve pickup slots, pay online, and track canteen orders live so breaks stay productive.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup"><Button className="w-full sm:w-auto" size="lg">Create account <ArrowRight size={18} /></Button></Link>
              <Link to="/login"><Button className="w-full sm:w-auto" variant="outline" size="lg">Open live demo</Button></Link>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-5">
            <div className="rounded-[1.5rem] bg-stone-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-300">Current queue</p>
                  <p className="text-4xl font-black">12 min</p>
                </div>
                <Badge tone="green">Live</Badge>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {['12:15', '12:30', '12:45'].map((slot) => (
                  <div key={slot} className="rounded-2xl bg-white/10 p-3 text-center">
                    <p className="text-xs text-stone-300">Pickup</p>
                    <p className="font-black">{slot}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-green-500 p-4">
                <p className="text-sm font-bold">Estimated waiting time reduced by 65%</p>
                <div className="mt-3 h-2 rounded-full bg-white/30"><div className="h-2 w-[65%] rounded-full bg-white" /></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-3">
          {[
            ['Problem', 'Students lose break time standing in canteen lines.', UsersRound],
            ['Solution', 'Pre-order with pickup slots and live status updates.', ShoppingBag],
            ['Impact', 'Queue pressure drops with predictable pickup windows.', Clock3]
          ].map(([title, text, Icon]) => (
            <Card key={title} className="transition hover:-translate-y-1 hover:shadow-xl">
              <Icon className="text-green-600" />
              <h3 className="mt-4 text-xl font-black">{title}</h3>
              <p className="mt-2 text-stone-600">{text}</p>
            </Card>
          ))}
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10">
          <Card className="grid gap-6 bg-green-600 text-white md:grid-cols-4">
            {['Live order updates', 'Pickup slot scheduling', 'Estimated wait time', 'Live order counter'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Flame />
                <p className="font-bold">{item}</p>
              </div>
            ))}
          </Card>
        </section>
      </main>
    </div>
  );
}
