"use client";

import * as React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
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
import { Input } from "@/components/ui/input";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { authClient } from "@/lib/auth-client";

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

export const columns: ColumnDef<DatasetRecord>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "description",
    header: "Description",
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
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
    sortingFn: (a, b) =>
      new Date(a.getValue("createdAt")).getTime() -
      new Date(b.getValue("createdAt")).getTime(),
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

function DatasetSection({ title, data }: { title: string; data: DatasetRecord[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data.length) return null;

  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
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

export function DataTable() {
  const { activeTeam } = useTeam();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user?.name ?? "";
  const [datasets, setDatasets] = useState<DatasetRecord[]>([]);

  useEffect(() => {
    const url = activeTeam?.id ? `/api/dataset?teamId=${activeTeam.id}` : "/api/dataset";
    fetch(url)
      .then((res) => res.json())
      .then(setDatasets);
  }, [activeTeam]);

  // Divide into three sections
  const publicData = datasets.filter((d) => d.visibility === "PUBLIC");
  const privateData = datasets.filter(
    (d) => d.visibility === "PRIVATE" && d.owner === currentUser
  );
  const teamData = datasets.filter((d) => d.visibility === "TEAM");

  return (
    <div className="w-full">
      <DatasetSection title="Public Datasets" data={publicData} />
      <DatasetSection title={`Private Datasets (owned by ${currentUser})`} data={privateData} />
      <DatasetSection title="Team Datasets" data={teamData} />
    </div>
  );
}