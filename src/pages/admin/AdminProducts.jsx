import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import { Plus, Pencil, Trash2, RefreshCw, ShoppingBag, Eye, EyeOff, Star } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import styles from './AdminProducts.module.css';

const CATEGORIES = ['croissants', 'cakes', 'tarts', 'cookies', 'bread', 'seasonal'];

const GRADIENTS = [
  'linear-gradient(135deg, #F5E9C8 0%, #E8CC8A 100%)',
  'linear-gradient(135deg, #FAEEDA 0%, #D4A017 100%)',
  'linear-gradient(135deg, #C8A882 0%, #6B3F1F 100%)',
  'linear-gradient(135deg, #FFE0E6 0%, #FFB3C1 100%)',
  'linear-gradient(135deg, #D4A017 0%, #6B3F1F 100%)',
  'linear-gradient(135deg, #FFFDE7 0%, #F9E04B 100%)',
  'linear-gradient(135deg, #E8D5F5 0%, #9B59B6 80%)',
  'linear-gradient(135deg, #F5DEB3 0%, #8B4513 100%)',
  'linear-gradient(135deg, #D4EDDA 0%, #28A745 100%)',
  'linear-gradient(135deg, #FAEBD7 0%, #8B6914 100%)',
  'linear-gradient(135deg, #FFE0B2 0%, #FF6F00 100%)',
];

const emptyForm = {
  name: '', category: 'croissants', price: '',
  description: '', badge: '',
  gradient: GRADIENTS[0], isAvailable: true,
  isFeatured: false, image: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterCat, setFilterCat] = useState('all');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.products || []);
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      badge: product.badge || '',
      gradient: product.gradient || GRADIENTS[0],
      isAvailable: product.isAvailable,
      isFeatured: product.isFeatured,
      image: product.image || '',
    });
    setShowForm(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editing) {
        await updateProduct(editing, form);
        setSuccess('Product updated successfully!');
      } else {
        await createProduct(form);
        setSuccess('Product added successfully!');
      }
      await fetchProducts();
      handleCancel();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      setDeleteConfirm(null);
      setSuccess('Product deleted.');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to delete product.');
    }
  };

  const filtered = products.filter(p =>
    filterCat === 'all' || p.category === filterCat
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Products</h1>
          <p>{products.length} products in menu</p>
        </div>
        <button className={styles.addBtn} onClick={handleNew}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {success && <div className={styles.successMsg}>{success}</div>}
      {error && !showForm && <div className={styles.errorMsg}>{error}</div>}

      {showForm && (
        <div className={styles.formCard}>
          <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label>Product Image</label>
                <ImageUpload
                  value={form.image}
                  onChange={url => setForm(f => ({ ...f, image: url }))}
                />
              </div>

              <div className={styles.field}>
                <label>Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Classic Butter Croissant"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Price (GHC) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 8.50"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Badge <span>(optional)</span></label>
                <input
                  type="text"
                  placeholder="e.g. Bestseller, New, Limited"
                  value={form.badge}
                  onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                />
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label>Description *</label>
                <textarea
                  rows={3}
                  placeholder="Describe the pastry..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label>Card Background <span>(used when no image)</span></label>
                <div className={styles.gradientPicker}>
                  {GRADIENTS.map((g, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`${styles.gradientSwatch} ${form.gradient === g ? styles.gradientActive : ''}`}
                      style={{ background: g }}
                      onClick={() => setForm(f => ({ ...f, gradient: g }))}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label>Preview</label>
                <div
                  className={styles.preview}
                  style={{ background: form.image ? 'transparent' : form.gradient }}
                >
                  {form.image ? (
                    <img src={form.image} alt="preview" className={styles.previewImg} />
                  ) : (
                    <ShoppingBag size={40} strokeWidth={1} color="rgba(107,63,31,0.3)" />
                  )}
                </div>
              </div>

              <div className={styles.togglesField}>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))}
                  />
                  <span>Available on menu</span>
                </label>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                  />
                  <span>Featured on homepage</span>
                </label>
              </div>
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filterCat === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilterCat('all')}
        >
          All ({products.length})
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`${styles.filterBtn} ${filterCat === c ? styles.filterActive : ''}`}
            onClick={() => setFilterCat(c)}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)} ({products.filter(p => p.category === c).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.centered}>
          <RefreshCw size={32} className={styles.spinIcon} />
          <p>Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.centered}>
          <ShoppingBag size={48} strokeWidth={1} className={styles.emptyIcon} />
          <p>No products found.</p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {filtered.map(product => (
            <div
              key={product._id}
              className={`${styles.productCard} ${!product.isAvailable ? styles.unavailable : ''}`}
            >
              <div
                className={styles.productVisual}
                style={{ background: product.image ? 'transparent' : product.gradient }}
              >
                {product.image ? (
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                ) : (
                  <ShoppingBag size={48} strokeWidth={1} color="rgba(107,63,31,0.3)" />
                )}
                {product.badge && (
                  <span className={styles.productBadge}>{product.badge}</span>
                )}
                {!product.isAvailable && (
                  <span className={styles.unavailableBadge}>
                    <EyeOff size={10} /> Hidden
                  </span>
                )}
                {product.isFeatured && (
                  <span className={styles.featuredBadge}>
                    <Star size={10} fill="currentColor" /> Featured
                  </span>
                )}
              </div>

              <div className={styles.productBody}>
                <div className={styles.productMeta}>
                  <span className={styles.productCategory}>{product.category}</span>
                </div>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDesc}>{product.description}</p>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>GHC {product.price.toFixed(2)}</span>
                  <div className={styles.productActions}>
                    <button className={styles.editBtn} onClick={() => handleEdit(product)}>
                      <Pencil size={13} /> Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(product._id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {deleteConfirm === product._id && (
                <div className={styles.deleteOverlay}>
                  <p>Delete this product?</p>
                  <div className={styles.deleteActions}>
                    <button onClick={() => setDeleteConfirm(null)}>Cancel</button>
                    <button className={styles.confirmDelete} onClick={() => handleDelete(product._id)}>
                      Yes, Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}