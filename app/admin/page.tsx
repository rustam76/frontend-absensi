"use client";

import {
  createSelectionColumn,
  createSortableHeader,
  DataTable,
  DataTableConfig,
} from "@/components/DataTable";
import { createDepartement, deleteDepartement, getDepartementsAll, updateDepartement } from "@/lib/api";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import React from "react";
import { DepartementModal } from "../admin/departement/DepartementModal";
import { DeleteDepartementModal } from "../admin/departement/DeleteDepartementModal";
import { Departement } from "@/types/type";



export default function Page() {
  const [data, setData] = React.useState<Departement[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddModal, setShowAddModal] = React.useState(false);

  const fetchData = async () => {
    try {
      const res = await getDepartementsAll();
      setData(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Handler untuk menambah departement
  const handleAddDepartement = async (newDepartement: Omit<Departement, 'id'>) => {
    try {
      const newId = Math.max(...data.map(d => d.id), 0) + 1;
      const departementWithId = { ...newDepartement, id: newId };

      await createDepartement(departementWithId);
      setData(prev => [...prev, departementWithId]);
      fetchData(); // Refresh data dari server
    } catch (error) {
      console.error("Error adding departement:", error);
    }
  };

  const config: DataTableConfig<Departement> = {
    title: "Data Departement",
    description: "Daftar semua departement yang ada di perusahaan",
    customActions: (
     <DepartementModal
          mode="add"
          onSave={handleAddDepartement}
        />
    ),

    onExport: (data) => {
      console.log("Exporting data:", data);
    },
  };

  const columns: ColumnDef<Departement>[] = [
    createSelectionColumn(),
    {
      accessorKey: "departement_name",
      header: createSortableHeader("Departement Name"),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("departement_name")}</div>
      ),
    },
    {
      accessorKey: "max_clock_in_time",
      header: createSortableHeader("Max Clock In Time"),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("max_clock_in_time")}</div>
      ),
    },
    {
      accessorKey: "max_clock_out_time",
      header: createSortableHeader("Max Clock Out Time"),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("max_clock_out_time")}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const departement = row.original;

        const handleEdit = async (updatedDepartement: Departement) => {
          try {
            await updateDepartement(departement.id, updatedDepartement);
            fetchData();
          } catch (error) {
            console.error("Error updating departement:", error);
          }
        };

        const handleDelete = async () => {
          try {
            await deleteDepartement(departement.id);
            fetchData();
          } catch (error) {
            console.error("Error deleting departement:", error);
          }
        };

        return (
          <div className="flex gap-2">
            <DepartementModal
              mode="edit"
              departement={departement}
              onSave={handleEdit}
            />
            <DeleteDepartementModal onDelete={handleDelete} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex w-full p-10">
      <DataTable<Departement>
        data={data}
        columns={columns}
        className="w-full"
        config={config}
        loading={loading}
      />

     
    </div>
  );
}