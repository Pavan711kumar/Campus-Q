import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Clock3, Plus } from 'lucide-react';
import { db, collections } from '../../lib/firebase.js';
import { sampleMenuItems } from '../../data/sampleData.js';
import { formatCurrency } from '../../lib/utils.js';
import { useCart } from '../../context/CartContext.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

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

export default function MenuPage() {
  const [items, setItems] = useState(sampleMenuItems.map((item, index) => ({ id: `sample-${index}`, ...item })));
  const { addItem } = useCart();
  const { notify } = useToast();

  useEffect(() => {
    return onSnapshot(collection(db, collections.menuItems), (snapshot) => {
      const rows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (rows.length) setItems(rows);
    });
  }, []);

  return (
    <div>
      <div className="mb-6">
        <Badge tone="orange">Live menu</Badge>
        <h1 className="mt-3 text-4xl font-black">Choose your pickup-ready meal</h1>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <img src={item.imageUrl || fallbackImageFor(item)} alt={item.name} onError={(event) => { event.currentTarget.src = fallbackImageFor(item); }} className="h-40 w-full rounded-xl object-cover" />
            <div className="mt-4 flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black">{item.name}</h3>
                  <p className="text-sm text-stone-500">{item.canteenName || 'Campus Canteen'}</p>
                </div>
                <Badge tone={item.available ? 'green' : 'red'}>{item.available ? 'Available' : 'Unavailable'}</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-stone-600"><Clock3 size={15} /> {item.prepTime || 8} min</span>
                <span className="text-lg font-black text-green-700">{formatCurrency(item.price)}</span>
              </div>
              <Button
                className="mt-4 w-full"
                disabled={!item.available}
                onClick={() => {
                  addItem(item);
                  notify(`${item.name} added to cart`);
                }}
              >
                <Plus size={16} /> Add to cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
