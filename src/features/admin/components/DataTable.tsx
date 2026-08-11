import { useState, useMemo } from "react"
import { Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpDown } from "lucide-react"

interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  sortable?: boolean
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  onRowClick?: (row: T) => void
  actions?: React.ReactNode
  renderActions?: (row: T) => React.ReactNode
}

export const DataTable = memo(function DataTable<T extends { id?: string | number }>({ 
  data, 
  columns, 
  searchPlaceholder = "SEARCH...",
  onRowClick,
  actions,
  renderActions
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(lowerSearch)
      )
    )
  }, [data, searchTerm])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  
  const paginatedData = useMemo(() => {
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, startIndex])

  return (
    <div className="bg-white flex flex-col w-full">
      <div className="p-6 border-b border-ash-light flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-ash-muted" />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-8 pr-4 py-2 text-[10px] font-sans font-bold uppercase tracking-[0.2em] border-b border-ash-light focus:outline-none focus:border-ash transition-colors bg-transparent placeholder:text-white/60"
          />
        </div>
        <div className="flex items-center gap-6">
          {actions}
          <button className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-ash-muted hover:text-ash transition-colors outline-none">
            <Filter className="w-3 h-3" strokeWidth={2} />
            Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-ash-light text-ash">
            <tr>
              <th className="px-6 py-6 font-medium w-10">
                <input type="checkbox" className="border-ash-light outline-none" />
              </th>
              {columns.map((col, i) => (
                <th key={i} className={`px-6 py-6 text-[9px] font-sans font-bold uppercase tracking-[0.2em] ${col.className || ''}`}>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-ash-muted transition-colors">
                    {col.header}
                    {col.sortable && <ArrowUpDown className="w-3 h-3 text-white/60" strokeWidth={1.5} />}
                  </div>
                </th>
              ))}
              <th className="px-6 py-6 text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ash-light">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-6 py-24 text-center text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-ash-muted">
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <tr 
                  key={row.id || i} 
                  className={`hover:bg-[#FAFAFA] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" className="border-ash-light outline-none" />
                  </td>
                  {columns.map((col, j) => (
                    <td key={j} className={`px-6 py-4 text-ash text-sm font-light ${col.className || ''}`}>
                      {typeof col.accessor === 'function' ? col.accessor(row) : String(row[col.accessor] as any)}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                    {renderActions ? renderActions(row) : (
                      <button className="text-ash-muted hover:text-ash transition-colors outline-none">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-ash-light flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-ash-muted">
        <div>
          Showing <span className="text-ash">{startIndex + 1}</span> to <span className="text-ash">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> of <span className="text-ash">{filteredData.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="hover:text-ash disabled:opacity-30 transition-colors outline-none"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
          </button>
          <span className="text-ash">
            {currentPage} / {totalPages || 1}
          </span>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
            className="hover:text-ash disabled:opacity-30 transition-colors outline-none"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
})
