import React from 'react';

export default function StaffStubPage({ title, subtitle }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title || 'Staff Section'}</h2>
      {subtitle ? <p className="text-sm text-gray-300">{subtitle}</p> : null}
      <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-gray-300">
        This is a placeholder page for this staff menu item.
        <br />
        Add API/data logic later.
      </div>
    </div>
  );
}

