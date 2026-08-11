import { DataTable } from "../../features/admin/components/DataTable"
import { Plus } from "lucide-react"

export function AdminMarketing() {
  const discountData = [
    { id: '1', code: 'SUMMER20', type: 'Percentage', value: '20%', status: 'Active', used: 145 },
    { id: '2', code: 'WELCOME10', type: 'Percentage', value: '10%', status: 'Active', used: 892 },
    { id: '3', code: 'FREESHIP', type: 'Free Shipping', value: 'N/A', status: 'Expired', used: 450 },
  ]

  const columns = [
    { header: 'Code', accessor: 'code' as const, sortable: true },
    { header: 'Type', accessor: 'type' as const },
    { header: 'Value', accessor: 'value' as const },
    { header: 'Times Used', accessor: 'used' as const, sortable: true },
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
        <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Marketing & Discounts</h1>
        <button className="flex items-center gap-2 bg-ash text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-ash/90 transition-colors">
          <Plus className="w-4 h-4" /> Create Discount
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-ash-light p-1 mb-6">
        <nav className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium bg-white rounded-md">Discounts</button>
          <button className="px-4 py-2 text-sm font-medium text-ash-muted hover:text-ash hover:bg-white rounded-md">Gift Cards</button>
          <button className="px-4 py-2 text-sm font-medium text-ash-muted hover:text-ash hover:bg-white rounded-md">Campaigns</button>
        </nav>
      </div>

      <DataTable 
        data={discountData} 
        columns={columns} 
        searchPlaceholder="Search discount codes..."
      />
    </div>
  )
}
