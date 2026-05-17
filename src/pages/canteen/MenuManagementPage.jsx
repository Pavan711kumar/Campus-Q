import { useEffect, useRef, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage, collections } from '../../lib/firebase.js';
import { sampleCanteens, sampleMenuItems } from '../../data/sampleData.js';
import { formatCurrency } from '../../lib/utils.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

const initialForm = { name: '', price: '', prepTime: '', category: 'Snacks', imageUrl: '' };
const defaultImageUrl = '/images/paneer-wrap.svg';
const maxImageSize = 5 * 1024 * 1024;
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

  useEffect(() => {
    return onSnapshot(collection(db, collections.menuItems), (snapshot) => {
      setItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
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

      await addDoc(collection(db, collections.menuItems), {
        name: form.name.trim(),
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
      if (fileInputRef.current) fileInputRef.current.value = '';
      notify('Menu item added');
    } catch (error) {
      notify(uploadErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
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
