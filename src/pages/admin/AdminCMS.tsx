import { DataTable } from "../../features/admin/components/DataTable"
import { Plus } from "lucide-react"

export function AdminCMS() {
  const pagesData = [
    { id: '1', title: 'Home Page', slug: '/', status: 'Published', lastEdited: '2024-03-20' },
    { id: '2', title: 'About Us', slug: '/about', status: 'Published', lastEdited: '2024-02-15' },
    { id: '3', title: 'Shipping & Returns', slug: '/shipping', status: 'Published', lastEdited: '2024-01-10' },
    { id: '4', title: 'Holiday Campaign 2024', slug: '/campaign/holiday', status: 'Draft', lastEdited: '2024-03-21' },
  ]

  const columns = [
    { header: 'Title', accessor: 'title' as const, sortable: true },
    { header: 'Slug', accessor: 'slug' as const },
    { header: 'Last Edited', accessor: 'lastEdited' as const, sortable: true },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-white text-ash'
        }`}>
          {row.status}
        </span>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Content Management</h1>
        <button className="flex items-center gap-2 bg-ash text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-ash/90 transition-colors">
          <Plus className="w-4 h-4" /> Create Page
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-ash-light p-1 mb-6">
        <nav className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium bg-white rounded-md">Pages</button>
          <button className="px-4 py-2 text-sm font-medium text-ash-muted hover:text-ash hover:bg-white rounded-md">Navigation</button>
          <button className="px-4 py-2 text-sm font-medium text-ash-muted hover:text-ash hover:bg-white rounded-md">Banners</button>
          <button className="px-4 py-2 text-sm font-medium text-ash-muted hover:text-ash hover:bg-white rounded-md">Blog</button>
        </nav>
      </div>

      <DataTable 
        data={pagesData} 
        columns={columns} 
        searchPlaceholder="Search pages..."
      />
    </div>
  )
}
