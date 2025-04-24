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

const TaskCategory = () => {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose catergory" className="placeholder-slate-500" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Task Category</SelectLabel>
          <SelectItem value="urgent">Urgent</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default TaskCategory;
