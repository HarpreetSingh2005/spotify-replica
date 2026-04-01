import Navbar from "./Navbar";
import PlayerBar from "../Player/PlayerBar";

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-conten">{children}</main>
      <PlayerBar />
    </div>
  );
}

export default AppLayout;
