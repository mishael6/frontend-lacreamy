import { useState, useRef } from 'react';
import styles from './ImageUpload.module.css';

export default function ImageUpload({ value, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef();

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const uploadToCloudinary = async (file) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      return setError('Please upload an image file.');
    }
    if (file.size > 5 * 1024 * 1024) {
      return setError('Image must be under 5MB.');
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'lacreamy/products');

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          onChange(data.secure_url);
          setProgress(100);
        } else {
          setError('Upload failed. Please try again.');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setError('Upload failed. Check your internet connection.');
        setUploading(false);
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
      xhr.send(formData);
    } catch {
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleFile = (file) => {
    if (file) uploadToCloudinary(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleRemove = () => {
    onChange('');
    setProgress(0);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={styles.wrap}>
      {value ? (
        // Preview uploaded image
        <div className={styles.preview}>
          <img src={value} alt="Product" className={styles.previewImg} />
          <div className={styles.previewOverlay}>
            <button
              type="button"
              className={styles.changeBtn}
              onClick={() => inputRef.current?.click()}
            >
              📷 Change Image
            </button>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={handleRemove}
            >
              🗑️ Remove
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        // Drop zone
        <div
          className={`${styles.dropzone} ${dragging ? styles.dragging : ''} ${uploading ? styles.uploading : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          {uploading ? (
            <div className={styles.uploadingState}>
              <div className={styles.progressRing}>
                <svg viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="2" />
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    stroke="var(--yellow-dark)"
                    strokeWidth="2"
                    strokeDasharray={`${progress * 0.942} 94.2`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span className={styles.progressText}>{progress}%</span>
              </div>
              <p>Uploading image...</p>
            </div>
          ) : (
            <div className={styles.dropContent}>
              <span className={styles.dropIcon}>📸</span>
              <p className={styles.dropTitle}>
                {dragging ? 'Drop image here!' : 'Upload Product Image'}
              </p>
              <p className={styles.dropSub}>
                Drag & drop or <span>click to browse</span>
              </p>
              <p className={styles.dropHint}>JPG, PNG, WEBP — max 5MB</p>
            </div>
          )}
        </div>
      )}

      {error && <p className={styles.error}>❌ {error}</p>}
    </div>
  );
}