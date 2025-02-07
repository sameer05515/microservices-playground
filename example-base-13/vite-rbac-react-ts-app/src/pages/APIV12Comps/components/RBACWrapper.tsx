import { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface Props {
  allowedRoles: string[];
  children: ReactNode;
}

const RBACWrapper = ({ allowedRoles, children }: Props) => {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    return <p className="text-red-500">Access Denied ❌</p>;
  }

  return <>{children}</>;
};

export default RBACWrapper;
