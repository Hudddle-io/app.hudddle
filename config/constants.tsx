import {format} from "date-fns"


const currentDate = new Date(); // Get the current date
const formattedDate = format(currentDate, "MMMM do, yyyy");
const currentTime = format(new Date(), "hh:mm:ss a");

type dueDateType = string | { formattedDate : string};
type dueTimeType = string | {currentTime : string};

interface PaginationItem {
    dueDate: string | {formattedDate: string};
    dueTime: string | {currentTime: string};
    tool: string;
    venue: string;
    status: string;
    Title: string;
    points: string;
}

export const PaginationData: PaginationItem[] = [
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
    {
        dueDate: formattedDate,
        dueTime: currentTime,
        tool: "Tools",
        venue: "In Workroom",
        status: "In Progress",
        Title: "Create Component for UI Screens",
        points : "+10",
        
    },
]