import { DataTable } from "../../features/admin/components/DataTable"
import { Plus } from "lucide-react"

export function AdminStaff() {
  const staffData = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'Super Admin', status: 'Active' },
    { id: '2', name: 'Sarah Manager', email: 'sarah@example.com', role: 'Store Owner', status: 'Active' },
    { id: '3', name: 'John Doe', email: 'john@example.com', role: 'Order Manager', status: 'Active' },
    { id: '4', name: 'Emily Marketing', email: 'emily@example.com', role: 'Marketing Manager', status: 'Inactive' },
  ]

  const columns = [
    { header: 'Name', accessor: 'name' as const, sortable: true },
    { header: 'Email', accessor: 'email' as const },
    { header: 'Role', accessor: 'role' as const, sortable: true },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Staff Management</h1>
        <button className="flex items-center gap-2 bg-ash text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-ash/90 transition-colors">
          <Plus className="w-4 h-4" /> Invite Staff
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-ash-light p-1 mb-6">
        <nav className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium bg-white rounded-md">Staff Members</button>
          <button className="px-4 py-2 text-sm font-medium text-ash-muted hover:text-ash hover:bg-white rounded-md">Roles & Permissions</button>
          <button className="px-4 py-2 text-sm font-medium text-ash-muted hover:text-ash hover:bg-white rounded-md">Activity Logs</button>
        </nav>
      </div>

      <DataTable 
        data={staffData} 
        columns={columns} 
        searchPlaceholder="Search staff..."
      />
    </div>
  )
}
