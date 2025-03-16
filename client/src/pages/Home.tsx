import { useEffect, useState } from "react";
import { checkBackendHealth } from "../api/health"; 

const Home = () => {
  const [message, setMessage] = useState("Checking backend...");

  useEffect(() => {
    checkBackendHealth().then(setMessage);
  }, []);

  return (
    <div>
      <h1>Welcome to the MERN App</h1>
      <p>{message}</p>
    </div>
  );
}

export default Home;