import { useState } from 'react';
import { X } from 'lucide-react';
import { kanbanStages, statusOptions, priorityOptions } from '../data/constants';

export default function EditProjectModal({ project, onClose, onSaved }) {
  const [form, setForm] = useState({
    status: project.status,
    statusNote: project.statusNote || '',
    completedStoryPoints: project.completedStoryPoints,
    totalStoryPoints: project.totalStoryPoints,
    kanbanStage: project.kanbanStage,
    priority: project.priority,
    uatDate: project.uatDate || '',
    prodDate: project.prodDate || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          completedStoryPoints: Number(form.completedStoryPoints),
          totalStoryPoints: Number(form.totalStoryPoints),
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
          <h3>Update Project — {project.name}</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => handleChange('status', e.target.value)}>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={form.priority} onChange={e => handleChange('priority', e.target.value)}>
                {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Kanban Stage</label>
              <select value={form.kanbanStage} onChange={e => handleChange('kanbanStage', e.target.value)}>
                {kanbanStages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Status Note / Blockers</label>
            <textarea rows="3" value={form.statusNote} onChange={e => handleChange('statusNote', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Completed Story Points</label>
              <input type="number" min="0" value={form.completedStoryPoints} onChange={e => handleChange('completedStoryPoints', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Total Story Points</label>
              <input type="number" min="0" value={form.totalStoryPoints} onChange={e => handleChange('totalStoryPoints', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>UAT Date</label>
              <input type="date" value={form.uatDate} onChange={e => handleChange('uatDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Production / LIVE Date</label>
              <input type="date" value={form.prodDate} onChange={e => handleChange('prodDate', e.target.value)} />
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
