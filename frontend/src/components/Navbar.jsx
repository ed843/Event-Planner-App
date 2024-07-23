import React, { useState, useEffect } from "react";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import "../styles/Navbar.css";

function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="navbar-container">
      {isMobile ? <MobileNavigation /> : <DesktopNavigation />}
    </div>
  );
}

export default Navbar;