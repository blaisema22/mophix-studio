import { useAuthStore } from '../store';

const MyProfile = () => {
  const { user } = useAuthStore();
  const profile = user;

  if (!user) {
    return (
      <section className="container mx-auto px-4 py-12">
        <p className="text-gray-600">No profile information found.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="card p-10">
        <h1 className="section-title">My Profile</h1>
        <p className="section-subtitle">Manage your account details and personal information.</p>
        <div className="grid gap-6 mt-8 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">First Name</p>
            <p className="font-semibold text-dark">{profile.first_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Name</p>
            <p className="font-semibold text-dark">{profile.last_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold text-dark">{profile.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-semibold text-dark capitalize">{profile.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
