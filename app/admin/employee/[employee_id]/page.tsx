"use client";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { AttendanceRecord, Employee } from "@/types/type";
import { getEmployeeById, getLogs } from "@/lib/api";

import { DataTable } from "@/components/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FilterIcon, RefreshCcwIcon, ArrowLeftIcon, UserIcon, MapPinIcon, BuildingIcon } from "lucide-react";
import { columns } from "./AttendanceColumns";

export default function EmployeeDetailPage() {
  const { employee_id } = useParams() as { employee_id: string };
  const router = useRouter();

  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [logs, setLogs] = React.useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterLoading, setFilterLoading] = React.useState(false);
  
  // Date filter states
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const fetchLogs = async (start_date: string = "", end_date: string = "") => {
    try {
      setFilterLoading(true);
      const logData = await getLogs({ 
        start_date, 
        end_date, 
        employee_id, 
        departement_id: "" 
      });
      const logsArray = Array.isArray(logData) ? logData : [];
      setLogs(logsArray);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setFilterLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeData] = await Promise.all([
          getEmployeeById(employee_id)
        ]);
        setEmployee(employeeData ?? null);
        await fetchLogs();
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [employee_id]);

  // Filter logs by date range
  const handleDateFilter = async () => {
    if (!startDate && !endDate) {
      alert("Please select at least one date to filter");
      return;
    }
    await fetchLogs(startDate, endDate);
  };

  // Reset filter
  const handleResetFilter = async () => {
    setStartDate("");
    setEndDate("");
    await fetchLogs();
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Quick filter functions
  const handleTodayFilter = async () => {
    const today = getTodayDate();
    setStartDate(today);
    setEndDate(today);
    await fetchLogs(today, today);
  };

  const handleThisWeekFilter = async () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    const startDateStr = firstDayOfWeek.toISOString().split('T')[0];
    const endDateStr = lastDayOfWeek.toISOString().split('T')[0];
    
    setStartDate(startDateStr);
    setEndDate(endDateStr);
    await fetchLogs(startDateStr, endDateStr);
  };

  const handleThisMonthFilter = async () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const startDateStr = firstDayOfMonth.toISOString().split('T')[0];
    const endDateStr = lastDayOfMonth.toISOString().split('T')[0];
    
    setStartDate(startDateStr);
    setEndDate(endDateStr);
    await fetchLogs(startDateStr, endDateStr);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-6 w-72" />
            <Skeleton className="h-6 w-56" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">Employee not found.</p>
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="mt-4"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>
        <Badge variant="outline" className="text-sm">
          Employee Details
        </Badge>
      </div>

      {/* Employee Information Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <UserIcon className="w-6 h-6 text-primary" />
            Employee Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-semibold">{employee.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPinIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-semibold">{employee.address}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <BuildingIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-semibold">{employee.departement_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Logs Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Attendance Logs
            </CardTitle>
            <Badge variant="secondary" className="ml-auto">
              {logs.length} Records
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Date Filter Section */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <FilterIcon className="w-4 h-4 text-primary" />
                  <Label className="text-sm font-semibold">Filter by Date Range</Label>
                </div>
                
                {/* Quick Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleTodayFilter}
                    disabled={filterLoading}
                    className="text-xs"
                  >
                    Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleThisWeekFilter}
                    disabled={filterLoading}
                    className="text-xs"
                  >
                    This Week
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleThisMonthFilter}
                    disabled={filterLoading}
                    className="text-xs"
                  >
                    This Month
                  </Button>
                </div>

                {/* Custom Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="start-date" className="text-sm">From Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={getTodayDate()}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end-date" className="text-sm">To Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      max={getTodayDate()}
                      min={startDate}
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleDateFilter}
                    disabled={filterLoading}
                    className="w-full md:w-auto"
                  >
                    {filterLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Filtering...
                      </>
                    ) : (
                      <>
                        <FilterIcon className="w-4 h-4 mr-2" />
                        Apply Filter
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleResetFilter}
                    disabled={filterLoading}
                    className="w-full md:w-auto"
                  >
                    <RefreshCcwIcon className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Active Filter Display */}
                {(startDate || endDate) && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Active Filter:</span>
                    <Badge variant="secondary" className="text-xs">
                      {startDate && endDate 
                        ? `${startDate} to ${endDate}`
                        : startDate 
                          ? `From ${startDate}`
                          : `Until ${endDate}`
                      }
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          {columns && logs.length >= 0 && (
            <DataTable
              data={logs}
              columns={columns}
              className="w-full"
              config={{
                title: "Attendance Records",
                description: `Attendance logs for ${employee.name}`,
                filterableColumns: ["date_attendance"],
                emptyMessage: "No attendance records found for the selected period.",
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}