import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LazyLoader from "../components/atom/LazyLoader";

const SignIn = lazy(() => import("../pages/auth/signin"));

const PublicRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<LazyLoader />}>
        {" "}
        <Routes>
          {["/"].map((path, key) => (
            <Route key={key} path={path} element={<SignIn />} />
          ))}
          <Route path="*" element={<div>Not Found Route</div>} />{" "}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default PublicRoutes;
