'use client';
import React, { useEffect, useRef, useState } from 'react';
import { 
  Car, 
  Send, 
  X, 
  Bot, 
  User, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare,
  Search,
  Maximize2,
  Minimize2,
  Database,
  Lightbulb
} from 'lucide-react';

// Dummy DB for old cars - Updated with TOKEN_00x format
const demoCars: Record<string, { model: string; insurance: string; owner: string; year: string; mileage: string; }> = {
  'TOKEN_001': { 
    model: 'Hyundai Creta 2020', 
    insurance: 'Valid till Dec 2025', 
    owner: 'Raj Kumar', 
    year: '2020',
    mileage: '45,000 km'
  },
  'TOKEN_002': { 
    model: 'Honda City 2021', 
    insurance: 'Expired July 2025', 
    owner: 'Priya Sharma', 
    year: '2021',
    mileage: '32,000 km'
  },
  'TOKEN_003': { 
    model: 'Tata Nexon EV 2022', 
    insurance: 'Valid till Nov 2026', 
    owner: 'Arjun Patel', 
    year: '2022',
    mileage: '28,500 km'
  },
};

// Define neon colors
const neonColors = {
  blue: '#00FFC2',
  green: '#1DE9B6',
  gold: '#FFD700'
};

type Message = { 
  id: string; 
  text: string; 
  isUser: boolean; 
  status?: 'success' | 'error' | 'info';
  timestamp?: Date;
};

