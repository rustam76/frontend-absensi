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
import React, { useState } from "react";

type Departement = {
  id: number;
  departement_name: string;
  max_clock_in_time: string;
  max_clock_out_time: string;
};

interface Props {
  mode: "edit" | "add";
  departement?: Departement;
  onSave: (data: Departement) => void;
}

export function DepartementModal({ mode, departement, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Departement>(
    departement ?? {
      id: 0,
      departement_name: "",
      max_clock_in_time: "08:00",
      max_clock_out_time: "17:00",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setOpen(false); 
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              Add Departement
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? "Edit Departement" : "Add Departement"}
            </DialogTitle>
            <DialogDescription>
              {mode === "edit"
                ? "Update the departement's details."
                : "Fill out to create a new departement."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="departement_name">Departement Name</Label>
              <Input
                name="departement_name"
                value={form.departement_name}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_clock_in_time">Max Clock In Time</Label>
              <Input
                name="max_clock_in_time"
                type="time"
                value={form.max_clock_in_time}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_clock_out_time">Max Clock Out Time</Label>
              <Input
                name="max_clock_out_time"
                type="time"
                value={form.max_clock_out_time}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{mode === "edit" ? "Save" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
