import { DataTable } from "../../features/admin/components/DataTable"
import { AlertTriangle, Download, Upload } from "lucide-react"

export function AdminInventory() {
  const inventoryData = [
    { id: '1', product: 'The Mini Tote', sku: 'BAG-TMT-BLK', stock: 12, reserved: 2, status: 'In Stock' },
    { id: '2', product: 'Classic Leather Crossbody', sku: 'BAG-CLC-BRN', stock: 3, reserved: 1, status: 'Low Stock' },
    { id: '3', product: 'Silk Evening Clutch', sku: 'BAG-SEC-RED', stock: 0, reserved: 0, status: 'Out of Stock' },
    { id: '4', product: 'Signature Canvas Backpack', sku: 'BAG-SCB-WHT', stock: 45, reserved: 5, status: 'In Stock' },
  ]

  const columns = [
    { header: 'Product', accessor: 'product' as const, sortable: true },
    { header: 'SKU', accessor: 'sku' as const, sortable: true },
    { 
      header: 'Available', 
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.stock}</span>
          {row.stock < 5 && row.stock > 0 && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
          {row.stock === 0 && <AlertTriangle className="w-4 h-4 text-red-500" />}
        </div>
      ), 
      sortable: true 
    },
    { header: 'Reserved', accessor: 'reserved' as const },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.stock === 0 ? 'bg-red-100 text-red-800' :
          row.stock < 5 ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {row.status}
        </span>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Inventory Management</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-ash-light bg-white text-sm font-medium rounded-md hover:bg-white transition-colors">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-ash-light bg-white text-sm font-medium rounded-md hover:bg-white transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="bg-ash text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-ash/90 transition-colors">
            Update Stock
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <h3 className="text-sm font-medium text-ash-muted mb-2">Total Items in Stock</h3>
          <p className="text-3xl font-semibold">1,248</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <h3 className="text-sm font-medium text-ash-muted mb-2">Low Stock Alerts</h3>
          <p className="text-3xl font-semibold text-yellow-600">14</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <h3 className="text-sm font-medium text-ash-muted mb-2">Out of Stock</h3>
          <p className="text-3xl font-semibold text-red-600">3</p>
        </div>
      </div>

      <DataTable 
        data={inventoryData} 
        columns={columns} 
        searchPlaceholder="Search products or SKUs..."
      />
    </div>
  )
}
