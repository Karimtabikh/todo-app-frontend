"use client";

import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Pin, Trash } from "lucide-react";
import EditTaskButton from "./EditTaskButton";
import { Task } from "@/app/page";

const priorityColors = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-red-100 text-red-800",
};

export default function TaskItem({
  data: task,
  mutation,
}: {
  data: Task;
  mutation: any;
}) {
  const handleCheckboxTask = (id: number, completed: boolean) => {
    mutation.mutate({
      type: "toggleTask",
      payload: { id, completed: !completed },
    });
  };

  const handlePinTask = (id: number, pinned: boolean) => {
    mutation.mutate({
      type: "pinTask",
      payload: { id, pinned: !pinned },
    });
  };

  const handleDeleteTask = (id: number) => {
    mutation.mutate({
      type: "deleteTask",
      payload: id,
    });
  };

  return (
    <>
      <div
        key={task.id}
        className={`flex justify-between space-x-4 gap-4 p-4 rounded-lg shadow mb-4 flex-col sm:flex-row sm:items-center ${
          task.completed ? "bg-gray-100" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-4">
          <Checkbox
            onClick={() => handleCheckboxTask(task.id, task.completed)}
            checked={task.completed}
          />
          <div>
            <p
              className={`font-medium ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.description}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={priorityColors[task.priority]}>
                <span className="lowercase">{task.priority}</span>
              </Badge>

              <span className="text-sm text-gray-500">{task.date}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className={task.completed ? "opacity-50" : ""}
            onClick={() => handlePinTask(task.id, task.pinned)}
          >
            <Pin className={`h-4 w-4 ${task.pinned ? "fill-current" : ""}`} />
          </Button>
          <EditTaskButton taskData={task} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteTask(task.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
