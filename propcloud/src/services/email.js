import { supabase } from './supabase';

export async function sendExportNotification(email, exportDetails) {
  const { data, error } = await supabase
    .from('export_notifications')
    .insert([{
      recipient_email: email,
      export_type: exportDetails.format,
      record_count: exportDetails.count,
      download_link: exportDetails.link,
      status: 'pending'
    }]);

  if (error) {
    console.error('Error saving export notification:', error);
    throw error;
  }

  // In a real app, you would trigger an email service here
  // For demo purposes, we'll just log it
  console.log('Export notification queued for:', email);
  return data;
}