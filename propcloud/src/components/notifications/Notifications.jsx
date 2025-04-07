import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import useRoles from '../../hooks/useRoles';

export default function Notifications() {
  const { user } = useAuth();
  const { isAdmin } = useRoles();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  async function fetchNotifications() {
    try {
      setLoading(true);
      let query = supabase
        .from('export_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isAdmin()) {
        query = query.eq('recipient_email', user.email);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Export Notifications</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isAdmin() && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Records</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map(notification => (
                <tr key={notification.id}>
                  {isAdmin() && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {notification.recipient_email}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {notification.export_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {notification.record_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      notification.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : notification.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {notification.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(notification.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {notification.download_link && (
                      <a 
                        href={notification.download_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Download
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {notifications.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No notifications found
            </div>
          )}
        </div>
      )}
    </div>
  );
}