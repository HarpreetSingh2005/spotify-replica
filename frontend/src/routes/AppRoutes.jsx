import { Routes, Route } from "react-router-dom";
import React from "react";
import Hero from "../pages/Hero/Hero";
import Explore from "../pages/Explore/Explore";
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
    </Routes>
  );
};

export default AppRoutes;
