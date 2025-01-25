import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AddATaskButton from "@/components/AddATaskButton";
import TasksList from "@/components/TasksList";

export default function TodoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Todo List</h1>
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input type="text" placeholder="Search tasks" className="pl-10" />
          </div>
          <AddATaskButton />
        </div>
        <TasksList />
      </div>
    </div>
  );
}
