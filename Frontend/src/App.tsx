import React, { useState } from 'react';
import { Wallet2, Car, History, Plus, Train as Transfer, X, User, Building2, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Settings } from 'lucide-react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import ResaleEstimator from './components/ResaleEstimator';
import { IndianRupee } from 'lucide-react';
import MintNFTForm from './components/MintNFTForm';
import TransferForm from './components/TransferForm';
import ServiceRecords from './components/ServiceRecords';
import Chatbot from './components/Chatbot';
import LanguageSwitcher from './components/LanguageSwitcher';
import MetaMaskConnect from './components/MetaMaskConnect';
import { useLanguage } from './context/LanguageContext';
import logo from './assets/logo.png';




function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
   const [showResaleEstimator, setShowResaleEstimator] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [transferredTokens, setTransferredTokens] = useState<string[]>([]);
  const [isDealer, setIsDealer] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [metaMaskAddress, setMetaMaskAddress] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    wallet: string;
    type: 'user' | 'dealer';
  } | null>(null);

  const faqs = [
    {
      question: "Is my vehicle data secured on the NFT blockchain?",
      answer: "Yes, ownership and details are cryptographically secured and only updatable by verified dealers or owners.",
      color: "#fff700" // neon yellow
    },
    {
      question: "Can I transfer my vehicle NFT?",
      answer: "Absolutely! You can transfer the NFT to a new owner, and the vehicle registry updates instantly on blockchain.",
      color: "#00ffe7" // neon blue
    },
    {
      question: "What happens to my previous vehicle records?",
      answer: "All previous ownership and history are securely stored and viewable in the NFT’s complete audit trail.",
      color: "#fff700"
    },
    {
      question: "How do I prove NFT vehicle ownership?",
      answer: "Your blockchain wallet address acts as proof. Ownership can be validated in-app and on chain explorers.",
      color: "#00ffe7"
    },
    {
      question: "How do I update insurance or service history?",
      answer: "Authorized service centers and insurance providers can add entries via our NFT registry portal.",
      color: "#fff700"
    },
    {
      question: "Where can I find and download my vehicle certificate?",
      answer: "You can access and download your certified NFT vehicle documents directly from your dashboard.",
      color: "#00ffe7"
    }
  ];
  
  const [open, setOpen] = useState(Array(faqs.length).fill(false));
  const handleToggle = (idx: number) =>
    setOpen(open => open.map((o, i) => (i === idx ? !o : o)));
  
  const { t } = useLanguage();

  const vehicles = [
    {
      name: "BMW M2",
      plate: "DL 5C 9012",
      wallet: "0x9gh62er97sd013",
      image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/150125/m2-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80",
      tokenId: "TOKEN_001"
    },
    {
      name: "Toyota Prado 250",
      plate: "MH 02 CD 5678",
      wallet: "0x8765FG556f4321",
      image: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Land-Cruiser-250/11001/1737017932790/front-left-side-47.jpg",
      tokenId: "TOKEN_002"
    },
    {
      name: "Land Rover Defender 110X",
      plate: "HR 03 EF 9012",
      wallet: "0x98762er45g0123",
      image: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Land-Rover/Defender/12294/1736235204503/side-view-(left)-90.jpg",
      tokenId: "TOKEN_003"
    },
    {
      name: "McLaren P1",
      plate: "DL 01 AB 1234",
      wallet: "0x1234456e6fg5t5",
      image: "https://i.pinimg.com/736x/f2/f7/26/f2f7264890e2d2bb4d8e7cc648ef1123.jpg",
      tokenId: "TOKEN_004"
    },
    {
      name: "Mercedes-Benz Maybach S-class",
      plate: "UP 16 EF 9012",
      wallet: "0x98ij45j4ke4ert",
      image: "https://files.hodoor.world/main/b00ebddd-3346-43bb-8fd9-936b80bd76de.jpg",
      tokenId: "TOKEN_005"
    }
  ];

  const handleMetaMaskConnect = (address: string) => {
    if (address) {
      setMetaMaskAddress(address);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const wallet = metaMaskAddress || (e.target as any).wallet.value;
    
    if (isDealer && (wallet === "678" || metaMaskAddress)) {
      setCurrentUser({
        name: "Siddhant",
        email: email || "sid@dealer.com",
        wallet: metaMaskAddress || "678",
        type: "dealer"
      });
      setIsAuthenticated(true);
    } else if (!isDealer && (wallet === "123" || wallet === "456" || metaMaskAddress)) {
      setCurrentUser({
        name: metaMaskAddress ? "MetaMask User" : (wallet === "123" ? "Anmol" : "Aditya"),
        email: email || "user@example.com",
        wallet: metaMaskAddress || wallet,
        type: "user"
      });
      setIsAuthenticated(true);
    }
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('home');
    setTransferredTokens([]);
    setMetaMaskAddress('');
  };

  const handleTransferComplete = (tokenId: string) => {
    setTransferredTokens(prev => [...prev, tokenId]);
  };

  const availableVehicles = vehicles.filter(vehicle => !transferredTokens.includes(vehicle.tokenId));

  return (
    <div className="min-h-screen bg-cyber-dark text-white relative overflow-hidden">
      {/* Minimalistic Background */}
      <div className="cyber-bg">
        <div className="cyber-grid"></div>
        <div className="floating-particles"></div>
      </div>

      {/* Header/Navbar */}
      <nav className="cyber-nav backdrop-blur-xl border-b border-cyber-accent/20 relative z-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-1">
          <div className="flex items-center justify-between h-16 relative-0">
            <div className="flex items-center cursor-pointer group ml-8 " onClick={() => setCurrentPage('home')}>
              <img 
                src={logo} 
                alt="DeVahan Logo" 
                className="w-36 h-auto cursor-pointer"
                onClick={() => setCurrentPage('home')}
              />
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-6 mr-10">
                {isAuthenticated && currentUser?.type === 'user' && (
                  <div onClick={() => setCurrentPage('vehicles')} className="cursor-pointer">
                    <NavLink icon={<Car />} text={t('nav.myVehicles')} />
                  </div>
                )}
                {isAuthenticated && currentUser?.type === 'dealer' && (
                  <div onClick={() => setShowMintModal(true)} className="cursor-pointer">
                    <NavLink icon={<Plus />} text={t('nav.mintNFT')} />
                  </div>
                )}
                {isAuthenticated && currentUser?.type === 'user' && (
                  <div onClick={() => setShowTransferModal(true)} className="cursor-pointer">
                    <NavLink icon={<Transfer />} text={t('nav.transfer')} />
                  </div>
                )}
                {isAuthenticated && (
                  <div onClick={() => setCurrentPage('service-records')} className="cursor-pointer">
                    <NavLink icon={<Settings />} text="Service Records" />
                  </div>
                )}
                <NavLink icon={<History />} text={t('nav.history')} />
                 {/* Resale Estimator - Only for Users */}
                {isAuthenticated && currentUser?.type === 'user' && (
                  <div onClick={() => setShowResaleEstimator(true)} className="cursor-pointer">
                    <NavLink 
                      icon={<IndianRupee className="animate-pulse" />} 
                      text="Resale Estimator" 
                    />
                  </div>
                )}
                
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <div className="cyber-user-info">
                      <span className="text-cyber-accent font-medium">
                        {currentUser?.name}
                      </span>
                      <span className="text-cyber-muted ml-2">
                        ({currentUser?.type})
                      </span>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="cyber-btn-danger"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {t('nav.signOut')}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="cyber-btn-primary"
                  >
                    <Wallet2 className="w-4 h-4 mr-2" />
                    {t('nav.signIn')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal - No Animation */}
      {showAuthModal && (
        <div className="cyber-modal-backdrop">
          <div className="cyber-modal">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="cyber-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="cyber-modal-header">
              <h2 className="text-2xl font-bold cyber-text-glow mb-6">Authentication Portal</h2>
            </div>
            
            <div className="flex justify-center space-x-4 mb-8">
              <button 
                onClick={() => setIsDealer(false)}
                className={`cyber-tab-btn ${!isDealer ? 'active' : ''}`}
              >
                <User className="w-4 h-4 mr-2" />
                {t('auth.user')}
              </button>
              <button 
                onClick={() => setIsDealer(true)}
                className={`cyber-tab-btn ${isDealer ? 'active' : ''}`}
              >
                <Building2 className="w-4 h-4 mr-2" />
                {t('auth.dealer')}
              </button>
            </div>

            <div className="flex justify-center space-x-4 mb-8">
              <button 
                onClick={() => setIsSignIn(true)}
                className={`cyber-auth-toggle ${isSignIn ? 'active' : ''}`}
              >
                {t('auth.signIn')}
              </button>
              <button 
                onClick={() => setIsSignIn(false)}
                className={`cyber-auth-toggle ${!isSignIn ? 'active' : ''}`}
              >
                {t('auth.signUp')}
              </button>
            </div>

            {/* MetaMask Connect */}
            <div className="mb-6">
              <MetaMaskConnect onConnect={handleMetaMaskConnect} />
            </div>

            <div className="cyber-divider">
              <span className="cyber-divider-text">
                {metaMaskAddress ? t('auth.walletConnected') : 'or continue with credentials'}
              </span>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              {!isSignIn && (
                <>
                  <div className="cyber-input-group">
                    <label className="cyber-label">{t('auth.name')}</label>
                    <input 
                      type="text"   
                      name="name"
                      className="cyber-input"
                      placeholder={`${t('auth.name')}...`}
                    />
                  </div>
                  <div className="cyber-input-group">
                    <label className="cyber-label">{t('auth.phone')}</label>
                    <input 
                      type="tel" 
                      name="phone"
                      className="cyber-input"
                      placeholder={`${t('auth.phone')}...`}
                    />
                  </div>
                  <div className="cyber-input-group">
                    <label className="cyber-label">{t('auth.address')}</label>
                    <textarea 
                      name="address"
                      className="cyber-input min-h-[80px]"
                      placeholder={`${t('auth.address')}...`}
                      rows={3}
                    />
                  </div>
                </>
              )}
              
              <div className="cyber-input-group">
                <label className="cyber-label">{t('auth.email')}</label>
                <input 
                  type="email" 
                  name="email"
                  className="cyber-input"
                  placeholder={`${t('auth.email')}...`}
                />
              </div>
              
              {!metaMaskAddress && (
                <div className="cyber-input-group">
                  <label className="cyber-label">{t('auth.walletPin')}</label>
                  <input 
                    type="text" 
                    name="wallet"
                    className="cyber-input"
                    placeholder={`${t('auth.walletPin')}...`}
                  />
                </div>
              )}
              
              {!isSignIn && isDealer && (
                <div className="cyber-input-group">
                  <label className="cyber-label">{t('auth.dealerId')}</label>
                  <input 
                    type="text" 
                    name="dealerId"
                    className="cyber-input"
                    placeholder={`${t('auth.dealerId')}...`}
                  />
                </div>
              )}
              
              <button 
                type="submit"
                className="cyber-btn-submit w-full"
              >
                <Shield className="w-4 h-4 mr-2" />
                {isSignIn ? t('auth.signIn') : (isDealer ? t('auth.registerAsDealer') : t('auth.signUp'))}
              </button>
              
              {isSignIn && !metaMaskAddress && (
                <p className="text-sm text-cyber-muted text-center mt-4">
                  {isDealer ? t('auth.demoDealer') : t('auth.demoUser')}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

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
        userType={currentUser?.type || 'user'}
      />


      {/* Main Content */}
      {currentPage === 'home' ? (
        <>
          {/* Hero Section - No Animations */}
          <div className="relative py-32 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="cyber-hero-title">
                <span className="block">{t('home.title1')}</span>
                <span className="block text-cyber-accent cyber-text-glow">
                  {t('home.title2')}
                </span>
              </h1>
              <p className="mt-8 max-w-3xl mx-auto text-xl text-cyber-muted cyber-text-shadow">
                {t('home.subtitle')}
              </p>
              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="cyber-btn-hero"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  {t('home.getStarted')}
                </button>
                <button
  className="cyber-btn-secondary"
  onClick={() => {
    const faqDiv = document.getElementById("faq");
    if (faqDiv) {
      faqDiv.scrollIntoView({ behavior: "smooth" });
    }
  }}
>
  <Globe className="w-5 h-5 mr-2" />
  {t("home.learnMore")}
</button>

              </div>
            </div>
          </div>

          {/* Features Grid - No Animations */}
          <div className="max-w-7xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title={t('feature.secureOwnership.title')}
                description={t('feature.secureOwnership.desc')}
                icon={<Wallet2 className="w-8 h-8 text-cyber-neon-yellow" />}
              />
              <FeatureCard
                title={t('feature.instantTransfers.title')}
                description={t('feature.instantTransfers.desc')}
                icon={<Transfer className="w-8 h-8 text-cyber-accent" />}
              />
              <FeatureCard
                title={t('feature.completeHistory.title')}
                description={t('feature.completeHistory.desc')}
                icon={<History className="w-8 h-8 text-cyber-green" />}
              />
            </div>

            {
  // FAQ data

 
  <div id="faq" className=" faq max-w-4xl mx-auto mt-32 mb-8 px-4 py-10 rounded-xl bg-white/5 border border-white/15 shadow-lg backdrop-blur-lg ">
  <h2
    className="text-4xl font-bold mb-8 flex items-center gap-2"
    style={{ color: "#00ffe7" }}
  >
    <HelpCircle className="w-24 h-24" style={{ color: "#00ffe7" }} />
    Frequently Asked Questions
  </h2>

  <div className="space-y-8">
    {faqs.map((faq, idx) => (
      <div
        key={faq.question}
        className={`rounded-lg border transition-all ${
          open[idx]
            ? "border-white/30 bg-white/7"
            : "border-white/15 bg-transparent"
        }`}
      >
        {/* Question */}
        <button
          className="w-full flex items-center justify-between p-6 text-left focus:outline-none text-2xl font-semibold"
          style={{ color: faq.color }}
          onClick={() => handleToggle(idx)}
        >
          <span>{faq.question}</span>
          {open[idx] ? (
            <ChevronUp className="w-10 h-10" style={{ color: "#fff700" }} />
          ) : (
            <ChevronDown className="w-10 h-10" style={{ color: "#00ffe7" }} />
          )}
        </button>

        {/* Answer */}
        {open[idx] && (
          <div className="px-8 pb-8 text-white/80 text-lg font-normal leading-relaxed mt-5">
            {faq.answer}
          </div>
        )}
      </div>
    ))}
  </div>
</div>

  
}
          </div>
        </>
      ) : currentPage === 'service-records' ? (
        // Service Records Page
        isAuthenticated ? (
          <ServiceRecords 
            userType={currentUser?.type || 'user'}
            selectedVehicle={selectedVehicle || undefined}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-32 text-center">
            <Shield className="w-16 h-16 text-cyber-accent mb-4 mx-auto" />
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-cyber-muted mb-8">Please sign in to access service records</p>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="cyber-btn-primary"
            >
              Sign In
            </button>
          </div>
        )
      ) : (
        // Vehicles Page - No Animations
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-4xl font-bold mb-12 cyber-text-glow text-center">
            {t('vehicles.title')}
          </h2>
          {availableVehicles.length === 0 ? (
            <div className="cyber-empty-state">
              <Car className="w-16 h-16 text-cyber-accent mb-4 mx-auto" />
              <p className="text-cyber-muted text-xl">{t('vehicles.noVehicles')}</p>
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
      )}

      {/* Chatbot Component */}
      <Chatbot />
      
      {/* Language Switcher */}
      <LanguageSwitcher />
    </div>
  );
}

function NavLink({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="cyber-nav-link group">
      {React.cloneElement(icon as React.ReactElement, { 
        className: 'w-4 h-4 mr-2 group-hover:text-cyber-neon-yellow transition-colors duration-200' 
      })}
      <span className="cyber-nav-text">{text}</span>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}) {
  return (
    <div className="cyber-feature-card">
      <div className="cyber-icon-container">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 cyber-text-glow">{title}</h3>
      <p className="text-cyber-muted leading-relaxed">{description}</p>
    </div>
  );
}

function VehicleCard({ vehicle, onTransfer }: { 
  vehicle: any; 
  onTransfer: (tokenId: string) => void;
}) {
  const { t } = useLanguage();
  
  return (
    <div className="cyber-vehicle-card">
      <div className="cyber-vehicle-image">
        <img 
          src={vehicle.image} 
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="cyber-vehicle-info">
        <div className="flex items-center mb-4">
          <Car className="w-6 h-6 text-cyber-accent mr-3" />
          <h3 className="text-xl font-semibold cyber-text-glow">{vehicle.name}</h3>
        </div>
        
        <div className="space-y-3">
          <div className="cyber-vehicle-detail">
            <span className="text-cyber-muted">{t('vehicles.plateNumber')}</span>
            <span className="text-white font-mono">{vehicle.plate}</span>
          </div>
          <div className="cyber-vehicle-detail">
            <span className="text-cyber-muted">{t('vehicles.wallet')}</span>
            <span className="text-white font-mono text-sm">{vehicle.wallet}</span>
          </div>
          <div className="cyber-vehicle-detail">
            <span className="text-cyber-muted">{t('vehicles.tokenId')}</span>
            <span className="text-cyber-accent font-mono">{vehicle.tokenId}</span>
          </div>
        </div>
        
        <button
          onClick={() => onTransfer(vehicle.tokenId)}
          className="cyber-btn-transfer w-full mt-6 group"
        >
          <span>{t('vehicles.transfer')}</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

export default App;