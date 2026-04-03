import { Routes, Route } from "react-router-dom";
import Hero from "../pages/Hero/Hero";
import Explore from "../pages/Explore/Explore";
import AlbumPage from "../pages/Album/AlbumPage";
import AppLayout from "../components/Layout/AppLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Hero standalone page */}
      <Route path="/" element={<Hero />} />
      <Route
        path="/explore"
        element={
          <AppLayout>
            <Explore />
          </AppLayout>
        }
      />
      <Route
        path="/album/:albumId"
        element={
          <AppLayout>
            <AlbumPage />
          </AppLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
