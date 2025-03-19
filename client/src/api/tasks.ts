const API_URL = "http://localhost:4444/api/tasks";

export const fetchTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching tasks: ${error}`);
    return [];
  }
};

export const addTask = async (title: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error("Failed to add task");
    return await response.json();
  } catch (error) {
    console.error(`Error adding task: ${error}`);
    return null;
  }
};
