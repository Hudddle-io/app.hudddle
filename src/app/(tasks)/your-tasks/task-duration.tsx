import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TaskDuration = () => {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose task duration" className="placeholder-slate-500" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Task Duration</SelectLabel>
          <SelectItem value="1hour">1 hour</SelectItem>
          <SelectItem value="2hours">2 hours</SelectItem>
          <SelectItem value="6hours">6 hours</SelectItem>
          <SelectItem value="12hours">12 hours</SelectItem>
          <SelectItem value="aday">A day</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default TaskDuration;
