import React, { useState } from 'react';
import {
  Wallet2,
  Car,
  History,
  Train as Transfer,
  Shield,
} from 'lucide-react';
import ResaleEstimator from './components/ResaleEstimator';
import MintNFTForm from './components/MintNFTForm';
import TransferForm from './components/TransferForm';
import ServiceRecords from './components/ServiceRecords';
import Chatbot from './components/Chatbot';
import LanguageSwitcher from './components/LanguageSwitcher';
import MetaMaskConnect from './components/MetaMaskConnect';
import { useLanguage } from './context/LanguageContext';
import { RootState, AppDispatch } from './Redux/store';
import { useSelector, useDispatch } from 'react-redux';
import AddService from './components/AddService';
import FeatureCard from './components/FeatureCard';
import VehicleCard from './components/VehicleCard';
import FAQSection from './components/FAQSection';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import AuthenticationModal from './components/AuthenticationModal';
import { logout } from './Redux/features/auth';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showResaleEstimator, setShowResaleEstimator] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [transferredTokens, setTransferredTokens] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [metaMaskAddress, setMetaMaskAddress] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    wallet: string;
    type: 'user' | 'dealer';
  } | null>(null);

  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useLanguage();

  const vehicles = [
    {
      name: "BMW M2",
      plate: "DL 5C 9012",
      wallet: "0x9gh62er97sd013",
      image:
        "https://imgd.aeplcdn.com/664x374/n/cw/ec/150125/m2-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80",
      tokenId: "TOKEN_001",
    },
    {
      name: "Toyota Prado 250",
      plate: "MH 02 CD 5678",
      wallet: "0x8765FG556f4321",
      image:
        "https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Land-Cruiser-250/11001/1737017932790/front-left-side-47.jpg",
      tokenId: "TOKEN_002",
    },
    {
      name: "Land Rover Defender 110X",
      plate: "HR 03 EF 9012",
      wallet: "0x98762er45g0123",
      image:
        "https://stimg.cardekho.com/images/carexteriorimages/630x420/Land-Rover/Defender/12294/1736235204503/side-view-(left)-90.jpg",
      tokenId: "TOKEN_003",
    },
    {
      name: "McLaren P1",
      plate: "DL 01 AB 1234",
      wallet: "0x1234456e6fg5t5",
      image:
        "https://i.pinimg.com/736x/f2/f7/26/f2f7264890e2d2bb4d8e7cc648ef1123.jpg",
      tokenId: "TOKEN_004",
    },
    {
      name: "Mercedes-Benz Maybach S-class",
      plate: "UP 16 EF 9012",
      wallet: "0x98ij45j4ke4ert",
      image:
        "https://files.hodoor.world/main/b00ebddd-3346-43bb-8fd9-936b80bd76de.jpg",
      tokenId: "TOKEN_005",
    },
  ];

  const handleMetaMaskConnect = (address: string) => {
    if (address) setMetaMaskAddress(address);
  };

  const handleSignIn = ({
    email,
    wallet,
    isDealer,
    isSignIn,
  }: {
    email: string;
    wallet: string;
    isDealer: boolean;
    isSignIn: boolean;
  }) => {
    if (isDealer && (wallet === "678" || metaMaskAddress)) {
      setCurrentUser({
        name: "Siddhant",
        email: email || "sid@dealer.com",
        wallet: metaMaskAddress || "678",
        type: "dealer",
      });
    } else if (!isDealer && (wallet === "123" || wallet === "456" || metaMaskAddress)) {
      setCurrentUser({
        name: metaMaskAddress
          ? "MetaMask User"
          : wallet === "123"
          ? "Anmol"
          : "Aditya",
        email: email || "user@example.com",
        wallet: metaMaskAddress || wallet,
        type: "user",
      });
    }
    setShowAuthModal(false);
  };

  const handleTransferComplete = (tokenId: string) => {
    setTransferredTokens((prev) => [...prev, tokenId]);
  };

  const availableVehicles = vehicles.filter(
    (vehicle) => !transferredTokens.includes(vehicle.tokenId)
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden">
      <div className="cyber-bg" />

      {/* Navbar */}
      <Navbar
        isAuthenticated={auth.isAuthenticated}
        currentUser={
          auth.isAuthenticated ? { name: auth.name!, type: auth.role! } : null
        }
        onSignOut={() => dispatch(logout())}
        setCurrentPage={setCurrentPage}
        setShowAuthModal={setShowAuthModal}
        setShowMintModal={setShowMintModal}
        setShowTransferModal={setShowTransferModal}
        setShowResaleEstimator={setShowResaleEstimator}
      />

      {/* Authentication Modal */}
      <AuthenticationModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        metaMaskAddress={metaMaskAddress}
        onMetaMaskConnect={handleMetaMaskConnect}
        onSignIn={handleSignIn}
      />

      {/* Mint NFT Modal */}
      <MintNFTForm
        isOpen={showMintModal}
        onClose={() => setShowMintModal(false)}
      />

      {/* Transfer Modal */}
      <TransferForm
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onTransferComplete={handleTransferComplete}
        selectedVehicle={selectedVehicle}
      />

      {/* Resale Estimator Modal */}
      <ResaleEstimator
        isOpen={showResaleEstimator}
        onClose={() => setShowResaleEstimator(false)}
        userType={currentUser?.type || "user"}
      />

      {/* Main Content Switch */}
      {(() => {
        if (currentPage === "home") {
          return (
            <>
              <Hero onGetStarted={() => setShowAuthModal(true)} />
              <div className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-slate-900 mb-12 animate-fadeInUp">
                  Why <span className="cyber-text-glow">AutoMindAi</span>?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FeatureCard
                    title={t("feature.secureOwnership.title")}
                    description={t("feature.secureOwnership.desc")}
                    icon={
                      <Wallet2 className="w-8 h-8 text-cyber-accent" />
                    }
                  />
                  <FeatureCard
                    title={t("feature.instantTransfers.title")}
                    description={t("feature.instantTransfers.desc")}
                    icon={<Transfer className="w-8 h-8 text-cyber-glow" />}
                  />
                  <FeatureCard
                    title={t("feature.completeHistory.title")}
                    description={t("feature.completeHistory.desc")}
                    icon={<History className="w-8 h-8 text-cyber-green" />}
                  />
                </div>
                <FAQSection />
              </div>
            </>
          );
        }

        if (currentPage === "service-records") {
          return auth.isAuthenticated ? (
            <ServiceRecords
              userType={currentUser?.type || "user"}
              selectedVehicle={selectedVehicle || undefined}
            />
          ) : (
            <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-fadeInUp">
              <Shield className="w-16 h-16 text-cyber-accent mb-4 mx-auto" />
              <h2 className="text-2xl font-bold mb-4 text-slate-900">
                Authentication Required
              </h2>
              <p className="text-slate-500 mb-8">
                Please sign in to access service records
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="cyber-btn-primary"
              >
                Sign In
              </button>
            </div>
          );
        }

        if (currentPage === "add-service") {
          return <AddService />;
        }

        // Default: My Vehicles
        return (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-4xl font-bold mb-12 cyber-text-glow text-center text-slate-900">
              {t("vehicles.title")}
            </h2>
            {availableVehicles.length === 0 ? (
              <div className="cyber-empty-state">
                <Car className="w-16 h-16 text-cyber-accent mb-4 mx-auto" />
                <p className="text-cyber-muted text-xl">
                  {t("vehicles.noVehicles")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableVehicles.map((vehicle, index) => (
                  <VehicleCard
                    key={index}
                    vehicle={vehicle}
                    onTransfer={(tokenId) => {
                      setSelectedVehicle(tokenId);
                      setShowTransferModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 py-8 mt-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 <span className="text-cyber-accent font-semibold">AutoMindAi</span> — AI-Powered Vehicle Intelligence
          </p>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />

      {/* Language Switcher */}
      <LanguageSwitcher />
    </div>
  );
}

export default App;
