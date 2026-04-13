import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Hooks plus propres
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

// Composants & Config
import Sidebar from '../component/Sidebar/Sidebar';
import ContentRenderer from '../component/dashboard/ContentRenderer';
import NotificationHeader from '../component/Notification/NotificationHeader';
import NotificationToast from '../component/Notification/NotificationToast';
import { ROLE_THEMES } from '../component/dashboard/rolesConfig';

// Redux
import { RootState } from '../redux/store';
import { logoutUser } from '../redux/slices/authSlice';

const Dashboard: React.FC = () => {
  // 1. Hooks Redux et Navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 2. Sélection des données depuis le store
  const { user: userData, isAuthenticated, userRole } = useSelector((state: RootState) => ({
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    userRole: state.auth.user?.role
  }));

  // 3. États locaux
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showToast, setShowToast] = useState(false);
  const [latestNotif, setLatestNotif] = useState<any>(null);
  
  const socket = useRef<Socket | null>(null);
  const userId = userData?._id || userData?.id;

  // Logique de déconnexion
  const handleLogout = async () => {
    // On dispatch le thunk créé dans le slice
    // @ts-ignore (si thunk n'est pas typé dans votre store)
    await dispatch(logoutUser());
    // Redirection vers la page de login
    navigate('/', { replace: true });
  };

  // Mise à jour de la vue (Immuabilité)
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => 
      prev.map((n) => n._id === id ? { ...n, isRead: true } : n)
    );
  };

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
      setNotifications(res.data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchNotifications();
      socket.current = io("http://localhost:5000");
      
      // Envoi de l'ID et du rôle pour rejoindre les rooms
      socket.current.emit("addUser", { userId, role: userRole });
      
      socket.current.on("newNotification", (notif) => {
        setLatestNotif(notif);
        setShowToast(true);
        setNotifications((prev) => [notif, ...prev]);
      });

      return () => { socket.current?.disconnect(); };
    }
  }, [userId, isAuthenticated, userRole]);

  const handleClearAll = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/clear/${userId}`);
      setNotifications([]);
    } catch (err) { console.error(err); }
  };

  // Sécurité : redirection si non authentifié
  if (!isAuthenticated || !userRole) return <Navigate to="/" replace />;

  const config = ROLE_THEMES[userRole] || ROLE_THEMES.vendeur;

  return (
    <div className="d-flex w-100 bg-light min-vh-100">
      <Sidebar 
        config={config} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      <div className="flex-grow-1 d-flex flex-column position-relative">
        <NotificationHeader 
          userData={userData} 
          userRole={userRole} 
          notifications={notifications} 
          onLogout={handleLogout} 
          onMarkAsRead={handleMarkAsRead} 
          onClearAll={handleClearAll} 
        />

        <main className="p-4 p-md-5 overflow-auto">
          {loading ? (
            <div className="text-center mt-5">Chargement...</div>
          ) : (
            <ContentRenderer 
              tab={activeTab} 
              setTab={setActiveTab} 
              role={userRole} 
              color={config.primaryColor} 
              userData={userData} 
              setSelectedContact={() => {}} 
            />
          )}
        </main>

        <NotificationToast 
          show={showToast} 
          notification={latestNotif} 
          onClose={() => setShowToast(false)} 
        />
      </div>
    </div>
  );
};

export default Dashboard;