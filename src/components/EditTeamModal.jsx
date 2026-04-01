import { useState } from 'react';
import { X } from 'lucide-react';

export default function EditTeamModal({ team, onClose, onSaved }) {
  const [form, setForm] = useState({
    engineeringManager: team.engineeringManager,
    productManager: team.productManager,
    members: team.members,
    sprintCapacity: team.sprintCapacity,
    currentUtilization: team.currentUtilization,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/teams/${team.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          members: Number(form.members),
          sprintCapacity: Number(form.sprintCapacity),
          currentUtilization: Number(form.currentUtilization),
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      onSaved();
      onClose();
    } catch {
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Team — {team.name}</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Engineering Manager</label>
            <input type="text" value={form.engineeringManager} onChange={e => handleChange('engineeringManager', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Product Manager</label>
            <input type="text" value={form.productManager} onChange={e => handleChange('productManager', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Team Size</label>
              <input type="number" min="1" value={form.members} onChange={e => handleChange('members', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Sprint Capacity (SP)</label>
              <input type="number" min="0" value={form.sprintCapacity} onChange={e => handleChange('sprintCapacity', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Current Utilization (SP)</label>
              <input type="number" min="0" value={form.currentUtilization} onChange={e => handleChange('currentUtilization', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
