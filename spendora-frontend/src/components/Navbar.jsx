import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useUserContext } from "../context/UserContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Optimization", to: "/optimization" },
  { label: "Reports", to: "/reports" }
];

export default function Navbar() {
  const { userId, activeUser, clearUser } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleClear = () => {
    clearUser();
    navigate("/users");
  };

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-slate-900">Spendora</span>
          <Separator orientation="vertical" className="h-6" />
          <nav className="flex items-center gap-4 text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "transition-colors",
                    isActive ? "text-orange-600 font-medium" : "text-slate-600 hover:text-slate-900"
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {userId ? (
            <Badge variant="success">Active: {activeUser?.name || "User"}</Badge>
          ) : (
            <Badge variant="outline">No active user</Badge>
          )}
          {location.pathname !== "/users" && (
            <Button variant="outline" size="sm" onClick={() => navigate("/users")}>Select User</Button>
          )}
          {userId && (
            <Button variant="ghost" size="sm" onClick={handleClear}>Clear</Button>
          )}
        </div>
      </div>
    </header>
  );
}
