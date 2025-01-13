import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./components/Loading";
import Landing from "./views/Landing";
import PedigreeChart from "./views/PedigreeChart";
import Home from "./views/Home";

// style
import "./style/App.css"
import ProfilePage from "./views/Profile";

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <Home />
            ) : (
              <div>You are not authorized to view this page.</div>
            )
          }
        />
        <Route
          path="/pedigree-chart"
          element={
            isAuthenticated ? (
              <PedigreeChart />
            ) : (
              <div>You are not authorized to view this page.</div>
            )
          }
        />
        <Route
      path="/profile/:id"
      element={
        isAuthenticated ? (
          <ProfilePage />
        ) : (
          <div>You are not authorized to view this page.</div>
        )
      }
    />
      </Routes>
    </Router>
  );
};

export default App;
