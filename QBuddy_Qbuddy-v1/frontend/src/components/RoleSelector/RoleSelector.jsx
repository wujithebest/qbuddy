import React from 'react';
import { ROLES } from '../../data/mockData';
import './RoleSelector.css';

export default function RoleSelector({ selectedRole, onSelect }) {
  return (
    <div className="role-selector">
      <h3 className="role-title">👤 选择体验角色</h3>
      <div className="role-cards">
        {ROLES.map((role) => (
          <div
            key={role.id}
            className={`role-card ${selectedRole?.id === role.id ? 'active' : ''}`}
            onClick={() => onSelect(role)}
          >
            <div className="role-avatar">{role.avatar}</div>
            <div className="role-info">
              <div className="role-name">{role.name}</div>
              <div className="role-grade">{role.grade} · {role.major}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
