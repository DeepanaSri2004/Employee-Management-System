
import { useState } from "react";

function Dashboard({ employees, setEmployees, loading, moveToTrash }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
  });

  const departments = [
    ...new Set(
      employees
        .map((emp) => emp.department || emp.company?.department || "General")
    ),
  ];

  const filteredEmployees = employees.filter((emp) => {
    const name = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const email = (emp.email || "").toLowerCase();
    const department = emp.department || emp.company?.department || "General";

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "All" || department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddForm = () => {
    setEditingId(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
    });
    setShowForm(true);
  };

  const openEditForm = (emp) => {
    setEditingId(emp.id);
    setFormData({
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      email: emp.email || "",
      phone: emp.phone || "",
      department: emp.department || emp.company?.department || "General",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingId
            ? {
                ...emp,
                ...formData,
                department: formData.department,
              }
            : emp
        )
      );
      alert("Employee updated successfully!");
    } else {
      const newEmployee = {
        id: Date.now(),
        ...formData,
        age: 25,
        image: "",
      };

      setEmployees((prev) => [newEmployee, ...prev]);
      alert("Employee added successfully!");
    }

    setShowForm(false);
    setEditingId(null);
  };

  const confirmDelete = () => {
    if (deleteEmployee) {
      moveToTrash(deleteEmployee);
      setDeleteEmployee(null);
      alert("Employee moved to Trash!");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <h1>Employee Dashboard</h1>
          <p>Manage your employees and team information</p>
        </div>
        <button className="add-btn" onClick={openAddForm}>
          + Add Employee
        </button>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <h2>{employees.length}</h2>
        </div>
        <div className="stat-card">
          <h3>Departments</h3>
          <h2>{departments.length}</h2>
        </div>
        <div className="stat-card">
          <h3>Active Employees</h3>
          <h2>{employees.length}</h2>
        </div>
        <div className="stat-card">
          <h3>Showing Results</h3>
          <h2>{filteredEmployees.length}</h2>
        </div>
      </section>

      <section className="employee-section">
        <div className="section-header">
          <div>
            <h2>Employee Directory</h2>
            <p>View and manage all employee records</p>
          </div>
        </div>

        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading employees...</p>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentEmployees.length > 0 ? (
                    currentEmployees.map((emp) => (
                      <tr key={emp.id}>
                        <td>#{emp.id}</td>
                        <td>
                          <div className="employee-name">
                            <strong>
                              {emp.firstName} {emp.lastName}
                            </strong>
                          </div>
                        </td>
                        <td>{emp.email}</td>
                        <td>{emp.phone}</td>
                        <td>
                          <span className="department-badge">
                            {emp.department || emp.company?.department || "General"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-btn"
                              onClick={() => openEditForm(emp)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => setDeleteEmployee(emp)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                Previous
              </button>

              <span>
                Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId !== null ? "Edit Employee" : "Add Employee"}</h2>

            <form onSubmit={handleSubmit}>
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />

              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />

              <input
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleInputChange}
                required
              />

              <div className="modal-actions">
                <button type="submit" className="add-btn">
                  {editingId !== null ? "Update Employee" : "Save Employee"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteEmployee && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Employee?</h2>
            <p>
              Are you sure you want to move{" "}
              <strong>
                {deleteEmployee.firstName} {deleteEmployee.lastName}
              </strong>{" "}
              to Trash?
            </p>

            <div className="modal-actions">
              <button className="delete-btn" onClick={confirmDelete}>
                Yes, Move to Trash
              </button>
              <button
                className="cancel-btn"
                onClick={() => setDeleteEmployee(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
