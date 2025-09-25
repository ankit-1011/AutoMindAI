import React from "react";
import { Car, LogOut, LogIn, PlusCircle, History, DollarSign } from "lucide-react";
import NavLink from "./Navlink";

interface NavbarProps {
  isAuthenticated: boolean;
  currentUser: { username: string; type: string } | null;
  onSignOut: () => void;
  onShowAuth: () => void;
  onShowMint: () => void;
  onShowTransfer: () => void;
  onShowServiceRecords: () => void;
  onShowResaleEstimator: () => void;
  setCurrentPage: (page: string) => void;
}

export default function Navbar({
  isAuthenticated,
  currentUser,
  onSignOut,
  onShowAuth,
  onShowMint,
  onShowTransfer,
  onShowServiceRecords,
  onShowResaleEstimator,
  setCurrentPage,
}: NavbarProps) {
  return (
    <div className="cyber-navbar">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Car className="w-6 h-6 text-cyber-accent" />
        <h1 className="text-xl font-bold cyber-text-glow">VehicleChain</h1>
      </div>

      {/* Nav links */}
      <div className="flex space-x-6">
        <button onClick={() => setCurrentPage("home")}><NavLink icon={<Car />} text="Home" /></button>
        <button onClick={() => setCurrentPage("vehicles")}><NavLink icon={<Car />} text="Vehicles" /></button>
        {isAuthenticated && (
          <>
            <button onClick={onShowServiceRecords}><NavLink icon={<History />} text="Service Records" /></button>
            <button onClick={onShowResaleEstimator}><NavLink icon={<DollarSign />} text="Resale Estimator" /></button>
          </>
        )}
      </div>

      {/* Auth section */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-cyber-muted">{currentUser?.username} ({currentUser?.type})</span>
            {currentUser?.type === "dealer" && (
              <button onClick={onShowMint}><NavLink icon={<PlusCircle />} text="Mint NFT" /></button>
            )}
            <button onClick={onSignOut}><NavLink icon={<LogOut />} text="Sign Out" /></button>
          </>
        ) : (
          <button onClick={onShowAuth}><NavLink icon={<LogIn />} text="Sign In" /></button>
        )}
      </div>
    </div>
  );
}
