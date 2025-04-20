"use client";

import * as React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export type DatasetRecord = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  team: string;
  visibility: "PRIVATE" | "PUBLIC" | "TEAM";
  visualizations: number;
  owner: string;
};

export function DataTable() {
  const { activeTeam } = useTeam();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user?.name ?? "";
  const [datasets, setDatasets] = useState<DatasetRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const router = useRouter();

  useEffect(() => {
    const url = activeTeam?.id ? `/api/dataset?teamId=${activeTeam.id}` : "/api/dataset";
    fetch(url)
      .then((res) => res.json())
      .then(setDatasets);
  }, [activeTeam]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // ⏱ 300ms debounce

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Handles row click and navigates to metadata page
  const handleRowClick = (dataset: DatasetRecord) => {
    router.push(`/dashboard/metadata/${dataset.id}`);
  };

  // Column definitions with clickable rows and sorting
  const columns: ColumnDef<DatasetRecord>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-right justify-center w-full"
        >
          Name <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const desc = row.getValue("description") as string;
        return <div className="text-center">{desc.length > 50 ? desc.slice(0, 50) + "..." : desc}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-right justify-center w-full"
        >
          Upload Time <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{new Date(row.getValue("createdAt")).toLocaleString()}</div>,
      sortingFn: (a, b) =>
        new Date(a.getValue("createdAt")).getTime() -
        new Date(b.getValue("createdAt")).getTime(),
    },
    {
      accessorKey: "team",
      header: "Team",
      cell: ({ row }) => <div className="text-center">{row.getValue("team") || "None"}</div>,
    },
    {
      accessorKey: "visibility",
      header: "Visibility",
      cell: ({ row }) => <div className="text-center">{row.getValue("visibility")}</div>,
    },
    {
      accessorKey: "visualizations",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-right justify-center w-full"
        >
          Visualizations <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("visualizations")}</div>,
    },
    {
      accessorKey: "owner",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-right justify-center w-full"
        >
          Owner <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("owner")}</div>,
    },
  ];

  // Divide into three sections
  const query = debouncedQuery.toLowerCase();

  const publicData = datasets.filter(
    (d) =>
      d.visibility === "PUBLIC" &&
      d.name.toLowerCase().includes(query)
  );

  const privateData = datasets.filter(
    (d) =>
      d.visibility === "PRIVATE" &&
      d.owner === currentUser &&
      d.name.toLowerCase().includes(query)
  );

  const teamData = datasets.filter(
    (d) =>
      d.visibility === "TEAM" &&
      d.name.toLowerCase().includes(query)
  );

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {activeTeam ? (
            <>
              Currently Selected Team:{" "}
              <span className="font-semibold text-foreground">
                {activeTeam.name}
              </span>
            </>
          ) : (
            "No team selected"
          )}
        </div>

        <Input
          placeholder="Search datasets by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <DatasetSection
        title="Public Datasets"
        data={publicData}
        columns={columns}
        onRowClick={handleRowClick}
      />
      <DatasetSection
        title={`Private Datasets (owned by ${currentUser})`}
        data={privateData}
        columns={columns}
        onRowClick={handleRowClick}
      />
      <DatasetSection
        title="Team Datasets"
        data={teamData}
        columns={columns}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

function DatasetSection({
  title,
  data,
  columns,
  onRowClick
}: {
  title: string;
  data: DatasetRecord[];
  columns: ColumnDef<DatasetRecord>[];
  onRowClick: (dataset: DatasetRecord) => void;
}) {
  // Add sorting state
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (!data.length) return null;

  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-3 text-left">{title}</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick(row.original)}
                className="cursor-pointer hover:bg-gray-100"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}