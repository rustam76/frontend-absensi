"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getDepartementsAll } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeBase } from "@/types/type";

type Departement = {
  id: number;
  departement_name: string;
};

type Employee = {
  id?: number; // Tambahkan id untuk edit mode
  employee_id: string;
  name: string;
  address: string;
  departement_id: string;
};


interface Props {
  employee?: Employee;
  mode: "edit" | "add";
  onSave: (data: EmployeeBase | Employee) => void;
}


export function EmployeeModal({ employee, mode, onSave }: Props) {
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<Employee>(
    employee ?? {
      employee_id: "",
      name: "",
      address: "",
      departement_id: "",
    }
  );

  console.log("Form data:", form);
  console.log("Available departments:", departements);
  
  useEffect(() => {
    fetchDepartement();
  }, []);

  useEffect(() => {
    // Update form ketika props `employee` berubah dan modal dibuka
    if (employee && open) {
      setForm({
        ...employee,
        // Pastikan departement_id adalah string
        departement_id: String(employee.departement_id),
      });
    }
  }, [employee, open]);

  const fetchDepartement = async () => {
    try {
      const data = await getDepartementsAll();
      setDepartements(data);
    } catch (err) {
      console.error("Failed to fetch departements", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectDepartement = (value: string) => {
    console.log("Selected department ID:", value);
    setForm((prev) => ({
      ...prev,
      departement_id: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pastikan semua field terisi
    if (!form.employee_id || !form.name || !form.address || !form.departement_id) {
      return;
    }

    // Untuk edit mode, pastikan id disertakan
    const dataToSave = mode === "edit" && employee?.id 
      ? { ...form, id: employee.id }
      : form;

    console.log("Saving data:", dataToSave);
    onSave(dataToSave);
    setOpen(false);
    
    // Reset form untuk mode add
    if (mode === "add") {
      setForm({
        employee_id: "",
        name: "",
        address: "",
        departement_id: "",
      });
    }
  };

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    
    // Reset form ketika modal ditutup untuk mode add
    if (!isOpen && mode === "add") {
      setForm({
        employee_id: "",
        name: "",
        address: "",
        departement_id: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModalChange}>
      <DialogTrigger asChild>
        <Button variant={mode === "edit" ? "secondary" : "default"}>
          {mode === "edit" ? (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
            <DialogDescription>
              {mode === "edit"
                ? "Update employee information."
                : "Fill the form to add a new employee."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                className="w-full"
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                disabled={mode === "edit"}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                className="w-full"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                className="w-full"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="departement_id">Department</Label>
              <Select
                value={form.departement_id}
                onValueChange={handleSelectDepartement}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departements.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.departement_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {mode === "edit" ? "Save Changes" : "Create Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}