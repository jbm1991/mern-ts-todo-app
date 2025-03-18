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
