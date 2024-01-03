import { useEffect } from "react";
import { useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { Spinner } from "react-bootstrap";
import { Outlet } from "react-router";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const refresh = useRefreshToken();
  const auth = useAuth();

  const verifyRefreshToken = async (isMounted) => {
    try {
      await refresh();
    } catch (error) {
      console.log(error);
    } finally {
      isMounted && setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    console.log(auth.persist);

    if (!auth?.authUserDetails?.email && auth.persist == true) {
      verifyRefreshToken(isMounted);
    } else {
      setIsLoading(false);
    }

    return () => (isMounted = false);
  }, []);

  return (
    <>{!auth.persist ? <Outlet /> : isLoading ? <Spinner /> : <Outlet />}</>
  );
};

export default PersistLogin;
