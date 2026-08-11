import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Edit, Trash2, X, Download, Upload } from "lucide-react"
import { productService } from "../../services/productService"
import { Product } from "../../core/domain/Product"
import { DataTable } from "../../features/admin/components/DataTable"

export function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productService.getProducts(100) // limit for admin view
  });

  const products = data?.products || [];

  const createMutation = useMutation({
    mutationFn: (newProduct: Partial<Product>) => productService.createProduct(newProduct as Omit<Product, 'id'>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      handleCloseModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, product: Partial<Product> }) => productService.updateProduct(data.id, data.product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      handleCloseModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ status: 'active', stock: 0, price: 0 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, product: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { 
      header: 'Product', 
      accessor: (row: any) => (
        <div className="flex items-center gap-4 py-2">
          <div className="w-12 h-12 bg-white border border-ash-light overflow-hidden shrink-0">
            <img loading="lazy" decoding="async" src={row.image} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">{row.name}</p>
            <p className="text-[10px] font-sans text-ash-muted uppercase tracking-widest">{row.category}</p>
          </div>
        </div>
      ),
      sortable: true
    },
    { 
      header: 'Price', 
      accessor: (row: any) => <span className="font-serif italic">${row.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>, 
      sortable: true 
    },
    { header: 'Stock', accessor: 'stock', sortable: true },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`inline-flex items-center px-3 py-1 border text-[9px] font-sans font-bold uppercase tracking-[0.2em] ${
          (row.status || 'active') === 'active' ? 'bg-green-50 border-green-200 text-green-900' : 'bg-white border-ash-light text-ash'
        }`}>
          {(row.status || 'Active')}
        </span>
      )
    }
  ]

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-ash-light">
        <h1 className="text-3xl font-serif tracking-tight uppercase">Products</h1>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 border border-ash-light bg-white text-[10px] font-sans font-bold uppercase tracking-[0.2em] hover:border-ash transition-colors outline-none">
            <Upload className="w-3 h-3" strokeWidth={2} /> Import
          </button>
          <button className="flex items-center gap-2 px-6 py-3 border border-ash-light bg-white text-[10px] font-sans font-bold uppercase tracking-[0.2em] hover:border-ash transition-colors outline-none">
            <Download className="w-3 h-3" strokeWidth={2} /> Export
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-ash text-white text-[10px] font-sans font-bold uppercase tracking-[0.2em] hover:bg-ash/90 transition-colors outline-none"
          >
            <Plus className="w-3 h-3" strokeWidth={2} /> Add Product
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-24 flex justify-center">
          <div className="w-6 h-6 border-2 border-ash-light border-t-black animate-spin rounded-full"></div>
        </div>
      ) : (
        <div className="border border-ash-light p-1 bg-white">
          <DataTable 
            data={products} 
            columns={columns} 
            searchPlaceholder="SEARCH PRODUCTS..."
            renderActions={(row: any) => (
              <div className="flex justify-end gap-4 px-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenModal(row) }}
                  className="text-ash-muted hover:text-ash transition-colors outline-none"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (window.confirm('Are you sure you want to delete this product?')) {
                      deleteMutation.mutate(row.id)
                    }
                  }}
                  className="text-ash-muted hover:text-red-600 transition-colors outline-none"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            )}
          />
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ash/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl max-h-[90vh] flex flex-col border border-ash-light shadow-2xl">
            <div className="flex items-center justify-between p-8 border-b border-ash-light">
              <h2 className="text-2xl font-serif uppercase tracking-widest">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={handleCloseModal} className="text-ash-muted hover:text-ash transition-colors outline-none hover:rotate-90 duration-500">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] mb-4">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-b border-ash-light py-3 px-1 focus:outline-none focus:border-ash transition-colors text-sm font-sans"
                  placeholder="e.g. The Cassette Bag"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] mb-4">Price</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full border-b border-ash-light py-3 px-1 focus:outline-none focus:border-ash transition-colors text-sm font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] mb-4">Stock</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full border-b border-ash-light py-3 px-1 focus:outline-none focus:border-ash transition-colors text-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] mb-4">Category</label>
                <input 
                  type="text" 
                  required
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border-b border-ash-light py-3 px-1 focus:outline-none focus:border-ash transition-colors text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] mb-4">Image URL</label>
                <input 
                  type="url" 
                  required
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border-b border-ash-light py-3 px-1 focus:outline-none focus:border-ash transition-colors text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] mb-4">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border-b border-ash-light py-3 px-1 focus:outline-none focus:border-ash transition-colors resize-none text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] mb-4">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'archived' })}
                  className="w-full border-b border-ash-light py-3 px-1 focus:outline-none focus:border-ash transition-colors text-sm font-sans bg-transparent"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="pt-8 flex justify-end gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-8 py-4 border border-ash-light text-[10px] font-sans font-bold uppercase tracking-[0.2em] hover:border-ash transition-colors outline-none"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-8 py-4 bg-ash text-white text-[10px] font-sans font-bold uppercase tracking-[0.2em] hover:bg-ash/90 transition-colors disabled:opacity-50 outline-none"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
