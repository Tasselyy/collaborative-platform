import {DataTable} from "@/components/data-table";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dataset Overview</h1>
      <DataTable />
    </div>
  );
}
