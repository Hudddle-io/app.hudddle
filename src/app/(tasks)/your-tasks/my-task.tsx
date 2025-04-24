"use client";
import building from "../../../../public/assets/building.png";
import React, { useState, useEffect } from 'react';
import ball from "../../../../public/assets/ball.png";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Clock, Pencil, Zap } from 'lucide-react';
import Image from 'next/image';
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 3;

export interface Task {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    duration: string;
    is_recurring: boolean;
    status: string;
    category: string;
    task_tools: string[];
    deadline: string;
    due_by: string;
    task_point: number;
    completed_at: string | null;
    created_by_id: string;
    workroom_id: string;
}

interface MyTaskProps {
    tasks: Task[];
    totalItems: number;
}

const MyTask: React.FC<MyTaskProps> = ({ tasks: initialTasks, totalItems: initialTotalItems }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [tasks, setTasks] = useState<Task[]>(initialTasks.slice(0, ITEMS_PER_PAGE));
    const [totalItems, setTotalItems] = useState(initialTotalItems);

    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setTasks(initialTasks.slice(startIndex, endIndex));
    }, [currentPage, initialTasks]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= Math.ceil(totalItems / ITEMS_PER_PAGE)) {
            setCurrentPage(page);
        }
    };

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return (
        <>
            <div className='flex flex-col gap-8'>
                {tasks && Array.isArray(tasks) && tasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-[18px] shadow">
                        <div className='py-2.5 flex px-3 flex-col gap-2'>
                            <div className="flex justify-between items-center flex-row">
                                <div className='flex flex-row space-x-12'>
                                    <h1>Deadline: {new Date(task.deadline).toLocaleDateString()}</h1>
                                    <div className='flex flex-row items-center space-x-3'>
                                        <Clock size={18} color="#956FD699" />{" "}
                                        <h1>Due by {new Date(task.due_by).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h1>
                                    </div>
                                    <div className='flex items-center flex-row space-x-2'>
                                        <h1 className='text-[#999999] text-[14px] font-bold'>Tools</h1>
                                        {task.task_tools.map((tool, index) => (
                                            <span key={index}>{tool}</span>
                                        ))}
                                        {task.task_tools.length > 0 && <Image src={ball} width={19} height={13} alt="" style={{ width: 'auto', height: 'auto' }} />}
                                    </div>
                                    <div className="flex items-center flex-row space-x-2">
                                        <Image src={building} alt="" width={20} height={20} style={{ width: 'auto', height: 'auto' }} />
                                        <h1>{task.workroom_id ? 'In Workroom' : 'Not in workroom'}</h1>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Pencil size={18} color="#707070" />
                                    <span className={cn(
                                        "px-2 py-2 flex items-center justify-center border border-slate-300 rounded-[50px]",
                                        task.status === "PENDING" && "bg-[#FFADF8]",
                                        task.status === "COMPLETED" && "bg-green-200",
                                        task.status === "OVERDUE" && "bg-red-200",
                                    )}>
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center flex-row">
                                <h1>Task Name: {task.title}</h1>
                                <div className="flex flex-row space-x-1">
                                    <h1 className="text-[14px] font-normal text-[#FFD159]">{task.task_point}</h1>
                                    <Zap size={18} color="#FFD159" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {tasks && Array.isArray(tasks) && tasks.length === 0 && <p>No tasks available on this page.</p>}
            </div>
            {totalPages > 1 && (
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={() => handlePageChange(currentPage - 1)}
                                className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i + 1}>
                                <PaginationLink
                                    href="#"
                                    isActive={currentPage === i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() => handlePageChange(currentPage + 1)}
                                className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </>
    );
};

export default MyTask;