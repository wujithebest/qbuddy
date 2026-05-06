import React from 'react';
import { CONTACT_LISTS } from '../../data/mockData';
import './ContactList.css';

export default function ContactList({ role, onContactClick }) {
  const contactGroups = role?.id ? (CONTACT_LISTS[role.id] || []) : [];
  
  const totalContacts = contactGroups.reduce((sum, group) => sum + group.contacts.length, 0);
  
  const handleContactClick = (contact) => {
    if (onContactClick) {
      onContactClick(contact);
    }
  };
  
  return (
    <div className="contact-list">
      <div className="contact-header">
        <span>联系人</span>
        <span className="contact-count">{totalContacts}</span>
      </div>
      
      <div className="contact-search">
        <span className="search-icon">🔍</span>
        <span>搜索</span>
      </div>
      
      <div className="contact-groups">
        {contactGroups.map((group) => (
          <div key={group.category} className="contact-group">
            <div className="group-header">
              <span>{group.category}</span>
              <span className="group-count">{group.contacts.length}</span>
            </div>
            {group.contacts.map((contact) => (
              <div 
                key={contact.name} 
                className="contact-item"
                onClick={() => handleContactClick(contact)}
              >
                <span className="contact-avatar">{contact.avatar}</span>
                <span className="contact-name">{contact.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
