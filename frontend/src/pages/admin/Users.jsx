import React, { useEffect, useState } from 'react';
import { usersService } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersService.getAll();
      setUsers(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError(err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (id) => {
    try {
      await usersService.toggleActive(id);
      fetchUsers();
    } catch (err) {
      setError(err?.message || JSON.stringify(err));
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="section-title">User Management</h1>
      <p className="section-subtitle">Manage client and staff accounts for the photography studio.</p>

      <div className="table-card p-6 mt-8">
        {loading && <div className="p-4">Loading users...</div>}
        {error && <div className="p-4 text-red-400">Error: {error}</div>}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name || u.full_name || '—'}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button className="btn-outline mr-2">Edit</button>
                    <button className="btn-secondary" onClick={() => handleToggleActive(u.id)}>
                      {u.active === false ? 'Enable' : 'Disable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AdminUsers;
