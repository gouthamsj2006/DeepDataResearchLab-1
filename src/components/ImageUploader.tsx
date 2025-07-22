import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface ImageUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUpload: (imageUrl: string) => void;
  currentImageUrl?: string;
}

export default function ImageUploader({ 
  isOpen, 
  onClose, 
  onImageUpload, 
  currentImageUrl 
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { user } = useAuth();

  const uploadImage = async (file: File) => {
    if (!user) return null;

    try {
      setLoading(true);
      setError('');

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user profile
      const { error: updateError } = await supabase
        .from('student_profiles')
        .update({ photo_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return publicUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      onImageUpload(imageUrl);
      showSuccessToast('✅ Profile picture updated!');
      onClose();
    }
  };

  const startCamera = async () => {
    try {
      setError('');
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      setError('Camera access denied or not available');
      setShowCamera(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
      
      // Show preview
      setPreviewUrl(canvas.toDataURL());

      // Upload image
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        onImageUpload(imageUrl);
        showSuccessToast('✅ Profile picture updated!');
        stopCamera();
        onClose();
      }
    }, 'image/jpeg', 0.8);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const loadGallery = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('avatars')
        .list(`${user.id}/`, {
          limit: 20,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      const imageUrls = data.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(`${user.id}/${file.name}`);
        return publicUrl;
      });

      setGalleryImages(imageUrls);
      setShowGallery(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const selectFromGallery = async (imageUrl: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('student_profiles')
        .update({ photo_url: imageUrl })
        .eq('id', user.id);

      if (error) throw error;

      onImageUpload(imageUrl);
      showSuccessToast('✅ Profile picture updated!');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('student_profiles')
        .update({ photo_url: '' })
        .eq('id', user.id);

      if (error) throw error;

      onImageUpload('');
      showSuccessToast('✅ Profile picture removed!');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to remove image');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const handleClose = () => {
    stopCamera();
    setPreviewUrl(null);
    setError('');
    setShowCamera(false);
    setShowGallery(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Update Profile Picture
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {showCamera ? (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    className="w-full rounded-lg"
                    autoPlay
                    muted
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={capturePhoto}
                      disabled={loading}
                      className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                      {loading ? 'Capturing...' : 'Capture Photo'}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : showGallery ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Select from Gallery</h3>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                    {galleryImages.map((imageUrl, index) => (
                      <button
                        key={index}
                        onClick={() => selectFromGallery(imageUrl)}
                        className="aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                      >
                        <img
                          src={imageUrl}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowGallery(false)}
                    className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Back
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Camera Option */}
                  <button
                    onClick={startCamera}
                    disabled={loading}
                    className="w-full flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-900 dark:text-white font-medium">📷 Click Picture</span>
                  </button>

                  {/* File Picker Option */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="w-full flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-900 dark:text-white font-medium">🗂 From Device</span>
                  </button>

                  {/* Gallery Option */}
                  <button
                    onClick={loadGallery}
                    disabled={loading}
                    className="w-full flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-gray-900 dark:text-white font-medium">🖼️ From Gallery</span>
                  </button>

                  {/* Remove Image Option */}
                  {currentImageUrl && (
                    <button
                      onClick={removeImage}
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span className="font-medium">Remove Image</span>
                    </button>
                  )}
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Canvas for photo capture */}
              <canvas ref={canvasRef} className="hidden" />

              {loading && !showCamera && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}