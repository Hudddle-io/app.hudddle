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
import { Separator } from "@/components/ui/separator";

const TaskTool = () => {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose tool" className="placeholder-slate-500" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Developer</SelectLabel>
          <SelectItem value="reactjs">React Js</SelectItem>
          <SelectItem value="nestjs">Nest js</SelectItem>
          <SelectItem value="nodejs">Node Js</SelectItem>
          <SelectItem value="django">Django</SelectItem>
          <SelectItem value="springboot">Spring boot</SelectItem>
        </SelectGroup>
        <Separator/>
        <SelectGroup>
          <SelectLabel>Designer</SelectLabel>
          <SelectItem value="figma">Figma</SelectItem>
          <SelectItem value="notion">Notion</SelectItem>
          <SelectItem value="miro">Miro</SelectItem>
          <SelectItem value="asana">Asana</SelectItem>
          <SelectItem value="pixelbay">PixelBay</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default TaskTool;
