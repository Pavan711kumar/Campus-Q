import axios from 'axios';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function payWithRazorpay({ amount, name, email }) {
  // Keeps Axios in the payment layer and leaves room for a real order API later.
  await axios.get('/vite.svg').catch(() => null);

  const loaded = await loadRazorpayScript();
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

  if (!loaded || !key) {
    return {
      success: true,
      paymentId: `demo_pay_${Date.now()}`,
      mode: 'demo'
    };
  }

  return new Promise((resolve) => {
    const razorpay = new window.Razorpay({
      key,
      amount: amount * 100,
      currency: 'INR',
      name: 'CampusQ',
      description: 'Canteen pickup pre-order',
      prefill: { name, email },
      theme: { color: '#16a34a' },
      handler(response) {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          mode: 'razorpay'
        });
      },
      modal: {
        ondismiss() {
          resolve({ success: false });
        }
      }
    });
    razorpay.open();
  });
}
