import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProfileCircle from "../components/ProfileCircle";

function Navbar({ userType, options, onLogout, profileLinks }) {
  return (
    <header className="navbar-empresa">
      <div className="navbar-empresa-content">
        <div className="navbar-empresa-logo">
          <Link to="/">
            <img src="/images/Busquidy.png" alt="logo" />
          </Link>
        </div>
        <nav className="navbar-empresa-links">
          {options
            .filter(opt => !opt.roles || opt.roles.includes(userType))
            .map(opt => (
              <Link key={opt.label} to={opt.link}>
                {opt.label}
                {opt.icon && <i className={opt.icon}></i>}
              </Link>
            ))}
        </nav>
        <div className="navbar-empresa-auth">
          <ProfileCircle userInitials={"EM"} />
          <div className="profile-empresa-menu">
            <ul>
              {profileLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.link}><i className={link.icon}></i> {link.label}</Link>
                </li>
              ))}
              <li onClick={onLogout} style={{ cursor: "pointer" }}>
                <i className="bi bi-box-arrow-right"></i> Cerrar sesión
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;