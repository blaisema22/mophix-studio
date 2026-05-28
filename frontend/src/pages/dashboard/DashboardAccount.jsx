import { useState } from 'react';
import { useAuthStore } from '../../store';

const DashboardAccount = () => {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(user || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    updateUser(profile);
    setMessage('Profile updates saved locally.');
    setSaving(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">Account</h1>
        <p className="section-subtitle">Update your profile information and manage your account settings.</p>
      </div>
      <form onSubmit={handleSave} className="space-y-6 rounded-[1.75rem] border border-orange-400/20 bg-black-dark p-8 shadow-xl">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/70">
            First Name
            <input
              type="text"
              name="first_name"
              value={profile.first_name || ''}
              onChange={handleChange}
              className="input-field auth-input"
            />
          </label>
          <label className="space-y-2 text-sm text-white/70">
            Last Name
            <input
              type="text"
              name="last_name"
              value={profile.last_name || ''}
              onChange={handleChange}
              className="input-field auth-input"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm text-white/70 block">
          Email
          <input
            type="email"
            name="email"
            value={profile.email || ''}
            onChange={handleChange}
            className="input-field auth-input"
          />
        </label>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save changes'}
        </button>
        {message && <p className="text-sm text-green-300">{message}</p>}
      </form>
    </div>
  );
};

export default DashboardAccount;
