import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { getAuthErrorMessage } from '../../lib/authErrors.js';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { notify } = useToast();
  const { profile } = useAuth();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      notify('Logged in successfully');
      window.setTimeout(() => navigate(`/${profile?.role || form.role}`), 200);
    } catch (error) {
      notify(getAuthErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <Link to="/" className="text-2xl font-black text-green-700">CampusQ</Link>
        <h1 className="mt-6 text-3xl font-black text-stone-950">Welcome back</h1>
        <p className="mt-2 text-stone-600">Login as student, canteen owner, or admin.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="student">Student Login</option>
            <option value="canteen">Canteen Login</option>
            <option value="admin">Admin Login</option>
          </Select>
          <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button className="w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
        </form>
        <p className="mt-5 text-center text-sm text-stone-600">New here? <Link className="font-bold text-green-700" to="/signup">Create account</Link></p>
      </Card>
    </div>
  );
}
