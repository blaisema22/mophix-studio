import { useState } from 'react';

const DashboardChangePassword = () => {
  const [form, setForm] = useState({ current: '', password: '', confirm: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setStatus('New password and confirmation must match.');
      return;
    }
    setStatus('Password updated successfully.');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">Change Password</h1>
        <p className="section-subtitle">Update your password to keep your account secure.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[1.75rem] border border-orange-400/20 bg-black-dark p-8 shadow-xl">
        <label className="block text-sm text-white/70">
          Current Password
          <input type="password" name="current" value={form.current} onChange={handleChange} className="input-field mt-2" required />
        </label>
        <label className="block text-sm text-white/70">
          New Password
          <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field mt-2" required />
        </label>
        <label className="block text-sm text-white/70">
          Confirm Password
          <input type="password" name="confirm" value={form.confirm} onChange={handleChange} className="input-field mt-2" required />
        </label>
        <button type="submit" className="btn-primary">Save Password</button>
        {status && <p className="text-sm text-emerald-300">{status}</p>}
      </form>
    </div>
  );
};

export default DashboardChangePassword;
