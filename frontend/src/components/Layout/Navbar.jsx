import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  
  // Basic active check logic for tabs
  const isExploreMusic = location.pathname === "/explore" && (location.search === "?tab=music" || location.search === "");
  const isExploreAlbums = location.pathname === "/explore" && location.search === "?tab=albums";

  return (
    <nav className="top-navbar">
      <div className="navbar-logo">
        <Link to="/">MUSIC</Link>
      </div>
      <div className="navbar-tabs">
        <Link 
          to="/explore?tab=music" 
          className={`navbar-tab ${isExploreMusic ? "active" : ""}`}
        >
          Music Explore
        </Link>
        <Link 
          to="/explore?tab=albums" 
          className={`navbar-tab ${isExploreAlbums ? "active" : ""}`}
        >
          Album Explore
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
