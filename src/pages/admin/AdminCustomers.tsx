import { DataTable } from "../../features/admin/components/DataTable"
import { Download } from "lucide-react"

export function AdminCustomers() {
  const customerData = [
    { id: '1', name: 'Emma Thompson', email: 'emma.t@example.com', orders: 4, spent: 1250.00, lastOrder: '2024-03-15' },
    { id: '2', name: 'James Wilson', email: 'j.wilson@example.com', orders: 1, spent: 450.00, lastOrder: '2024-03-10' },
    { id: '3', name: 'Sophie Chen', email: 'sophie.c@example.com', orders: 12, spent: 4580.00, lastOrder: '2024-03-01' },
    { id: '4', name: 'Marcus Johnson', email: 'marcus.j@example.com', orders: 0, spent: 0, lastOrder: 'N/A' },
  ]

  const columns = [
    { header: 'Customer', accessor: 'name' as const, sortable: true },
    { header: 'Email', accessor: 'email' as const },
    { header: 'Orders', accessor: 'orders' as const, sortable: true },
    { 
      header: 'Total Spent', 
      accessor: (row: any) => `$${row.spent.toFixed(2)}`,
      sortable: true
    },
    { header: 'Last Order', accessor: 'lastOrder' as const }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Customers</h1>
        <button className="flex items-center gap-2 px-4 py-2 border border-ash-light bg-white text-sm font-medium rounded-md hover:bg-white transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <h3 className="text-sm font-medium text-ash-muted mb-2">Total Customers</h3>
          <p className="text-3xl font-semibold">4,289</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <h3 className="text-sm font-medium text-ash-muted mb-2">Active (30d)</h3>
          <p className="text-3xl font-semibold">312</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <h3 className="text-sm font-medium text-ash-muted mb-2">Avg Order Value</h3>
          <p className="text-3xl font-semibold">$345.50</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <h3 className="text-sm font-medium text-ash-muted mb-2">Return Rate</h3>
          <p className="text-3xl font-semibold text-green-600">62%</p>
        </div>
      </div>

      <DataTable 
        data={customerData} 
        columns={columns} 
        searchPlaceholder="Search customers by name or email..."
      />
    </div>
  )
}
