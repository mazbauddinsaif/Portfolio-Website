'use client';
import { useState } from 'react';

export default function Sidebar({ data }) {
  const [expanded, setExpanded] = useState(false);
  if (!data) return null;

  return (
    <aside className={`sidebar${expanded ? ' active' : ''}`}>
      <div className="sidebar-info">
        <figure className={`avatar-box ${data.avatarShape || 'round'}`}>
          {data.avatar && <img src={data.avatar} alt={data.name} width="80" />}
        </figure>
        <div className="info-content">
          <h1 className="name" title={data.name}>{data.name}</h1>
          <p className="title">{data.title}</p>
        </div>
        <button className="info_more-btn" onClick={() => setExpanded(!expanded)}>
          <span>Show Contacts</span>
          <ion-icon name="chevron-down"></ion-icon>
        </button>
      </div>

      <div className="sidebar-info_more">
        <div className="separator"></div>
        <ul className="contacts-list">
          <li className="contact-item">
            <div className="icon-box"><ion-icon name="mail-outline"></ion-icon></div>
            <div className="contact-info">
              <p className="contact-title">Email</p>
              <a href={`mailto:${data.email}`} className="contact-link">{data.email}</a>
            </div>
          </li>
          <li className="contact-item">
            <div className="icon-box"><ion-icon name="phone-portrait-outline"></ion-icon></div>
            <div className="contact-info">
              <p className="contact-title">Phone</p>
              <a href={`tel:${data.phone}`} className="contact-link">{data.phoneDisplay}</a>
            </div>
          </li>
          <li className="contact-item">
            <div className="icon-box"><ion-icon name="location-outline"></ion-icon></div>
            <div className="contact-info">
              <p className="contact-title">Location</p>
              <address>{data.location}</address>
            </div>
          </li>
        </ul>
        <div className="separator"></div>
        <ul className="social-list">
          {(data.socials || []).map((s, i) => (
            <li key={i} className="social-item">
              <a href={s.url} className="social-link" target="_blank" rel="noopener noreferrer">
                <ion-icon name={s.icon}></ion-icon>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
