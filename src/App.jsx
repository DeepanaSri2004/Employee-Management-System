
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Trash from "./pages/Trash";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [trash, setTrash] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedEmployees = localStorage.getItem("employees");
    const savedTrash = localStorage.getItem("trash");

    if (savedEmployees !== null) {
      setEmployees(JSON.parse(savedEmployees));
      setLoading(false);
    } else {
      fetch("https://dummyjson.com/users?limit=100")
        .then((res) => res.json())
        .then((data) => {
          setEmployees(data.users);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
          setLoading(false);
        });
    }

    if (savedTrash !== null) {
      setTrash(JSON.parse(savedTrash));
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("employees", JSON.stringify(employees));
      localStorage.setItem("trash", JSON.stringify(trash));
    }
  }, [employees, trash, loading]);

  const moveToTrash = (employee) => {
    setEmployees((prev) =>
      prev.filter((item) => item.id !== employee.id)
    );
    setTrash((prev) => [...prev, employee]);
  };

  const restoreEmployee = (employee) => {
    setTrash((prev) =>
      prev.filter((item) => item.id !== employee.id)
    );
    setEmployees((prev) => [employee, ...prev]);
  };

  const permanentDelete = (id) => {
    setTrash((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  employees={employees}
                  setEmployees={setEmployees}
                  loading={loading}
                  moveToTrash={moveToTrash}
                />
              }
            />

            <Route
              path="/employees"
              element={
                <Dashboard
                  employees={employees}
                  setEmployees={setEmployees}
                  loading={loading}
                  moveToTrash={moveToTrash}
                />
              }
            />

            <Route
              path="/trash"
              element={
                <Trash
                  trash={trash}
                  restoreEmployee={restoreEmployee}
                  permanentDelete={permanentDelete}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
