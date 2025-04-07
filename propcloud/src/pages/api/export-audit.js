import { supabase } from '../../services/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify admin role
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Stream audit logs directly to response
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=audit_log_export.csv');

    // Write CSV headers
    const headers = [
      'ID',
      'Timestamp',
      'User',
      'Action',
      'Table',
      'Record ID',
      'Old Values',
      'New Values'
    ].join(',') + '\n';
    
    res.write(headers);

    // Stream data in chunks
    let from = 0;
    const chunkSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('audit_log')
        .select(`
          id,
          action,
          table_name,
          record_id,
          old_values,
          new_values,
          created_at,
          user:user_id(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .range(from, from + chunkSize - 1);

      if (error) throw error;

      if (data.length === 0) {
        hasMore = false;
        break;
      }

      const rows = data.map(item => {
        const values = [
          item.id,
          new Date(item.created_at).toISOString(),
          item.user?.full_name || item.user?.email || 'System',
          item.action,
          item.table_name || '',
          item.record_id || '',
          JSON.stringify(item.old_values || {}),
          JSON.stringify(item.new_values || {})
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
        
        return values + '\n';
      });

      res.write(rows.join(''));
      from += chunkSize;
    }

    res.end();
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
}