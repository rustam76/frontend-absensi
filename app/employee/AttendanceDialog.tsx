"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getCurrentTimeString } from "@/lib/utils"
import { Clock } from "lucide-react"

type AttendanceDialogProps = {
  status: "checkin" | "checkout"
  onConfirm: () => void
}

export function AttendanceDialog({ status, onConfirm }: AttendanceDialogProps) {
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const title = status === "checkin" ? "Konfirmasi Check-in" : "Konfirmasi Check-out"
  const message =
    status === "checkin"
      ? `Apakah Anda yakin ingin check-in pada pukul ${currentTime}?`
      : `Apakah Anda yakin ingin check-out pada pukul ${currentTime}?`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
                  variant="outline"
                  className={`w-full ${status === 'checkin' ? 'bg-blue-600' : 'bg-red-600' } text-white rounded-xl py-3`}
        >
          {status === "checkin" ? "Check-in" : "Check-out"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center text-center gap-4">
        <DialogHeader className="flex flex-col items-center text-center">
          <Clock className="w-10 h-10 text-blue-600 mb-2" />
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-lg font-medium mt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-3 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700 text-white">
              Ya, Lanjutkan
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
