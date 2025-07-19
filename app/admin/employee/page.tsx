"use client";

import {
  createSelectionColumn,
  createSortableHeader,
  DataTable,
  DataTableConfig,
} from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  createEmployee,
  deleteEmployee,
  getDepartementsAll,
  getEmployeesAll,
  updateEmployee,
} from "@/lib/api";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import React from "react";
import { EmployeeModal } from "./EmployeeModal";
import { DeleteEmployeeModal } from "./DeleteEmployeeModal";
import Link from "next/link";
import { Employee, EmployeeBase, Departement } from "@/types/type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const [data, setData] = React.useState<Employee[]>([]);
  const [departements, setDepartements] = React.useState<Departement[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogMessage, setDialogMessage] = React.useState<string | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [filterDepartment, setFilterDepartment] = React.useState<string>("__all__");

  const fetchData = async () => {
    try {
      const res = await getEmployeesAll();
      setData(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartements = async () => {
    try {
      const res = await getDepartementsAll(); 
      setDepartements(res);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchData();
    fetchDepartements();
  }, []);

  const showSuccessDialog = (message: string) => {
    setDialogMessage(message);
    setOpenDialog(true);
    setTimeout(() => setOpenDialog(false), 2000);
  };

  const handleAddEmployee = async (employeeData: EmployeeBase) => {
    try {
      const newId = Math.max(...data.map((d) => d.id), 0) + 1;
      const employeeWithId = { ...employeeData, id: newId };
      await createEmployee(employeeWithId);
      fetchData();
      showSuccessDialog("Berhasil menambahkan karyawan");
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleEditEmployee = async (employeeData: Employee) => {
    try {
      await updateEmployee(employeeData.employee_id, employeeData);
      fetchData();
      showSuccessDialog("Berhasil mengedit karyawan");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDeleteEmployee = async (employee_id: string) => {
    try {
      await deleteEmployee(employee_id);
      fetchData();
      showSuccessDialog("Berhasil menghapus karyawan");
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const config: DataTableConfig<Employee> = {
    title: "Data Employee",
    description: "Daftar semua employee sistem",
    customActions: (
      <div className="flex gap-4 items-center">
        <Select
          onValueChange={(val) => setFilterDepartment(val)}
          value={filterDepartment}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter Departement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Semua Departement</SelectItem>
            {departements.map((dept) => (
              <SelectItem key={dept.id} value={dept.departement_name}>
                {dept.departement_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <EmployeeModal mode="add" onSave={handleAddEmployee} />
      </div>
    ),
  };

  const employeeColumns: ColumnDef<Employee>[] = [
    createSelectionColumn(),
    {
      accessorKey: "employee_id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("employee_id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: createSortableHeader("Name"),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "address",
      header: createSortableHeader("Address"),
      cell: ({ row }) => (
        <div
          className="font-medium max-w-xs truncate"
          title={row.getValue("address")}
        >
          {row.getValue("address")}
        </div>
      ),
    },
    {
      accessorKey: "departement_name",
      header: createSortableHeader("Department"),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("departement_name") ?? "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex flex-wrap gap-2">
            <Link href={`/admin/employee/${employee.employee_id}`}>
              <Button variant="default" size="sm">
                <EyeIcon className="mr-2 h-4 w-4" />
                Lihat
              </Button>
            </Link>
            <EmployeeModal
              mode="edit"
              employee={employee}
              onSave={handleEditEmployee}
            />
            <DeleteEmployeeModal
              onDelete={() => handleDeleteEmployee(employee.employee_id)}
            />
          </div>
        );
      },
    },
  ];

  const filteredData = filterDepartment !== "__all__"
    ? data.filter((item) => item.departement_name === filterDepartment)
    : data;

  return (
    <div className="w-full overflow-auto p-10">
      <div className="min-w-[768px]">
        <DataTable<Employee>
          data={filteredData}
          columns={employeeColumns}
          className="w-full"
          config={config}
          loading={loading}
        />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle>Berhasil</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}