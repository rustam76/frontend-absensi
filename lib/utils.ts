import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(dateTimeString: string) {
  if (!dateTimeString) return "-";
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return "-";

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
  };

  return date.toLocaleString("en-GB", options);
}

export function formatTime(dateTimeString: string): string {
  if (!dateTimeString) return "-";
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return "-";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function getCurrentTimeString(): string {
  const now = new Date()

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}


export function checkStatusAttendance(
  clock: string,               
  maxClock: string,            
  isCheck: boolean,            
  type: "in" | "out"          
): string {
  if (!clock) {
    return "Belum Absen";
  }

  if (isCheck) {
    return type === "in" ? "Tepat Waktu" : "Pulang Tepat Waktu";
  }

  // Ambil jam dari waktu absen dan batas
  const clockTime = new Date(clock);
  const [hour, minute, second] = maxClock.split(":").map(Number);
  const maxTime = new Date(clockTime);
  maxTime.setHours(hour, minute, second, 0);

  // Bandingkan waktu aktual dengan batas maksimum
  if (type === "in") {
    return clockTime > maxTime ? "Terlambat" : "Tepat Waktu";
  } else {
    return clockTime < maxTime ? "Pulang Cepat" : "Pulang Tepat Waktu";
  }
}


export const getStatusVariant = (status: string) => {

  if (status === "Tepat Waktu") return "default";
  if (status === "Terlambat") return "destructive";
  return "secondary";
};