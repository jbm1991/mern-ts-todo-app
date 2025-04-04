const API_URL = "http://localhost:4444/api/tasks";

export const fetchTasks = async (token: string) => {
  try {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching tasks: ${error}`);
    return [];
  }
};

export const addTask = async (title: string, token: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error("Failed to add task");
    return await response.json();
  } catch (error) {
    console.error(`Error adding task: ${error}`);
    return null;
  }
};

export const deleteTask = async (taskId: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to delete task");
    return true;
  } catch (error) {
    console.error(`Error deleting task: ${error}`);
    return false;
  }
};

export const updateTask = async (
  taskId: string,
  completed: boolean,
  token: string
) => {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed }),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return await response.json();
  } catch (error) {
    console.error(`Error updating task: ${error}`);
    return null;
  }
};
