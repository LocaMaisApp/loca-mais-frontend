import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LandlordRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.type !== "LANDLORD") {
      navigate("/");
    }
  }, [user]);

  return <>{children}</>;
};

export default LandlordRoute;
