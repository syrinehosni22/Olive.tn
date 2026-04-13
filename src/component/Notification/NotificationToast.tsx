import React, { useEffect } from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info, Tag } from 'lucide-react';

interface NotificationToastProps {
  notification: any;
  show: boolean;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 6000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show || !notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'VALIDATION': return <CheckCircle size={20} className="text-success" />;
      case 'REJET': return <AlertCircle size={20} className="text-danger" />;
      case 'OFFRE_MATCH': return <Tag size={20} className="text-warning" />;
      default: return <Info size={20} className="text-primary" />;
    }
  };

  return (
    <div className="position-fixed bottom-0 end-0 m-4 shadow-lg border-0 card bg-white" 
         style={{ width: '320px', zIndex: 3000, borderRadius: '12px', animation: 'toastSlideIn 0.5s ease-out' }}>
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center gap-2">
            {getIcon()}
            <span className="fw-bold small text-dark">Notification</span>
          </div>
          <button onClick={onClose} className="btn btn-sm p-0 border-0"><X size={18} /></button>
        </div>
        <h6 className="mb-1 small fw-bold">{notification.title}</h6>
        <p className="mb-0 text-muted small">{notification.message}</p>
      </div>
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;