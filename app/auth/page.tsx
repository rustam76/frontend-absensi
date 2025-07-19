"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { GalleryVerticalEnd, Loader2Icon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [employeeId, setEmployeeId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting login with:", employeeId);
    if (!employeeId) return;
    await login(employeeId);
  };
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Absensi.</span>
                </a>
                <h1 className="text-xl font-bold">Welcome to Absensi.</h1>
                <div className="text-center text-sm">
                  Aplikasi Absensi Karyawan
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Nomor Karyawan</Label>
                  <Input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="Masukkan Nomor Karyawan"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {loading ? (
                    <>
                      <Loader2Icon className="animate-spin" />
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
