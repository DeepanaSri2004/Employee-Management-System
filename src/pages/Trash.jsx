
import { useState } from "react";

function Trash({ trash, restoreEmployee, permanentDelete }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <h1>Trash</h1>
          <p>Manage deleted employee records</p>
        </div>
      </header>

      <section className="employee-section">
        <div className="section-header">
          <div>
            <h2>Deleted Employees</h2>
            <p>{trash.length} employee(s) in Trash</p>
          </div>
        </div>

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
              {trash.length > 0 ? (
                trash.map((emp) => (
                  <tr key={emp.id}>
                    <td>#{emp.id}</td>
                    <td>
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>
                      {emp.department || emp.company?.department || "General"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => restoreEmployee(emp)}
                        >
                          Restore
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => setSelectedEmployee(emp)}
                        >
                          Delete Permanently
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Trash is empty!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Permanent Delete?</h2>
            <p>
              Are you sure you want to permanently delete{" "}
              <strong>
                {selectedEmployee.firstName} {selectedEmployee.lastName}
              </strong>
              ?
            </p>

            <div className="modal-actions">
              <button
                className="delete-btn"
                onClick={() => {
                  permanentDelete(selectedEmployee.id);
                  setSelectedEmployee(null);
                }}
              >
                Yes, Delete Permanently
              </button>

              <button
                className="cancel-btn"
                onClick={() => setSelectedEmployee(null)}
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

export default Trash;
