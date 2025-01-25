"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  ChevronDown,
  Pin,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

type Task = {
  id: number;
  description: string;
  priority: "low" | "medium" | "high";
  date: string;
  completed: boolean;
  pinned: boolean;
};

type SortOption = "priority" | "date" | "completion";

export default function TodoPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const tasksPerPage = 5;

  // Mock data for demonstration
  const todayTasks: Task[] = [
    {
      id: 1,
      description: "Complete project proposal",
      priority: "high",
      date: "2023-05-20",
      completed: false,
      pinned: true,
    },
    {
      id: 2,
      description: "Review team's progress",
      priority: "medium",
      date: "2023-05-20",
      completed: false,
      pinned: false,
    },
    {
      id: 3,
      description: "Send weekly report",
      priority: "low",
      date: "2023-05-20",
      completed: true,
      pinned: false,
    },
    {
      id: 4,
      description: "Update project timeline",
      priority: "medium",
      date: "2023-05-21",
      completed: false,
      pinned: false,
    },
    {
      id: 5,
      description: "Prepare presentation slides",
      priority: "high",
      date: "2023-05-22",
      completed: false,
      pinned: false,
    },
    {
      id: 6,
      description: "Review budget allocation",
      priority: "medium",
      date: "2023-05-23",
      completed: false,
      pinned: false,
    },
    {
      id: 7,
      description: "Schedule team meeting",
      priority: "low",
      date: "2023-05-24",
      completed: false,
      pinned: false,
    },
  ];

  const sortedTasks = useMemo(() => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return [...todayTasks].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

      switch (sortBy) {
        case "priority":
          return (
            (priorityOrder[b.priority] - priorityOrder[a.priority]) *
            (sortOrder === "asc" ? 1 : -1)
          );
        case "date":
          return (
            (new Date(a.date).getTime() - new Date(b.date).getTime()) *
            (sortOrder === "asc" ? 1 : -1)
          );
        case "completion":
          return (
            (Number(a.completed) - Number(b.completed)) *
            (sortOrder === "asc" ? 1 : -1)
          );
        default:
          return 0;
      }
    });
  }, [sortBy, sortOrder]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Todo List</h1>
        <div className="flex items-center space-x-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </header>

      <main>
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              Today - {new Date().toLocaleDateString()}
            </h2>
            <div className="flex items-center space-x-2">
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => handleSort(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="completion">Completion</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                <ArrowUpDown
                  className={`h-4 w-4 ${
                    sortOrder === "desc" ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
          <ul className="space-y-4">
            {currentTasks.map((task) => (
              <TaskItem key={task.id} {...task} />
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstTask + 1}-
              {Math.min(indexOfLastTask, sortedTasks.length)} of{" "}
              {sortedTasks.length} tasks
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function TaskItem({ description, priority, date, completed, pinned }: Task) {
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <li
      className={`flex items-center space-x-4 p-4 rounded-lg shadow ${
        completed ? "bg-gray-100" : "bg-white"
      }`}
    >
      <Checkbox checked={completed} />
      <div className="flex-grow">
        <p
          className={`font-medium ${
            completed ? "line-through text-gray-500" : ""
          }`}
        >
          {description}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          {/* <Badge className={priorityColors[priority]}>{priority}</Badge> */}
          <span className="text-sm text-gray-500">{date}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className={completed ? "opacity-50" : ""}
        >
          <Pin className={`h-4 w-4 ${pinned ? "fill-current" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={completed ? "opacity-50" : ""}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
