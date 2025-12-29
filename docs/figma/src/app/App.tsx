import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { HomeDashboard } from "./components/HomeDashboard";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="dark min-h-screen bg-black">
      {!isAuthenticated ? (
        <LoginPage onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <HomeDashboard />
      )}
    </div>
  );
}
