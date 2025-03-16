const API_URL = "http://localhost:4444/api";

export const checkBackendHealth = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error connecting to backend: ", error);
    return "Error connecting to backend";
  }
};
