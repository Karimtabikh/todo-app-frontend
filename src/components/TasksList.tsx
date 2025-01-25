"use client";

import {
  deleteTask,
  getTasks,
  pinTask,
  toggleTask,
} from "@/app/api/tasks/tasks";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowUpDown, Pencil, Pin, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import EditTaskButton from "./EditTaskButton";

export type Task = {
  id: number;
  description: string;
  date: string;
  priority: keyof priorityColorsTypes;
  pinned: boolean;
  completed: boolean;
};

interface priorityColorsTypes {
  low: string;
  medium: string;
  high: string;
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export default function TasksList() {
  const queryClient = useQueryClient();

  const handleCheckboxTask = (id: number, completed: boolean) => {
    const checkboxData = {
      id,
      completed: !completed,
    };
    // mutation.mutate(checkboxData);
  };

  const handlePinTask = (id: number, pinned: boolean) => {
    const pinnedData = {
      id,
      pinned: !pinned,
    };
    // mutation.mutate(pinnedData);
  };

  const handleEditTask = (id: number) => {
    console.log("test " + id);
  };

  const handleDeleteTask = (id: number) => {
    // mutation.mutate(id);
    console.log("test");
  };

  //   const mutation = useMutation({
  //     mutationFn: (pinnedData: { id: number; pinned: boolean }) => {
  //       return pinTask(pinnedData);
  //     },
  //     onSuccess: async () => {
  //       toast.success("Task Compelted");
  //       queryClient.invalidateQueries({ queryKey: ["tasks"] });
  //     },
  //     onError: async () => {
  //       toast.error("Error while completing the task");
  //     },
  //   });

  //   const mutation = useMutation({
  //     mutationFn: (checkboxData: { id: number; completed: boolean }) => {
  //       return toggleTask(checkboxData);
  //     },
  //     onSuccess: async () => {
  //       toast.success("Task Compelted");
  //       queryClient.invalidateQueries({ queryKey: ["tasks"] });
  //     },
  //     onError: async () => {
  //       toast.error("Error while completing the task");
  //     },
  //   });

  // const mutation = useMutation({
  //   mutationFn: (id: number) => {
  //     return deleteTask(id);
  //   },
  //   onSuccess: async () => {
  //     toast.success("Task Compelted");
  //     queryClient.invalidateQueries({ queryKey: ["tasks"] });
  //   },
  //   onError: async () => {
  //     toast.error("Error while deleting the task");
  //   },
  // });

  const { status, data, error, isFetching } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
  return (
    <>
      <div className="flex items-center justify-end space-x-2 mb-4">
        <Select>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="completion">Completion</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <ArrowUpDown className={`h-4 w-4`} />
        </Button>
      </div>
      <div>
        {status === "pending" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data.map((task: Task) => {
                return (
                  <div
                    key={task.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg shadow mb-4 ${
                      task.completed ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <Checkbox
                      onClick={() =>
                        handleCheckboxTask(task.id, task.completed)
                      }
                      checked={task.completed}
                    />
                    <div className="flex-grow">
                      <p
                        className={`font-medium ${
                          task.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {task.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>

                        <span className="text-sm text-gray-500">
                          {task.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={task.completed ? "opacity-50" : ""}
                        onClick={() => handlePinTask(task.id, task.pinned)}
                      >
                        <Pin
                          className={`h-4 w-4 ${
                            task.pinned ? "fill-current" : ""
                          }`}
                        />
                      </Button>
                      <EditTaskButton taskData={task} />
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        className={task.completed ? "opacity-50" : ""}
                        onClick={() => handleEditTask(task.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>{isFetching ? "Fetching..." : " "}</div>
          </>
        )}
      </div>
    </>
  );
}
