import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthModal from "./components/Auth/AuthModal";

const App = () => {
  return (
    <Router>
      <AuthModal />
      <AppRoutes />
    </Router>
  );
};

export default App;
