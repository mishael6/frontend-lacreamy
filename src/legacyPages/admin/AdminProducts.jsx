'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import { Plus, Pencil, Trash2, RefreshCw, ShoppingBag, EyeOff, Star, Search } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import styles from './AdminProducts.module.css';

const CATEGORIES = ['croissants', 'cakes', 'tarts', 'cookies', 'bread', 'seasonal'];

const GRADIENTS = [
  'linear-gradient(135deg, #F9F8F5 0%, #FDCFAA 100%)',
  'linear-gradient(135deg, #F9F8F5 0%, #B2ACA4 100%)',
  'linear-gradient(135deg, #F9F8F5 0%, #BA9162 100%)',
  'linear-gradient(135deg, #FDCFAA 0%, #9E633A 100%)',
  'linear-gradient(135deg, #B2ACA4 0%, #807D82 100%)',
  'linear-gradient(135deg, #61311D 0%, #070403 100%)',
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
  const [search, setSearch] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getProducts();
      setProducts((res.data.products || []).map(product => ({ ...product, gradient: GRADIENTS[0] })));
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      badge: product.badge || '',
      gradient: GRADIENTS[0],
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

  const filtered = products.filter(product => {
    const matchesCategory = filterCat === 'all' || product.category === filterCat;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${product.name} ${product.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  const featuredCount = products.filter(product => product.isFeatured).length;
  const featuredSlotsUsedByOthers = products.filter(product => product.isFeatured && product._id !== editing).length;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>CATALOG MANAGEMENT</p>
          <h1>Products</h1>
          <p>{products.length} {products.length === 1 ? 'product' : 'products'} in your catalog</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.refreshBtn} onClick={fetchProducts} disabled={loading}>
            <RefreshCw size={15} className={loading ? styles.spinIcon : ''} /> Refresh
          </button>
          <button className={styles.addBtn} onClick={handleNew}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {success && <div className={styles.successMsg}>{success}</div>}
      {error && !showForm && <div className={styles.errorMsg}>{error}</div>}

      <section className={styles.catalogStats} aria-label="Catalog summary">
        <div><span>All products</span><strong>{products.length}</strong></div>
        <div><span>Available on menu</span><strong>{products.filter(product => product.isAvailable).length}</strong></div>
        <div><span>Homepage bestsellers</span><strong>{featuredCount}/4</strong></div>
      </section>

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
                    <ShoppingBag size={40} strokeWidth={1} color="rgba(97,49,29,0.3)" />
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
                    disabled={!form.isFeatured && featuredSlotsUsedByOthers >= 4}
                    onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                  />
                  <span>Show in homepage bestsellers</span>
                </label>
                <p className={styles.toggleHelp}>
                  {featuredSlotsUsedByOthers >= 4 && !form.isFeatured
                    ? 'All four homepage bestseller spots are in use. Unselect one product to make room.'
                    : 'Selected products appear in the homepage “Our Bestsellers” section. Choose up to four.'}
                </p>
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

      <div className={styles.catalogToolbar}>
        <div className={styles.filters} aria-label="Filter products by category">
          <button
            className={`${styles.filterBtn} ${filterCat === 'all' ? styles.filterActive : ''}`}
            onClick={() => setFilterCat('all')}
            aria-pressed={filterCat === 'all'}
          >
            All ({products.length})
          </button>
          {CATEGORIES.map(c => (
          <button
            key={c}
            className={`${styles.filterBtn} ${filterCat === c ? styles.filterActive : ''}`}
            onClick={() => setFilterCat(c)}
            aria-pressed={filterCat === c}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)} ({products.filter(p => p.category === c).length})
          </button>
          ))}
        </div>
        <label className={styles.searchBox}>
          <Search size={15} />
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products" />
        </label>
      </div>

      {loading ? (
        <div className={styles.centered}>
          <RefreshCw size={32} className={styles.spinIcon} />
          <p>Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.centered}>
          <ShoppingBag size={42} strokeWidth={1.2} className={styles.emptyIcon} />
          <p>{search ? 'No products match your search.' : 'No products found in this category.'}</p>
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
                  <ShoppingBag size={48} strokeWidth={1} color="rgba(97,49,29,0.3)" />
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
                    <Star size={10} fill="currentColor" /> Homepage bestseller
                  </span>
                )}
              </div>

              <div className={styles.productBody}>
                <div className={styles.productMeta}>
                  <span className={styles.productCategory}>{product.category}</span>
                  <span className={`${styles.availability} ${product.isAvailable ? styles.available : styles.hidden}`}>{product.isAvailable ? 'Available' : 'Hidden'}</span>
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
