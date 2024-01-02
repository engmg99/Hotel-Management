import { Outlet } from "react-router";

const Layout = () => {
  return (
    <main className="mainClass">
      <Outlet />
    </main>
  );
};

export default Layout;
