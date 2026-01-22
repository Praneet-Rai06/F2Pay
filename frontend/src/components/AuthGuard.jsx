import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth(); // 🔥 removed loading
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to access this page",
        variant: "destructive",
      });

      navigate("/login", {
        state: { from: location.pathname },
      });
    }
  }, [isAuthenticated, navigate, location, toast]);

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;
