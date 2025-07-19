export type AttendanceRecord = {
  attendance_id: string;
  employee_name: string;
  departement_name: string;
  date_attendance: string;
  clock_in: string;
  clock_out: string;
  max_clock_in_time: string;
  max_clock_out_time: string;
  status_clock_in: string;
  status_clock_out: string;
  is_late: boolean;
  is_leave_early: boolean;
};


export type Employee = {
     id: number;
  employee_id: string;
  name: string;
    address: string;
  departement_id: string;
  departement_name: string;
}

export type Departement = {
  id: number;
  departement_name: string;
  max_clock_in_time: string;
  max_clock_out_time: string;
}

export type EmployeeBase = {
  employee_id: string;
  name: string;
  address: string;
  departement_id: number;
};