const VahanSaarthi: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mode, setMode] = useState<'choose' | 'new' | 'old'>('choose');
  const [tokenId, setTokenId] = useState('');
  const [activeCar, setActiveCar] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  const generateId = () => String(Date.now());

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message with enhanced formatting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { 
          id: generateId(), 
          text: '🚗 **Namaste!** I am *VahanSaarthi*, your AI car assistant. Are you looking for a **new car** or an **old car**?', 
          isUser: false,
          status: 'info',
          timestamp: new Date()
        },
      ]);
    }
  }, [isOpen]);

  // Enhanced message formatting function
  const formatMessage = (text: string, isUser: boolean, status?: string) => {
    // Replace **bold** with proper formatting
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return (
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-400' 
            : mode === 'old' && activeCar
              ? 'bg-gradient-to-r from-orange-500 to-yellow-400'
              : 'bg-gradient-to-r from-green-500 to-emerald-400'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : mode === 'old' && activeCar ? (
            <Database className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="flex-1">
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
          {status && (
            <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
              {status === 'success' && <CheckCircle className="w-3 h-3 text-green-400" />}
              {status === 'error' && <AlertCircle className="w-3 h-3 text-red-400" />}
              {status === 'info' && <Sparkles className="w-3 h-3 text-blue-400" />}
              <span>{status}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleModeSelect = (choice: 'new' | 'old') => {
    setMode(choice);
    if (choice === 'new') {
      setMessages((prev) => [
        ...prev,
        { 
          id: generateId(), 
          text: '✨ You selected **new car**. Ask me about mileage, features, variants, or any car-related queries!', 
          isUser: false,
          status: 'success',
          timestamp: new Date()
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { 
          id: generateId(), 
          text: '🔍 You selected **old car**. Enter your **Token ID** in the search bar above to access vehicle database, then ask me anything!', 
          isUser: false,
          status: 'info',
          timestamp: new Date()
        },
      ]);
    }
  };

  const handleTokenSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const car = demoCars[tokenId.toUpperCase()];
    if (car) {
      setActiveCar(car);
      setMessages((prev) => [
        ...prev,
        { 
          id: generateId(), 
          text: `✅ **Vehicle found in database!** 
          
**Token ID**: ${tokenId.toUpperCase()}
**Model**: ${car.model}
**Owner**: ${car.owner}
**Year**: ${car.year}
**Mileage**: ${car.mileage}
**Insurance**: ${car.insurance}

You can now ask me specific questions about this vehicle!`, 
          isUser: false,
          status: 'success',
          timestamp: new Date()
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { 
          id: generateId(), 
          text: `❌ **No vehicle found** for Token ID "**${tokenId}**" in our database.

**Available Token IDs**: TOKEN_001, TOKEN_002, TOKEN_003

Please verify your Token ID or contact support.`, 
          isUser: false,
          status: 'error',
          timestamp: new Date()
        },
      ]);
    }
  };

  const callGeminiAPI = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAyYF9bwY-VVTiYJwRvFePVyojR0XEMBDM`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      const data = await response.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ Sorry, I couldn't fetch a proper response."
      );
    } catch (err: any) {
      return `⚠️ **Error**: ${err.message}`;
    }
  };

  const handleSend = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!query.trim()) return;

  const userMsg = { id: generateId(), text: query, isUser: true, timestamp: new Date() };
  setMessages((prev) => [...prev, userMsg]);
  setQuery('');
  setLoading(true);

  try {
    if (mode === 'old' && activeCar) {
      // 1️⃣ Fetch service record first
      // const recordRes = await fetch('/api/downloadData', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ tokenID: tokenId }),
      // });

      // const recordData = await recordRes.json();
     let recordData = [
  {
    date: "2023-01-15",
    service: "Initial Oil & Filter Change",
    mileage: "15,000 km",
    partsReplaced: ["Engine Oil (5W-30)", "Oil Filter"],
    technician: "R. Mehta",
    notes: "Routine 6-month oil change. Checked all fluid levels and tire pressure; no abnormalities found.",
  },
  {
    date: "2023-06-20",
    service: "Tire Rotation & Balancing",
    mileage: "20,000 km",
    partsReplaced: [],
    technician: "A. Kumar",
    notes: "Rotated all four tires, rebalanced. Inspected tread depth (7 mm average). Alignment within factory spec.",
  },
  {
    date: "2023-12-05",
    service: "Comprehensive Annual Inspection",
    mileage: "27,500 km",
    partsReplaced: ["Cabin Air Filter"],
    technician: "R. Mehta",
    notes: "All systems operational. Cabin filter replaced due to dust accumulation. Brake pads 75% remaining.",
  },
  {
    date: "2024-02-10",
    service: "Brake Inspection & Fluid Top-Up",
    mileage: "30,000 km",
    partsReplaced: ["Brake Fluid (DOT 4)"],
    technician: "S. Patel",
    notes: "Performed brake bleed; replaced fluid. Pads in good condition. Rotors smooth.",
  },
  {
    date: "2024-08-15",
    service: "Engine Tune-Up",
    mileage: "45,000 km",
    partsReplaced: ["Spark Plugs", "Air Filter"],
    technician: "M. Singh",
    notes: "Performed ECU diagnostics — no fault codes. Slight improvement in idle smoothness post tune-up.",
  },
  {
    date: "2025-02-12",
    service: "Major Service (2-Year Interval)",
    mileage: "60,000 km",
    partsReplaced: [
      "Engine Oil (5W-30)",
      "Oil Filter",
      "Coolant",
      "Transmission Fluid",
      "Drive Belt",
    ],
    technician: "Lead Tech – P. Sharma",
    notes: "Major 2-year service completed. All fluids replaced, belt tension adjusted. Post-service test drive OK.",
  },
  {
    date: "2025-09-01",
    service: "Battery Replacement & Diagnostics",
    mileage: "72,000 km",
    partsReplaced: ["12V AGM Battery"],
    technician: "K. Joshi",
    notes: "Battery failed load test (CCA below 350). Replaced with OEM-spec battery; system voltage stable at 14.3 V.",
  },
  {
    date: "2026-03-10",
    service: "Brake Pad Replacement (Front)",
    mileage: "85,000 km",
    partsReplaced: ["Front Brake Pads (Ceramic OEM)"],
    technician: "S. Patel",
    notes: "Pads worn to 3 mm. Replaced front pads and cleaned calipers. Rear pads still 50% remaining.",
  },
  {
    date: "2026-11-22",
    service: "Suspension & Alignment Service",
    mileage: "100,500 km",
    partsReplaced: ["Front Shock Absorbers", "Wheel Alignment Bolts"],
    technician: "A. Khan",
    notes: "Replaced front shocks due to mild oil seepage. Performed wheel alignment and road test — no pull detected.",
  },
  {
    date: "2027-05-15",
    service: "Comprehensive Annual Service",
    mileage: "115,000 km",
    partsReplaced: ["Oil Filter", "Engine Oil (5W-30)", "Cabin Filter"],
    technician: "R. Mehta",
    notes: "Routine maintenance. Checked spark plugs and belts — all within tolerance. Brake pads 60% front, 40% rear.",
  },
  {
    date: "2027-12-12",
    service: "Cooling System Overhaul",
    mileage: "130,000 km",
    partsReplaced: ["Radiator Hoses", "Thermostat", "Coolant"],
    technician: "Lead Tech – P. Sharma",
    notes: "Detected small coolant leak near lower hose. Replaced hoses, thermostat, and flushed system.",
  },
  {
    date: "2028-06-25",
    service: "5-Year Major Service & Emission Check",
    mileage: "150,000 km",
    partsReplaced: [
      "Engine Oil",
      "Oil Filter",
      "Fuel Filter",
      "Air Filter",
      "Transmission Fluid",
      "Brake Fluid",
      "Cabin Filter",
    ],
    technician: "Chief Engineer – M. Singh",
    notes: "Full 5-year service completed. Emission levels within norms. Software update applied to ECU. Vehicle in excellent condition.",
  },
];

      const serviceRecord = recordData || 'No record found.';

      // 2️⃣ Send record + query to 0G Compute API
      const aiRes = await fetch('http://localhost:3000/api/ask0GCompute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenID: tokenId,
          query,
          serviceRecord: JSON.stringify(serviceRecord, null, 2),
        }),
      });

      const aiData = await aiRes.json();
      const botReply = aiData.reply || '⚠️ No response from 0G Compute';

      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          text: botReply,
          isUser: false,
          status: aiData.verified ? 'success' : 'info',
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          text: '✨ Ask anything about new cars here!',
          isUser: false,
          status: 'info',
          timestamp: new Date(),
        },
      ]);
    }
  } catch (err: any) {
    setMessages((prev) => [
      ...prev,
      { id: generateId(), text: `⚠️ Error: ${err.message}`, isUser: false, status: 'error' },
    ]);
  }

  setLoading(false);
};


  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsFullScreen(true);
    }
  };

  const closeChatbot = () => {
    setIsOpen(false);
    setIsFullScreen(false);
    // Reset state when closing
    setMode('choose');
    setTokenId('');
    setActiveCar(null);
    setMessages([]);
    setQuery('');
  };

  return (
    <>
      {/* Enhanced Floating Button with neon glow */}
      <button
        onClick={toggleChatbot}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-[#00FFC2] to-[#1DE9B6] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(0,255,194,0.6)] ${
          isOpen ? 'rotate-180 opacity-50' : 'rotate-0 opacity-100'
        }`}
        style={{
          boxShadow: isOpen 
            ? '0 0 20px rgba(0,255,194,0.3)' 
            : '0 0 25px rgba(0,255,194,0.5), 0 0 50px rgba(29,233,182,0.3)'
        }}
      >
        <Car className={`w-8 h-8 text-[#08121A] transition-transform duration-300 ${
          isOpen ? 'scale-75' : 'scale-100'
        }`} />
      </button>

      {/* Enhanced Full-Screen Chat Window */}
      {isOpen && (
        <div 
          className={`fixed inset-0 bg-[#0A0F1C]/95 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-500 ${
            isFullScreen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(10,15,28,0.95) 0%, rgba(15,23,42,0.98) 100%)'
          }}
        >
          <div 
            className={`w-full max-w-4xl h-full max-h-[90vh] bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-700 transform ${
              isFullScreen ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'
            }`}
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(0, 255, 194, 0.2)',
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(0, 255, 194, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
            }}
          >
            {/* Enhanced Header with glassmorphism */}
            <div 
              className="bg-gradient-to-r from-[#00FFC2] to-[#1DE9B6] text-black p-6 flex justify-between items-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #00FFC2 0%, #1DE9B6 50%, #FFD700 100%)',
                boxShadow: '0 8px 32px rgba(0, 255, 194, 0.3)'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                  {mode === 'old' && activeCar ? (
                    <Database className="w-6 h-6 text-black" />
                  ) : (
                    <Bot className="w-6 h-6 text-black" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-black">VahanSaarthi</h3>
                  <p className="text-sm text-black/70">
                    {mode === 'old' && activeCar 
                      ? `Database Mode - ${activeCar.model}` 
                      : 'AI Car Assistant'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-2 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-200"
                >
                  {isFullScreen ? (
                    <Minimize2 className="w-5 h-5 text-black" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-black" />
                  )}
                </button>
                <button 
                  onClick={closeChatbot}
                  className="p-2 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-200"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute -left-8 -bottom-4 w-32 h-32 bg-black/10 rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>

            {/* Token ID Search Bar - Only shows in old car mode */}
            {mode === 'old' && (
              <div className="p-4 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-sm">
                <form onSubmit={handleTokenSearch} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00FFC2]/70" />
                    <input
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}
                      placeholder="Enter Token ID (e.g., TOKEN_001)"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0f172a]/80 backdrop-blur-xl text-white placeholder-white/50 border border-[#00FFC2]/30 focus:border-[#00FFC2]/70 focus:ring-2 focus:ring-[#00FFC2]/20 transition-all duration-300"
                      style={{ backdropFilter: 'blur(10px) saturate(180%)' }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-gradient-to-r from-[#00FFC2] to-[#1DE9B6] rounded-xl text-black font-semibold hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#00FFC2]/30 flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </form>
                {activeCar && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-[#00FFC2]">
                    <CheckCircle className="w-4 h-4" />
                    <span>Connected to: {activeCar.model} ({tokenId.toUpperCase()})</span>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Messages Container with better scrolling */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#00FFC2]/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] ${msg.isUser ? 'ml-auto' : 'mr-auto'}`}
                >
                  <div
                    className={`p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:transform hover:scale-[1.02] ${
                      msg.isUser
                        ? 'bg-gradient-to-r from-[#00FFC2]/20 to-[#1DE9B6]/20 text-white border border-[#00FFC2]/30 shadow-lg shadow-[#00FFC2]/10'
                        : mode === 'old' && activeCar
                          ? 'bg-gradient-to-r from-orange-900/40 to-yellow-900/40 backdrop-blur-xl text-white border border-orange-400/30 shadow-lg'
                          : 'bg-[#1e293b]/80 backdrop-blur-xl text-white border border-white/10 shadow-lg'
                    }`}
                    style={{
                      backdropFilter: 'blur(10px) saturate(180%)',
                    }}
                  >
                    {formatMessage(msg.text, msg.isUser, msg.status)}
                  </div>
                  {msg.timestamp && (
                    <div className={`text-xs text-white/50 mt-2 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-3 p-4 bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-white/10 max-w-[85%]">
                  {mode === 'old' && activeCar ? (
                    <Database className="w-6 h-6 text-[#FFD700]" />
                  ) : (
                    <Bot className="w-6 h-6 text-[#00FFC2]" />
                  )}
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#1DE9B6] animate-spin" />
                    <span className="text-white/80">
                      {mode === 'old' && activeCar 
                        ? 'Querying vehicle database...' 
                        : 'VahanSaarthi is thinking...'
                      }
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Mode Selection */}
            {mode === 'choose' && (
              <div className="p-6 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleModeSelect('new')} 
                    className="group p-4 bg-gradient-to-r from-[#00FFC2]/20 to-[#1DE9B6]/20 rounded-xl border border-[#00FFC2]/30 hover:border-[#00FFC2]/50 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-[#00FFC2] group-hover:animate-pulse" />
                      <div className="text-left">
                        <div className="text-white font-semibold">New Car</div>
                        <div className="text-white/70 text-sm">Explore features & variants</div>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleModeSelect('old')} 
                    className="group p-4 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Database className="w-6 h-6 text-orange-400 group-hover:animate-pulse" />
                      <div className="text-left">
                        <div className="text-white font-semibold">Old Car</div>
                        <div className="text-white/70 text-sm">Search by Token ID</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Input Section - Shows for both new car and old car with active vehicle */}
            {((mode === 'new') || (mode === 'old' && activeCar)) && (
              <form onSubmit={handleSend} className="p-6 border-t border-white/10">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={
                        loading 
                          ? (mode === 'old' && activeCar ? 'Querying database...' : 'VahanSaarthi is thinking...') 
                          : mode === 'old' && activeCar 
                            ? `Ask about ${activeCar.model}...`
                            : 'Ask me anything about cars...'
                      }
                      className="w-full pl-11 pr-4 py-4 rounded-xl bg-[#1e293b]/80 backdrop-blur-xl text-white placeholder-white/50 border border-white/20 focus:border-[#00FFC2]/50 focus:ring-2 focus:ring-[#00FFC2]/20 transition-all duration-300 disabled:opacity-50"
                      disabled={loading}
                      style={{ backdropFilter: 'blur(10px) saturate(180%)' }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading || !query.trim()}
                    className="px-6 py-4 bg-gradient-to-r from-[#00FFC2] to-[#1DE9B6] rounded-xl text-black font-semibold hover:transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#00FFC2]/30 flex items-center gap-2"
                  >
                    {loading ? (
                      <Sparkles className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {mode === 'old' && activeCar && (
                  <div className="flex items-center gap-2 mt-3 text-xs text-white/60">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span>Database mode: Ask about vehicle history, maintenance, insurance, or specifications</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VahanSaarthi;