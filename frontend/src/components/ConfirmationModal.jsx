// components/ConfirmationModal.jsx
import React from 'react';
import { X, Droplets, AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message,
  type = "default", // "default", "warning", "danger"
  children
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-500',
          buttonColor: 'bg-yellow-500 hover:bg-yellow-600'
        };
      case 'danger':
        return {
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          iconColor: 'text-red-500',
          buttonColor: 'bg-red-500 hover:bg-red-600'
        };
      default:
        return {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-500',
          buttonColor: 'bg-blue-500 hover:bg-blue-600'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            {type === 'warning' && <AlertTriangle className={`h-5 w-5 ${styles.iconColor}`} />}
            {type === 'default' && <Droplets className={`h-5 w-5 ${styles.iconColor}`} />}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {message && (
            <div className={`p-4 rounded-lg mb-4 ${styles.bgColor}`}>
              <p className={`text-sm ${styles.textColor}`}>{message}</p>
            </div>
          )}
          
          {children}
        </div>
        
        <div className="flex space-x-3 p-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${styles.buttonColor}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
