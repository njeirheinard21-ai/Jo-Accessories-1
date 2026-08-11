import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { orderService, Order } from "../../services/orderService"
import { Download, Printer } from "lucide-react"
import { DataTable } from "../../features/admin/components/DataTable"

export function AdminOrders() {
  const queryClient = useQueryClient()
  
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: orderService.getAllOrders
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string, status: Order['status'] }) => 
      orderService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    }
  })

  const columns = [
    { 
      header: 'Order', 
      accessor: (row: any) => <span className="font-medium">#{row.id.slice(0,8)}</span>,
      sortable: true
    },
    { 
      header: 'Date', 
      accessor: (row: any) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true
    },
    { 
      header: 'Customer', 
      accessor: (row: any) => (
        <div>
          <div className="font-medium">{row.customerInfo?.firstName} {row.customerInfo?.lastName || row.userId.slice(0, 8)}</div>
          <div className="text-xs text-ash-muted">{row.customerInfo?.email || ''}</div>
        </div>
      ), 
      sortable: true 
    },
    { 
      header: 'Status', 
      accessor: (row: any) => {
        let bgColor = 'bg-white text-ash'
        let text = (row.status || 'pending').toUpperCase()
        
        switch (row.status) {
          case 'paid':
            bgColor = 'bg-green-100 text-green-800'
            break
          case 'pending_whatsapp_confirmation':
            bgColor = 'bg-[#e5fcf0] text-[#25D366]'
            text = 'WHATSAPP PENDING'
            break
          case 'processing':
            bgColor = 'bg-yellow-100 text-yellow-800'
            break
          case 'shipped':
            bgColor = 'bg-purple-100 text-purple-800'
            break
          case 'delivered':
            bgColor = 'bg-blue-100 text-blue-800'
            break
          case 'cancelled':
            bgColor = 'bg-red-100 text-red-800'
            break
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-widest ${bgColor}`}>
            {text}
          </span>
        )
      }
    },
    { 
      header: 'Total', 
      accessor: (row: any) => `$${row.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sortable: true
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Orders</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-ash-light bg-white text-sm font-medium rounded-md hover:bg-white transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-ash-light bg-white text-sm font-medium rounded-md hover:bg-white transition-colors">
            <Printer className="w-4 h-4" /> Print Slips
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-ash-light p-1 mb-6">
        <nav className="flex gap-2 overflow-x-auto">
          <button className="px-4 py-2 text-sm font-medium bg-white rounded-md whitespace-nowrap">All Orders</button>
          <button className="px-4 py-2 text-sm font-medium text-[#25D366] hover:bg-[#e5fcf0] rounded-md whitespace-nowrap flex items-center gap-2">
            WhatsApp Orders
          </button>
          <button className="px-4 py-2 text-sm font-medium text-ash-muted hover:text-ash hover:bg-white rounded-md whitespace-nowrap">Unfulfilled</button>
          <button className="px-4 py-2 text-sm font-medium text-ash-muted hover:text-ash hover:bg-white rounded-md whitespace-nowrap">Unpaid</button>
        </nav>
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-ash-light border-t-black rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable 
          data={orders} 
          columns={columns} 
          searchPlaceholder="Search orders by ID, customer..."
          renderActions={(row: any) => (
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <select
                value={row.status}
                onChange={(e) => updateStatusMutation.mutate({ orderId: row.id, status: e.target.value as Order['status'] })}
                disabled={updateStatusMutation.isPending}
                className="text-xs border border-ash-light rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-ash"
              >
                <option value="pending">Pending</option>
                <option value="pending_whatsapp_confirmation">WhatsApp Pending</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
        />
      )}
    </div>
  )
}

