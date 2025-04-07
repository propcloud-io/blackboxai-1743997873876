import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    full_name: '',
    avatar_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, [user]);

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Please select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({...profile, avatar_url: publicUrl});
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function updateProfile(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const updates = {
        id: user.id,
        full_name: profile.full_name,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      <div className="flex items-center space-x-4 mb-6">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No photo</span>
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
          >
            {uploading ? 'Uploading...' : 'Change'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={uploadAvatar}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
      <form onSubmit={updateProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="mt-1 block w-full rounded-md bg-gray-100 p-2 border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={profile.full_name || ''}
            onChange={(e) => setProfile({...profile, full_name: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}