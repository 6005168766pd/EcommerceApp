import React from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import navprofileicon from "../../assets/nav-profile.svg";
const Navbar = () => {
  return (
    <div className="navbar">
      <div>
        <img src={logo} alt="" className="nav-logo" />
        <div className="navlogo-text">
          <h1>SHOPPING.COM</h1>
          <p className="navlogo-admin">Admin Panel</p>
        </div>
      </div>
      <img src={navprofileicon} alt="" className="nav-profile" />
    </div>
  );
};

export default Navbar;
