import * as React from "react";
import {
  ColumnDef
} from "@tanstack/react-table";
import { ArrowUpDown, Clock, User, Building2, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AttendanceRecord } from "@/types/type";
import { checkStatusAttendance, formatTime, getStatusVariant } from "@/lib/utils";

export const columns: ColumnDef<AttendanceRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "employee_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          Employee Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <span className="font-medium">{row.getValue("employee_name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "departement_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-xs">
          {row.getValue("departement_name")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "date_attendance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateStr = row.getValue("date_attendance") as string;
      const date = new Date(dateStr);
      const formatted = date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        weekday: "short"
      });
      
      // Check if it's today
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      
      return (
        <div className="flex flex-col">
          <span className={`font-medium ${isToday ? 'text-primary' : ''}`}>
            {formatted}
          </span>
          {isToday && (
            <Badge variant="default" className="text-xs w-fit mt-1">
              Today
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "clock_in",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          Clock In
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const clockIn = row.getValue("clock_in");
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-mono text-sm">
            {clockIn ? formatTime(clockIn) : "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "clock_out",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          Clock Out
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const clockOut = row.getValue("clock_out");
      return (
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${clockOut ? 'bg-red-500' : 'bg-gray-300'}`}></div>
          <span className="font-mono text-sm">
            {clockOut ? formatTime(clockOut) : "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status_clock_in",
    header: "Clock In Status",
    cell: ({ row }) => {
      const { clock_in, max_clock_in_time, is_late } = row.original;
      const statusData = checkStatusAttendance(clock_in, max_clock_in_time, is_late === false, 'in');
      
      // Determine badge variant based on status
      let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
      if (statusData?.toLowerCase().includes("late")) {
        variant = "destructive";
      } else if (statusData?.toLowerCase().includes("on time") || statusData?.toLowerCase().includes("early")) {
        variant = "default";
      }
      
      return (
        <Badge variant={variant} className="text-xs font-medium">
          {statusData || "No Data"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status_clock_out",
    header: "Clock Out Status",
    cell: ({ row }) => {
      const { clock_out, max_clock_out_time, is_leave_early } = row.original;
      const statusData = checkStatusAttendance(clock_out, max_clock_out_time, is_leave_early === false, 'out');
      
      // Determine badge variant based on status
      let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
      if (statusData?.toLowerCase().includes("early")) {
        variant = "destructive";
      } else if (statusData?.toLowerCase().includes("on time") || statusData?.toLowerCase().includes("overtime")) {
        variant = "default";
      }
      
      return (
        <Badge variant={variant} className="text-xs font-medium">
          {statusData || "No Data"}
        </Badge>
      );
    },
  },
  
];