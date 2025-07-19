"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Download, X, Search, Calendar, User, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Generic types
export type DataTableConfig<T> = {
  title?: string
  description?: string
  showSelection?: boolean
  showFilters?: boolean
  showColumnVisibility?: boolean
  showPagination?: boolean
  showExport?: boolean
  pageSize?: number
  filterableColumns?: (keyof T)[]
  hiddenColumns?: (keyof T)[]
  customActions?: React.ReactNode
  onExport?: (data: T[]) => void
  onSelectionChange?: (selectedRows: T[]) => void
  searchPlaceholder?: string
  emptyMessage?: string
}

// Common utility functions
export const formatUtils = {
  dateTime: (dateString: string, locale: string = 'id-ID') => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  },

  time: (dateString: string, locale: string = 'id-ID') => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  },

  date: (dateString: string, locale: string = 'id-ID') => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  },

  currency: (amount: number, currency: string = 'IDR', locale: string = 'id-ID') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount)
  },

  number: (value: number, locale: string = 'id-ID') => {
    return new Intl.NumberFormat(locale).format(value)
  },

  statusBadge: (status: string, statusMap?: Record<string, "default" | "destructive" | "secondary" | "outline">) => {
    if (statusMap && statusMap[status]) {
      return statusMap[status]
    }
    
    // Default status mapping
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes('success') || lowerStatus.includes('complete') || lowerStatus.includes('tepat waktu') || lowerStatus.includes('active')) {
      return "default"
    }
    if (lowerStatus.includes('error') || lowerStatus.includes('failed') || lowerStatus.includes('terlambat') || lowerStatus.includes('late')) {
      return "destructive"
    }
    if (lowerStatus.includes('warning') || lowerStatus.includes('pending') || lowerStatus.includes('inactive')) {
      return "secondary"
    }
    return "outline"
  }
}

// Generic filter component
const DataTableFilters = <T,>({ 
  table, 
  filterableColumns = [],
  searchPlaceholder = "Search...",
  onClearFilters 
}: {
  table: any
  filterableColumns?: (keyof T)[]
  searchPlaceholder?: string
  onClearFilters: () => void
}) => {
  const hasFilters = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filterableColumns.map((columnKey) => (
        <div key={String(columnKey)} className="flex items-center gap-2">
          <Input
            placeholder={`Filter by ${String(columnKey).replace(/_/g, ' ')}...`}
            value={(table.getColumn(String(columnKey))?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(String(columnKey))?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      ))}
      {hasFilters && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="h-8 px-2 lg:px-3"
        >
          Clear
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

// Main generic component
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  config?: DataTableConfig<T>
  loading?: boolean
  error?: string
  className?: string
}

export function DataTable<T>({ 
  data = [], 
  columns,
  config = {},
  loading = false,
  error,
  className = ""
}: DataTableProps<T>) {
  const {
    title = "Data Table",
    description,
    showSelection = true,
    showFilters = true,
    showColumnVisibility = true,
    showPagination = true,
    showExport = true,
    pageSize = 10,
    filterableColumns = [],
    hiddenColumns = [],
    customActions,
    onExport,
    onSelectionChange,
    searchPlaceholder = "Search...",
    emptyMessage = "No data found."
  } = config

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    const visibility: VisibilityState = {}
    hiddenColumns.forEach(col => {
      visibility[String(col)] = false
    })
    return visibility
  })
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Handle selection change
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)
      onSelectionChange(selectedRows)
    }
  }, [rowSelection, onSelectionChange, table])

  const handleExport = React.useCallback(() => {
    if (onExport) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)
      const dataToExport = selectedRows.length > 0 ? selectedRows : data
      onExport(dataToExport)
    }
  }, [onExport, table, data])

  const clearFilters = React.useCallback(() => {
    setColumnFilters([])
  }, [])

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Error loading data: {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {customActions}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showFilters && (
                <DataTableFilters
                  table={table}
                  filterableColumns={filterableColumns}
                  searchPlaceholder={searchPlaceholder}
                  onClearFilters={clearFilters}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              {showExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={loading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              )}
              {showColumnVisibility && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id.replace(/_/g, " ")}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Loading data...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {showPagination && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {showSelection && (
                  <>
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value))
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={table.getState().pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {'<<'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {'<'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {'>'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    {'>>'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to create selection column
export const createSelectionColumn = <T,>(): ColumnDef<T> => ({
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
})

// Helper function to create sortable header
export const createSortableHeader = (label: string) => ({ column }: any) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="h-8 p-0 font-semibold"
  >
    {label}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
)