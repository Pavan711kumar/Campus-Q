import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { formatCurrency } from '../../lib/utils.js';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';

const defaultImageUrl = '/images/paneer-wrap.svg';
const fallbackImagesByName = {
  'veg biryani': '/images/veg-biryani.svg',
  'mutton dum biryani': '/images/veg-biryani.svg',
  meals: '/images/veg-biryani.svg',
  tea: '/images/cold-coffee.svg',
  'chicken biryani': '/images/veg-biryani.svg',
  'cold coffee': '/images/cold-coffee.svg',
  'masala dosa': '/images/masala-dosa.svg'
};

function fallbackImageFor(item) {
  return fallbackImagesByName[item.name?.toLowerCase()] || defaultImageUrl;
}

export default function CartPage() {
  const { items, addItem, decreaseItem, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-black">Your cart is empty</h1>
        <p className="mt-2 text-stone-600">Add food items and reserve a pickup slot.</p>
        <Link to="/student/menu"><Button className="mt-6">Browse menu</Button></Link>
      </Card>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <h1 className="text-4xl font-black">Cart</h1>
        {items.map((item) => (
          <Card key={item.id} className="flex items-center gap-4">
            <img src={item.imageUrl || fallbackImageFor(item)} alt={item.name} onError={(event) => { event.currentTarget.src = fallbackImageFor(item); }} className="h-20 w-20 rounded-xl object-cover" />
            <div className="flex-1">
              <h3 className="font-black">{item.name}</h3>
              <p className="text-sm text-stone-500">{formatCurrency(item.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => decreaseItem(item.id)}><Minus size={14} /></Button>
              <span className="w-8 text-center font-black">{item.quantity}</span>
              <Button size="sm" variant="outline" onClick={() => addItem(item)}><Plus size={14} /></Button>
              <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}><Trash2 size={15} /></Button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="h-fit">
        <h2 className="text-2xl font-black">Order summary</h2>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><b>{formatCurrency(total)}</b></div>
          <div className="flex justify-between"><span>Platform fee</span><b>{formatCurrency(0)}</b></div>
          <div className="border-t pt-3 flex justify-between text-lg"><span>Total</span><b>{formatCurrency(total)}</b></div>
        </div>
        <Button className="mt-6 w-full" onClick={() => navigate('/student/checkout')}>Choose pickup slot</Button>
      </Card>
    </div>
  );
}
