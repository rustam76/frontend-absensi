"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Home,
  MapPin,
  User,
  FileText,
  Star,
  UserCheck,
  CheckCircle,
  Filter,
  CalendarDays,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import { clockIn, clockOut, getLogs } from "@/lib/api";
import { AttendanceRecord } from "@/types/type";
import { Badge } from "@/components/ui/badge";
import { checkStatusAttendance, formatDate, formatTime, getTodayInJakarta } from "@/lib/utils";
import { AttendanceDialog } from "./AttendanceDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AttendanceApp() {
  const { user, logout } = useAuth(); // Pastikan logout function tersedia di AuthContext
  const [greeting, setGreeting] = useState("Hello");
  const [data, setData] = React.useState<AttendanceRecord[]>([]);
  const [filteredData, setFilteredData] = React.useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [todayStatus, setTodayStatus] = useState<
    "checkin" | "checkout" | "done"
  >("checkin");

  const [attendance_id, setAttendanceID] = useState<string>();

  // Filter states
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State untuk success dialog
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successData, setSuccessData] = useState<{
    type: "checkin" | "checkout";
    time: string;
    date: string;
  } | null>(null);

 const updateTodayStatus = (logs: AttendanceRecord[]) => {
  const today = getTodayInJakarta(); // "YYYY-MM-DD" dalam zona waktu Jakarta

  const todayLog = logs.find((log) => {
    console.log("Log:", log.date_attendance);

    const logDate = new Date(log.date_attendance).toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });
    console.log("Log date:", logDate, "Today:", today);

    return logDate === today;
  });

  console.log("Today's log:", todayLog);

  setAttendanceID(todayLog?.attendance_id);

  if (!todayLog) {
    setTodayStatus("checkin");
  } else if (todayLog.clock_in && !todayLog.clock_out) {
    setTodayStatus("checkout");
  } else if (todayLog.clock_in && todayLog.clock_out) {
    setTodayStatus("done");
  }
};


  const fetchData = async () => {
    if (!user?.employee_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getLogs({
        start_date: "",
        end_date: "",
        employee_id: user?.employee_id.toString(),
        departement_id: "",
      });
      setData(res || []);
      setFilteredData(res || []);
      updateTodayStatus(res || []);
      console.log("Fetched data for user:", user.employee_id, res);
    } catch (error) {
      console.log("Error fetching data:", error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter function
  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((log) => {
      const logDate = new Date(log.date_attendance);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return logDate >= start && logDate <= end;
      } else if (start) {
        return logDate >= start;
      } else if (end) {
        return logDate <= end;
      }
      return true;
    });

    setFilteredData(filtered);
    setVisibleCount(10);
  };

  // Clear filter
  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(data);
    setVisibleCount(10);
  };

  // Load more data
  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Clear all local state
      setData([]);
      setFilteredData([]);
      setTodayStatus("checkin");
      setAttendanceID(undefined);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchData();
  };

  React.useEffect(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  // Fetch data when user changes
  React.useEffect(() => {
    if (user?.employee_id) {
      fetchData();
    } else {
      // Clear data if no user
      setData([]);
      setFilteredData([]);
      setLoading(false);
    }
  }, [user?.employee_id]); // Dependency on employee_id to refetch when user changes

  // Apply filter when dates change
  React.useEffect(() => {
    applyDateFilter();
  }, [startDate, endDate, data]);

  const handleCheckIn = async () => {
    if (!user?.employee_id) return;
    
    try {
      const res = await clockIn(user?.employee_id);
      console.log("Check in response:", res);

      const now = new Date();
      setSuccessData({
        type: "checkin",
        time: now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        date: now.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
      setShowSuccessDialog(true);

      // Refresh data after successful check in
      fetchData();
    } catch (error) {
      console.log("Check in error:", error);
    }
  };

  const handleCheckOut = async () => {
    if (!user?.employee_id || !attendance_id) return;
    
    try {
      const res = await clockOut(user?.employee_id, attendance_id);
      console.log("Check out response:", res);

      const now = new Date();
      setSuccessData({
        type: "checkout",
        time: now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        date: now.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
      setShowSuccessDialog(true);

      // Refresh data after successful check out
      fetchData();
    } catch (error) {
      console.log("Check out error:", error);
    }
  };

  // Show loading if user data is not available
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center">
        <div className="text-white text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      {/* Header */}
      <div className="px-6 py-8 text-white relative">
        {/* Logout and Refresh buttons */}
        <div className="absolute top-4 right-6 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="text-white hover:bg-white/20 p-2"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-white/20 p-2"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mb-2 mt-8">
          <div className="flex-1">
            <h1 className="text-xl font-medium text-blue-100">{greeting},</h1>
            <h2 className="text-2xl font-bold text-white mb-1">{user?.name ?? "User"}</h2>
            <div className="flex items-center gap-2">
              <p className="text-blue-200 text-sm">{user?.departement ?? "Department"}</p>
              <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                ID: {user?.employee_id}
              </Badge>
            </div>
          </div>
          <Avatar className="w-16 h-16 border-2 border-white/30">
            {/* <AvatarImage src={user?.} alt={user?.name} /> */}
            <AvatarFallback className="bg-white/20 text-white font-bold">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 rounded-t-3xl px-6 py-8 min-h-[80vh] shadow-2xl">
        {/* Working Schedule Card */}
        <Card className="mb-6 shadow-lg border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1">
            <CardContent className="p-5 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Working Schedule
                </h3>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Today</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {user?.max_clock_in_time ?? "08:00"} - {user?.max_clock_out_time ?? "17:00"}
                  </p>
                  <p className="text-sm text-gray-500">Working Hours</p>
                </div>
              </div>
              
              {todayStatus !== "done" && (
                <AttendanceDialog
                  status={todayStatus}
                  onConfirm={
                    todayStatus === "checkin" ? handleCheckIn : handleCheckOut
                  }
                />
              )}
              {todayStatus === "done" && (
                <Button
                  className="w-full bg-green-100 text-green-700 hover:bg-green-200 font-medium"
                  disabled
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Attendance Completed Today
                </Button>
              )}
            </CardContent>
          </div>
        </Card>

        {/* Attendance Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Attendance History
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 hover:bg-blue-50 border-blue-200"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Date Filter */}
          {showFilter && (
            <Card className="mb-4 shadow-md border-blue-100">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Filter by Date Range</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date" className="text-sm font-medium text-gray-700">
                      From Date
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date" className="text-sm font-medium text-gray-700">
                      To Date
                    </Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Badge variant="outline" className="px-2 py-1">
                      {filteredData.length} record(s)
                    </Badge>
                    found
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilter}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Clear Filter
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <Card className="shadow-md">
              <CardContent className="p-8 text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Loading Attendance Records</h4>
                <p className="text-gray-500">Please wait while we fetch your data...</p>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && filteredData.length === 0 && (
            <Card className="shadow-md border-dashed border-2 border-gray-200">
              <CardContent className="p-12 text-center">
                <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h4 className="text-xl font-medium text-gray-900 mb-3">
                  No Attendance Records Found
                </h4>
                <p className="text-gray-500 mb-4">
                  {(startDate || endDate) 
                    ? "No records found for the selected date range. Try adjusting your filters."
                    : "You haven't recorded any attendance yet. Start by checking in!"}
                </p>
                {(startDate || endDate) && (
                  <Button 
                    variant="outline" 
                    onClick={clearFilter}
                    className="hover:bg-blue-50"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Attendance Records */}
          {!loading && filteredData.length > 0 && (
            <div className="space-y-3">
              {filteredData.slice(0, visibleCount).map((log, index) => (
                <Card key={`${log.attendance_id}-${index}`} className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {formatDate(log.date_attendance)}
                          </h4>
                          <p className="text-sm text-gray-500">Attendance Record</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Clock In */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <p className="text-sm font-medium text-gray-700">Clock In</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-lg font-bold text-gray-900 mb-1">
                            {formatTime(log.clock_in) || "Not recorded"}
                          </p>
                          {log.clock_in && (
                            <Badge
                              variant={log.is_late ? "destructive" : "default"}
                              className="text-xs"
                            >
                              {checkStatusAttendance(
                                log.clock_in,
                                log.max_clock_in_time,
                                !log.is_late,
                                "in"
                              )}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Clock Out */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <p className="text-sm font-medium text-gray-700">Clock Out</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-lg font-bold text-gray-900 mb-1">
                            {formatTime(log.clock_out) || "Not recorded"}
                          </p>
                          {log.clock_out && (
                            <Badge
                              variant={log.is_leave_early ? "destructive" : "default"}
                              className="text-xs"
                            >
                              {checkStatusAttendance(
                                log.clock_out,
                                log.max_clock_out_time,
                                !log.is_leave_early,
                                "out"
                              )}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Load More Button */}
              {filteredData.length > visibleCount && (
                <div className="text-center pt-6">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    className="w-full md:w-auto px-8 py-3 hover:bg-blue-50 border-blue-200"
                  >
                    Load More Records ({filteredData.length - visibleCount} remaining)
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              {successData?.type === "checkin"
                ? "Check In Successful!"
                : "Check Out Successful!"}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              {successData?.type === "checkin"
                ? "You have successfully checked in at:"
                : "You have successfully checked out at:"}
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {successData?.time}
              </p>
              <p className="text-sm text-gray-600">{successData?.date}</p>
            </div>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full py-3 text-lg font-medium"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}