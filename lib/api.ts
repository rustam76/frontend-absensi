import { EmployeeBase } from "@/types/type";


const apiUrl = process.env.NEXT_PUBLIC_API_URL 


// Authentication API output token
export async function login(employeeId: string) {
    const res = await fetch(`${apiUrl}/login/${employeeId}`, {
        method: 'POST',
    });
    return res.json();
}



/*
Start Employee API
*/
export async function getEmployeesAll() {
    const res = await fetch(`${apiUrl}/employee`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return res.json();    
}

export async function getEmployeeById(id: string) {
    const res = await fetch(`${apiUrl}/employee/${id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }});
    return res.json();    
}

export async function createEmployee(employee: any) {
    const res = await fetch(`${apiUrl}/employee`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
             'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(employee),
    });
    return res.json();    
}

export async function updateEmployee(id: string, employee: EmployeeBase) {
    const res = await fetch(`${apiUrl}/employee/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
             'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(employee),
    });
    return res.json();
}


export async function deleteEmployee(id: string) {
    const res = await fetch(`${apiUrl}/employee/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
             'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return res.json();
}

/*
End Employee API
*/


/*
Start Departement API
*/

export async function getDepartementsAll() {
    const res = await fetch(`${apiUrl}/departement`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return res.json();    
}

export async function getDepartementById(id: number) {
    const res = await fetch(`${apiUrl}/departement/${id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }});
    return res.json();    
}

export async function createDepartement(departement: any) {
    const res = await fetch(`${apiUrl}/departement`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(departement),
    });
    return res.json();    
}

export async function updateDepartement(id: number, departement: any) {
    const res = await fetch(`${apiUrl}/departement/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(departement),
    });
    return res.json();
}


export async function deleteDepartement(id: number) {
    const res = await fetch(`${apiUrl}/departement/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return res.json();
}
/*
End Departement API
*/

/*
Start Clock API
*/
export async function clockIn(employeeId: any) {
    const res = await fetch(`${apiUrl}/attendance/clock-in/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ employee_id: employeeId })
    });
    return res.json();    
}

export async function clockOut(employeeId: any, attendanceId: any) {
    const res = await fetch(`${apiUrl}/attendance/clock-out/${attendanceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ employee_id: employeeId })
    });
    return res.json();
}

/*
End Clock API
*/

/*
List Logs API
*/
interface LogParams {
  start_date?: string;
  end_date?: string;
  departement_id?: string;
  employee_id?: string;
}
export async function getLogs({ start_date, end_date, departement_id, employee_id }: LogParams = {}) {
  const params = new URLSearchParams();

  if (start_date) params.append('start_date', start_date);
  if (end_date) params.append('end_date', end_date);
  if (departement_id) params.append('departement_id', departement_id);
  if (employee_id) params.append('employee_id', employee_id);

  const res = await fetch(`${apiUrl}/attendance/logs?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return res.json();
}