import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, LogOut, User, Trash2 } from 'lucide-react';
import axios from 'axios';

interface NotificationHeaderProps {
  userData: any;
  userRole: string;
  notifications: any[];
  onLogout: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({ 
  userData, userRole, notifications, onLogout, onMarkAsRead, onClearAll 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (notif: any) => {
    console.log(notif);
  const notificationId = notif._id;
  if (notif.isRead || !notificationId) return;

  // ÉTAPE 1 : On informe le parent TOUT DE SUITE (pour la vue)
  onMarkAsRead(notificationId);

  try {
    // ÉTAPE 2 : On fait l'appel API en arrière-plan
    await axios.put(`http://localhost:5000/api/notifications/read/${notificationId}`);
    console.log("Backend synchronisé");
  } catch (err) {
    console.error("Erreur Backend :", err);
    // Optionnel : recharger fetchNotifications() ici si vous voulez annuler l'effet visuel en cas d'erreur
  }
};

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="d-flex justify-content-end align-items-center bg-white px-4 py-2 border-bottom shadow-sm position-sticky top-0" style={{ zIndex: 1020, height: '70px' }}>
      <div className="d-flex align-items-center gap-3" ref={dropdownRef}>
        
        <div className="position-relative">
          <button className="btn btn-light rounded-circle p-2 border-0 shadow-none" onClick={() => setIsOpen(!isOpen)}>
            <Bell size={20} className={unreadCount > 0 ? "text-primary" : "text-secondary"} />
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '0.6rem' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="position-absolute end-0 mt-3 bg-white border rounded shadow-lg overflow-hidden" style={{ width: '320px', zIndex: 1030 }}>
              <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                <span className="fw-bold small text-uppercase tracking-wider">Activités</span>
                <button onClick={onClearAll} className="btn btn-sm text-danger border-0 d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                  <Trash2 size={14} /> Tout effacer
                </button>
              </div>
              
              <div className="overflow-auto" style={{ maxHeight: '350px' }}>
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div 
                      key={notif._id} 
                      onClick={() => handleNotificationClick(notif)} 
                      className={`p-3 border-bottom small transition-all ${!notif.isRead ? 'bg-light fw-bold cursor-pointer' : 'opacity-75'}`}
                      style={{ borderLeft: !notif.isRead ? '4px solid #0d6efd' : '4px solid transparent' }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="text-dark">{notif.title}</div>
                        {!notif.isRead && <span className="badge bg-primary rounded-circle p-1" style={{ width: '8px', height: '8px' }}> </span>}
                      </div>
                      <div className="text-muted fw-normal mt-1">{notif.message}</div>
                      <div className="text-end mt-1" style={{ fontSize: '0.65rem', opacity: 0.5 }}>
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted small">Aucune notification</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="position-relative">
          <button className="btn btn-light rounded-circle p-2 border-0 shadow-none" onClick={() => setShowMenu(!showMenu)}>
            <Menu size={20} />
          </button>
          {showMenu && (
            <div className="position-absolute end-0 mt-3 bg-white border rounded shadow-lg py-2" style={{ width: '200px', zIndex: 1030 }}>
              <div className="px-3 py-2 border-bottom fw-bold small text-dark">{userData?.firstName} {userData?.lastName}</div>
              <button className="dropdown-item d-flex gap-2 align-items-center py-2"><User size={16}/> Mon Profil</button>
              <div className="dropdown-divider"></div>
              <button onClick={onLogout} className="dropdown-item d-flex gap-2 align-items-center text-danger py-2"><LogOut size={16}/> Déconnexion</button>
            </div>
          )}
        </div>

        <div className="ms-1 d-none d-md-block text-end border-start ps-3">
          <div className="fw-bold small text-dark leading-tight">{userData?.firstName}</div>
          <div className="text-primary text-uppercase fw-bold leading-tight" style={{ fontSize: '0.6rem' }}>{userRole}</div>
        </div>
      </div>
    </header>
  );
};

export default NotificationHeader;