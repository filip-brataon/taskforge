import { useState } from "react";
import { trpc } from "../utils/trpc";

export default function TasksPage() {
  const utils = trpc.useContext();

  const { data: tasks, isLoading } = trpc.task.getAll.useQuery();
  const createTask = trpc.task.create.useMutation({
    onSuccess: () => utils.task.getAll.invalidate(),
  });
  const toggleComplete = trpc.task.toggleComplete.useMutation({
    onSuccess: () => utils.task.getAll.invalidate(),
  });
  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: () => utils.task.getAll.invalidate(),
  });

  const [newTitle, setNewTitle] = useState("");

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newTitle.trim().length === 0) return;
          createTask.mutate({ title: newTitle });
          setNewTitle("");
        }}
        className="mb-6 flex gap-2"
      >
        <input
          type="text"
          placeholder="New task"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-grow border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      <ul>
        {tasks?.map((task) => (
          <li key={task.id} className="flex items-center gap-4 py-2 border-b">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete.mutate({ id: task.id })}
            />
            <span
              className={`flex-grow ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask.mutate({ id: task.id })}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
