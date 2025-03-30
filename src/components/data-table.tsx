"use client";

import * as React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Define the type for a dataset record.
export type DatasetRecord = {
  id: string;
  name: string;
  description: string;
  createdAt: string; // upload time as ISO string
  team: string;      // team name, empty if none
  visibility: "PRIVATE" | "PUBLIC" | "TEAM";
  visualizations: number;
  owner: string;
};

// Sample data array for demonstration.
const data: DatasetRecord[] = [
  {
    id: "ds1",
    name: "Sales Data Jan 2023",
    description: "This dataset contains sales records for January 2023 including totals, averages, and variance data.",
    createdAt: "2023-01-31T12:00:00Z",
    team: "Marketing",
    visibility: "TEAM",
    visualizations: 3,
    owner: "Alice",
  },
  {
    id: "ds2",
    name: "Customer Feedback Q1",
    description: "Compilation of customer reviews and survey responses for the first quarter of 2023.",
    createdAt: "2023-04-01T09:30:00Z",
    team: "Support",
    visibility: "PRIVATE",
    visualizations: 2,
    owner: "Bob",
  },
  {
    id: "ds3",
    name: "Website Traffic Data",
    description: "Aggregated data tracking website visitors and engagement metrics over the past year.",
    createdAt: "2023-05-15T15:45:00Z",
    team: "",
    visibility: "PUBLIC",
    visualizations: 5,
    owner: "Charlie",
  },
];

// Define the columns for the table.
export const columns: ColumnDef<DatasetRecord>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "description",
    header: "Short Description",
    cell: ({ row }) => {
      const desc = row.getValue("description") as string;
      return desc.length > 50 ? desc.slice(0, 50) + "..." : desc;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Upload Time <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return date.toLocaleString();
    },
    sortingFn: (rowA, rowB) =>
      new Date(rowA.getValue("createdAt") as string).getTime() -
      new Date(rowB.getValue("createdAt") as string).getTime(),
  },
  {
    accessorKey: "team",
    header: "Team",
    cell: ({ row }) => row.getValue("team") || "None",
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
    cell: ({ row }) => row.getValue("visibility"),
  },
  {
    accessorKey: "visualizations",
    header: "Visualizations",
    cell: ({ row }) => row.getValue("visualizations"),
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => row.getValue("owner"),
  },
];

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* Filter input for team column */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter team..."
          value={(table.getColumn("team")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("team")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      </div>
      {/* Data Table */}
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s)
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
