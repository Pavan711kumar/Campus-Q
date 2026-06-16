import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase.js';
import api from '../../lib/api.js';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { getAuthErrorMessage } from '../../lib/authErrors.js';

export default function SignupPage() {
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', rollNumber: '', canteenName: '', email: '', password: '' });
  const navigate = useNavigate();
  const { notify } = useToast();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const displayName = role === 'canteen' ? form.canteenName : form.name;
      await updateProfile(credential.user, { displayName });

      await api.post(`/users/${credential.user.uid}`, {
        name: displayName,
        email: form.email,
        rollNumber: role === 'student' ? form.rollNumber : '',
        role,
        disabled: false,
        createdAt: new Date().toISOString()
      });

      if (role === 'canteen') {
        await api.post('/canteens', {
          id: credential.user.uid,
          name: form.canteenName,
          ownerId: credential.user.uid,
          email: form.email,
          isOpen: true,
          waitTime: 10,
          liveOrders: 0,
          location: 'Campus Block',
          createdAt: new Date().toISOString()
        });
      }

      notify('Account created');
      navigate(`/${role}`);
    } catch (error) {
      notify(getAuthErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <Link to="/" className="text-2xl font-black text-green-700">CampusQ</Link>
        <h1 className="mt-6 text-3xl font-black text-stone-950">Create your account</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student Signup</option>
            <option value="canteen">Canteen Signup</option>
            <option value="admin">Admin Signup</option>
          </Select>
          {role === 'canteen' ? (
            <Input placeholder="Canteen name" value={form.canteenName} onChange={(e) => setForm({ ...form, canteenName: e.target.value })} required />
          ) : (
            <>
              <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              {role === 'student' && <Input placeholder="Roll number" value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} required />}
            </>
          )}
          <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input type="password" placeholder="Password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</Button>
        </form>
        <p className="mt-5 text-center text-sm text-stone-600">Already registered? <Link className="font-bold text-green-700" to="/login">Login</Link></p>
      </Card>
    </div>
  );
}
