import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LazyLoader from "../components/atom/LazyLoader";

const DashboardPage = lazy(() => import("../tabs"));

const PrivateRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<LazyLoader />}>
        <Routes>
          {["/"].map((path, key) => (
            <Route key={key} path={path} element={<DashboardPage />} />
          ))}
          <Route path="*" element={<div>Not Found Route</div>} />{" "}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default PrivateRoutes;
