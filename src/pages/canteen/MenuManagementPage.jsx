import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../lib/firebase.js';
import api from '../../lib/api.js';
import { sampleCanteens, sampleMenuItems } from '../../data/sampleData.js';
import { formatCurrency } from '../../lib/utils.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

const initialForm = { name: '', price: '', prepTime: '', category: 'Snacks', imageUrl: '' };
const defaultImageUrl = '/images/paneer-wrap.png';
const maxImageSize = 5 * 1024 * 1024;
const fallbackImagesByName = {
  'veg biryani': '/images/veg-biryani.png',
  'mutton dum biryani': '/images/mutton-dum-biryani.png',
  meals: '/images/meals.png',
  tea: '/images/tea.png',
  'chicken biryani': '/images/chicken-biryani.png',
  'cold coffee': '/images/cold-coffee.png',
  'masala dosa': '/images/masala-dosa.png'
};

function fallbackImageFor(item) {
  return fallbackImagesByName[item.name?.toLowerCase()] || defaultImageUrl;
}

function safeFileName(fileName) {
  return fileName.replace(/[^a-z0-9._-]/gi, '-').toLowerCase();
}

function uploadErrorMessage(error) {
  if (error?.code === 'storage/unauthorized') {
    return 'Upload blocked. Deploy Firebase Storage rules and make sure you are logged in as canteen owner.';
  }

  return error?.message || 'Could not add menu item. Please try again.';
}

export default function MenuManagementPage() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { notify } = useToast();

  const fetchItems = () => {
    api.get('/menuItems').then(res => setItems(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  async function addItem(event) {
    event.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        throw new Error('Please log in before adding menu items.');
      }

      let imageUrl = form.imageUrl.trim() || defaultImageUrl;

      if (file) {
        if (!file.type.startsWith('image/')) {
          throw new Error('Please choose a valid image file.');
        }

        if (file.size > maxImageSize) {
          throw new Error('Image must be smaller than 5 MB.');
        }

        const fileRef = ref(storage, `menuItems/${user.uid}/${Date.now()}-${safeFileName(file.name)}`);
        await uploadBytes(fileRef, file, { contentType: file.type });
        imageUrl = await getDownloadURL(fileRef);
      }

      const newItemData = {
        name: form.name.trim(),
        price: Number(form.price),
        prepTime: Number(form.prepTime),
        category: form.category,
        imageUrl,
        available: true,
        canteenId: user.uid,
        canteenName: profile?.name || 'Campus Canteen',
        createdAt: new Date().toISOString()
      };

      const res = await api.post('/menuItems', newItemData);
      setItems([...items, { id: res.data.id, ...newItemData }]);

      setForm(initialForm);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      notify('Menu item added');
    } catch (error) {
      notify(uploadErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  async function seedSampleData() {
    await Promise.all(sampleCanteens.map((canteen) => api.post('/canteens', canteen)));
    await Promise.all(sampleMenuItems.map((item) => api.post('/menuItems', { ...item, createdAt: new Date().toISOString() })));
    fetchItems();
    notify('Sample canteens and menu added');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="h-fit">
        <h1 className="text-2xl font-black">Menu management</h1>
        <form onSubmit={addItem} className="mt-5 space-y-3">
          <Input placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <Input type="number" placeholder="Prep time in minutes" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} required />
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="Snacks">Snacks</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Meals">Meals</option>
            <option value="Beverages">Beverages</option>
          </Select>
          <Input placeholder="Image URL optional" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <Input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button className="w-full" disabled={loading}>{loading ? 'Saving...' : 'Add item'}</Button>
          <Button className="w-full" type="button" variant="outline" onClick={seedSampleData}>Add sample test data</Button>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex gap-4">
              <img src={item.imageUrl || fallbackImageFor(item)} alt={item.name} onError={(event) => { event.currentTarget.src = fallbackImageFor(item); }} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-black">{item.name}</h2>
                  <Badge tone={item.available ? 'green' : 'red'}>{item.available ? 'Available' : 'Off'}</Badge>
                </div>
                <p className="text-sm text-stone-500">{formatCurrency(item.price)} | {item.prepTime} min</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={async () => {
                    await api.put(`/menuItems/${item.id}`, { available: !item.available });
                    setItems(items.map(i => i.id === item.id ? { ...i, available: !i.available } : i));
                  }}>
                    {item.available ? 'Mark unavailable' : 'Mark available'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={async () => {
                    await api.delete(`/menuItems/${item.id}`);
                    setItems(items.filter(i => i.id !== item.id));
                  }}>Remove</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
