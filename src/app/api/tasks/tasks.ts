const API_ENDPOINT = "http://localhost:3001/tasks";

type TaskData = {
  description: string;
  date: string;
  priority: string;
};

type EdiatableTaskData = {
  id: number;
  description: string;
  date: string;
  priority: string;
};

export const createTask = async (data: TaskData) => {
  const response = await fetch(`${API_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

export const getTasks = async () => {
  const response = await fetch(`${API_ENDPOINT}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

export const editTask = async (data: EdiatableTaskData) => {
  const response = await fetch(`${API_ENDPOINT}/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

export const toggleTask = async (data: { id: number; completed: boolean }) => {
  const response = await fetch(`${API_ENDPOINT}/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: data.completed }),
  });
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

export const pinTask = async (data: { id: number; pinned: boolean }) => {
  const response = await fetch(`${API_ENDPOINT}/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pinned: data.pinned }),
  });
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

export const deleteTask = async (id: number) => {
  const response = await fetch(`${API_ENDPOINT}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};
