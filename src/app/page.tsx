"use client";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import AddATaskButton from "@/components/AddATaskButton";
import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteTask,
  editTask,
  pinTask,
  toggleTask,
  getPaginatedTasks,
} from "@/app/api/tasks/tasks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import TaskItem from "@/components/TaskItem";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

export interface priorityColorsTypes {
  LOW: string;
  MEDIUM: string;
  HIGH: string;
}

export type Task = {
  id: number;
  description: string;
  date: string;
  priority: keyof priorityColorsTypes;
  pinned: boolean;
  completed: boolean;
};

export default function TodoPage() {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { type: string; payload: any }) => {
      switch (data.type) {
        case "toggleTask":
          return toggleTask(data.payload);
        case "pinTask":
          return pinTask(data.payload);
        case "editTask":
          return editTask(data.payload);
        case "deleteTask":
          return deleteTask(data.payload);
        default:
          throw new Error("Invalid mutation type");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Success!");
    },
    onError: () => {
      toast.error("Error!");
    },
  });

  const {
    isSuccess,
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["tasks", page, sortBy, debouncedSearchTerm],
    queryFn: () => getPaginatedTasks(page, sortBy, debouncedSearchTerm),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Todo List</h1>

        <div className="flex items-center gap-4 mb-4 flex-col lg:flex-row lg:space-x-4">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by description"
              className="pl-10"
              onChange={handleSearchChange}
              value={searchTerm}
            />
          </div>

          <AddATaskButton />
        </div>

        <div className="flex items-center justify-end space-x-2 mb-4">
          <Select
            onValueChange={(value) => {
              setSortBy(value);
              setPage(0);
            }}
            value={sortBy}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="completion">Completion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          {isPending ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Error: {error.message}</div>
          ) : (
            <>
              {data?.tasks.map((task: Task) => (
                <TaskItem key={task.id} data={task} mutation={mutation} />
              ))}

              {data && data.tasks.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((old) => Math.max(old - 1, 0))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button variant={"outline"} size="sm">
                    {page + 1}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!isPlaceholderData && data.hasMore) {
                        setPage((old) => old + 1);
                      }
                    }}
                    disabled={isPlaceholderData || !data?.hasMore}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {isFetching ? <span> Loading...</span> : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
