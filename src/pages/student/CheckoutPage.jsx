import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../../lib/api.js';
import { payWithRazorpay } from '../../lib/razorpay.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { formatCurrency, nextPickupSlots } from '../../lib/utils.js';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Select } from '../../components/ui/Input.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export default function CheckoutPage() {
  const { user, profile } = useAuth();
  const { items, total, clearCart } = useCart();
  const [slot, setSlot] = useState(nextPickupSlots()[0]);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();
  const { notify } = useToast();

  async function placeOrder() {
    if (!items.length) {
      navigate('/student/menu');
      return;
    }

    setLoading(true);
    const payment = await payWithRazorpay({ amount: total, name: profile?.name, email: user?.email });
    if (!payment.success) {
      setLoading(false);
      notify('Payment cancelled', 'error');
      return;
    }

    const orderData = {
      studentId: user.uid,
      studentName: profile?.name || user.email,
      studentEmail: user.email,
      items: items.map(({ id, name, price, quantity, canteenId, canteenName, prepTime }) => ({ id, name, price, quantity, canteenId, canteenName, prepTime })),
      canteenId: items[0]?.canteenId || 'central-canteen',
      canteenName: items[0]?.canteenName || 'Central Canteen',
      pickupSlot: slot,
      status: 'placed',
      paymentStatus: 'paid',
      paymentId: payment.paymentId,
      paymentMode: payment.mode,
      total,
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    try {
      await api.post('/orders', orderData);
    } catch (error) {
      console.error("API failed, falling back to Firestore", error);
      try {
        const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore');
        const { app } = await import('../../lib/firebase.js');
        const db = getFirestore(app);
        orderData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'orders'), orderData);
      } catch (fbError) {
        console.error("Firestore fallback failed", fbError);
        notify("Failed to place order. Please try again.", "error");
        setLoading(false);
        return;
      }
    }

    clearCart();
    setConfirmed(true);
    setLoading(false);
    notify('Order placed. Live tracking started.');
    window.setTimeout(() => navigate('/student/orders'), 1200);
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <h1 className="text-4xl font-black">Checkout</h1>
        <p className="mt-2 text-stone-600">Reserve a pickup slot and skip the physical queue.</p>
        <div className="mt-6">
          <label className="text-sm font-bold text-stone-700">Pickup slot</label>
          <Select className="mt-2" value={slot} onChange={(event) => setSlot(event.target.value)}>
            {nextPickupSlots().map((item) => <option key={item}>{item}</option>)}
          </Select>
        </div>
        <div className="mt-6 rounded-2xl bg-green-50 p-4 text-green-800">
          <b>Estimated waiting time reduced by 65%</b>
          <p className="mt-1 text-sm">Your order enters a planned pickup queue instead of a walk-in line.</p>
        </div>
        {confirmed && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-4 text-green-700 shadow-sm">
            <CheckCircle2 /> <b>Order confirmed. Redirecting to live tracking...</b>
          </div>
        )}
      </Card>
      <Card className="h-fit">
        <h2 className="text-2xl font-black">Payment</h2>
        <div className="mt-5 flex justify-between border-b pb-4"><span>Total</span><b>{formatCurrency(total)}</b></div>
        <p className="mt-4 text-sm text-stone-500">Razorpay Test Mode is used when `VITE_RAZORPAY_KEY_ID` is set. Without a key, CampusQ uses demo payment mode for hackathon stability.</p>
        <Button className="mt-6 w-full" onClick={placeOrder} disabled={loading}>{loading ? 'Processing...' : 'Pay and place order'}</Button>
      </Card>
    </div>
  );
}
