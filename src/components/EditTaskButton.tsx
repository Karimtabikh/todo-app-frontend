"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pencil, Plus } from "lucide-react";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { Label } from "@/components/ui/label";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { editTask } from "@/app/api/tasks/tasks";
import { useState } from "react";
import { Task } from "./TasksList";

const schema = z.object({
  id: z.number(),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  priority: z.string().min(1, { message: "Priority is required" }),
});

type Schema = z.infer<typeof schema>;

export default function EditTaskButton({ taskData }: { taskData: Task }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: (data: Schema) => {
      return editTask(data);
    },
    onSuccess: async () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task was Edited");
    },
    onError: async () => {
      toast.error("Error could not edit your task");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Schema>({
    defaultValues: {
      id: taskData.id,
      description: taskData.description,
      date: taskData.date.split("-").reverse().join("-"),
      priority: taskData.priority,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Schema> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit a task</DialogTitle>
          <DialogDescription>
            You can edit the following fields
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register("date")} />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Controller
                  name="priority"
                  control={control}
                  defaultValue={taskData.priority}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Priority</SelectLabel>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.priority && (
                  <p className="text-red-500 text-sm">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
