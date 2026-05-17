import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage, collections } from '../../lib/firebase.js';
import { sampleCanteens, sampleMenuItems } from '../../data/sampleData.js';
import { formatCurrency } from '../../lib/utils.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

const initialForm = { name: '', price: '', prepTime: '', category: 'Snacks', imageUrl: '' };

export default function MenuManagementPage() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    return onSnapshot(collection(db, collections.menuItems), (snapshot) => {
      setItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
  }, []);

  async function addItem(event) {
    event.preventDefault();
    setLoading(true);
    let imageUrl = form.imageUrl || '/images/burger.png';

    if (file) {
      const fileRef = ref(storage, `menuItems/${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      imageUrl = await getDownloadURL(fileRef);
    }

    await addDoc(collection(db, collections.menuItems), {
      name: form.name,
      price: Number(form.price),
      prepTime: Number(form.prepTime),
      category: form.category,
      imageUrl,
      available: true,
      canteenId: user.uid,
      canteenName: profile?.name || 'Campus Canteen',
      createdAt: serverTimestamp()
    });

    setForm(initialForm);
    setFile(null);
    setLoading(false);
    notify('Menu item added');
  }

  async function seedSampleData() {
    await Promise.all(sampleCanteens.map((canteen) => addDoc(collection(db, collections.canteens), canteen)));
    await Promise.all(sampleMenuItems.map((item) => addDoc(collection(db, collections.menuItems), { ...item, createdAt: serverTimestamp() })));
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
          <Input placeholder="Image URL optional" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
          <Button className="w-full" disabled={loading}>{loading ? 'Saving...' : 'Add item'}</Button>
          <Button className="w-full" type="button" variant="outline" onClick={seedSampleData}>Add sample test data</Button>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex gap-4">
              <img src={item.imageUrl || '/images/burger.png'} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-black">{item.name}</h2>
                  <Badge tone={item.available ? 'green' : 'red'}>{item.available ? 'Available' : 'Off'}</Badge>
                </div>
                <p className="text-sm text-stone-500">{formatCurrency(item.price)} | {item.prepTime} min</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateDoc(doc(db, collections.menuItems, item.id), { available: !item.available })}>
                    {item.available ? 'Mark unavailable' : 'Mark available'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteDoc(doc(db, collections.menuItems, item.id))}>Remove</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
