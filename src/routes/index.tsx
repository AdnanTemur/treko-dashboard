import PrivateRoutes from "./private-routes";
import PublicRoutes from "./public-routes";

const AppRoutes = () => {
  const isAuthenticated = localStorage.getItem("user") !== null;

  return <div>{isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}</div>;
};

export default AppRoutes;
