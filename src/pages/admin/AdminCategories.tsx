import { DataTable } from "../../features/admin/components/DataTable"
import { Plus } from "lucide-react"

export function AdminCategories() {
  const categoryData = [
    { id: '1', name: 'Bags', slug: 'bags', productCount: 45, status: 'Active' },
    { id: '2', name: 'Cosmetics', slug: 'cosmetics', productCount: 28, status: 'Active' },
    { id: '3', name: 'Accessories', slug: 'accessories', productCount: 15, status: 'Active' },
    { id: '4', name: 'Small Leather Goods', slug: 'small-leather-goods', productCount: 0, status: 'Draft' },
  ]

  const columns = [
    { header: 'Name', accessor: 'name' as const, sortable: true },
    { header: 'Slug', accessor: 'slug' as const },
    { header: 'Products', accessor: 'productCount' as const, sortable: true },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-white text-ash'
        }`}>
          {row.status}
        </span>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Categories</h1>
        <button className="flex items-center gap-2 bg-ash text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-ash/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <DataTable 
        data={categoryData} 
        columns={columns} 
        searchPlaceholder="Search categories..."
      />
    </div>
  )
}
