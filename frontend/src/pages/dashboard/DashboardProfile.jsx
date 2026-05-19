import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { usersService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const response = await usersService.getById(user.user_id);
        setProfile(response.data || response || {});
      } catch (err) {
        console.error(err);
        setError('Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');

    try {
      const response = await usersService.updateProfile(user.user_id, profile);
      const updatedUser = response.data || response || profile;
      updateUser(updatedUser);
      setStatus('Profile saved successfully.');
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Unable to save profile.');
    }
  };

  if (loading) {
    return <div className="mt-10"><LoadingSpinner /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">My Profile</h1>
        <p className="section-subtitle">Edit your personal details and contact information.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-8 shadow-xl">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block text-sm text-gray-300">
            First Name
            <input type="text" name="first_name" value={profile.first_name || ''} onChange={handleChange} className="input-field mt-2 bg-[#0b0b0b]" />
          </label>
          <label className="block text-sm text-gray-300">
            Last Name
            <input type="text" name="last_name" value={profile.last_name || ''} onChange={handleChange} className="input-field mt-2 bg-[#0b0b0b]" />
          </label>
        </div>

        <label className="block text-sm text-gray-300">
          Email
          <input type="email" name="email" value={profile.email || ''} onChange={handleChange} className="input-field mt-2 bg-[#0b0b0b]" />
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block text-sm text-gray-300">
            Phone
            <input type="text" name="phone" value={profile.phone || ''} onChange={handleChange} className="input-field mt-2 bg-[#0b0b0b]" />
          </label>
          <label className="block text-sm text-gray-300">
            Date of Birth
            <input type="date" name="dob" value={profile.dob || ''} onChange={handleChange} className="input-field mt-2 bg-[#0b0b0b]" />
          </label>
        </div>

        <label className="block text-sm text-gray-300">
          Address
          <input type="text" name="address" value={profile.address || ''} onChange={handleChange} className="input-field mt-2 bg-[#0b0b0b]" />
        </label>

        <button type="submit" className="btn-primary">Save</button>
        {status && <p className="text-sm text-emerald-300">{status}</p>}
      </form>
    </div>
  );
};

export default DashboardProfile;
