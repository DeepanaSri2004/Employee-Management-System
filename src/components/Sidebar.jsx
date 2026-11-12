
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">EMS<span>.</span></h2>
      <p className="menu-title">MENU</p>

      <nav>
        <NavLink to="/" end>▦ Dashboard</NavLink>
        <NavLink to="/employees">♙ Employees</NavLink>
        <NavLink to="/trash">♲ Trash</NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">AD</div>
        <div>
          <strong>Admin</strong>
          <small>Administrator</small>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
