import React, { useState, useContext } from 'react';
import { X, Shield, User, Building2 } from 'lucide-react';
import { NFTContext } from '../contracts/DeVahanContext';
import { useDispatch, useSelector } from 'react-redux';
import { assignAddress } from '../Redux/features/wallet';
import { RootState, AppDispatch } from '../Redux/store';
import { metamaskConnect } from '../contracts/walletConnect';
import { assignEmail } from '../Redux/features/emails';
import { assignUser } from '../Redux/features/users';
import { loginSuccess } from '../Redux/features/auth';

interface AuthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
  metaMaskAddress: string;
  onMetaMaskConnect: (address: string) => void;
  onSignIn: (data: {
    email: string;
    password: string;
    isDealer: boolean;
    isSignIn: boolean;
  }) => void;
}

function AuthenticationModal({
  isOpen,
  onClose,
  metaMaskAddress,
  onMetaMaskConnect,
  onSignIn,
}: AuthenticationModalProps) {
  const [isDealer, setIsDealer] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const emails = useSelector((state: RootState) => state.email.value );
  const username = useSelector((state: RootState) => state.user.value );
  const dispatch = useDispatch<AppDispatch>();
  const walletAddress = useSelector((state: RootState) => state.wallet.value);
  const nftcontext = useContext(NFTContext);
  if (!nftcontext) return <p>Error loading NFT context.</p>;

  const connect = async () => {
    try {
      const wallet = await metamaskConnect();
      if (wallet && typeof wallet === 'string') {
        dispatch(assignAddress(wallet));
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // 🔹 Prepare correct payload
    let payload: any = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    if (!isSignIn) {
      payload.name = formData.get('name');
      if (isDealer) payload.Dealer_ID = formData.get('Dealer_ID');
    }

    try {
      const endpoint = isDealer
        ? isSignIn
          ? 'https://og-devahan-1.onrender.com/auth/dealer/login'
          : 'https://og-devahan-1.onrender.com/auth/dealer/signup'
        : isSignIn
        ? 'https://og-devahan-1.onrender.com/auth/customer/login'
        : 'https://og-devahan-1.onrender.com/auth/customer/signup';
      console.log(endpoint)
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Auth Response:', data);
      dispatch(assignEmail(data.email))
      dispatch(assignUser(data.name))
      console.log(emails);
      console.log(res.ok)
      alert(`Success: ${data.message || 'Logged in successfully!'}`);
      if (res.ok) {
        dispatch(loginSuccess({
          name: data.name,
          email: data.email,
          role: isDealer ? 'dealer' : 'user',
          token: data.token
        }));
      }
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-yellow-300 p-8 rounded-2xl shadow-lg w-full max-w-md relative border border-yellow-400">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-200">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-6">Authentication Portal</h2>

        {/* Tabs: User / Dealer */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setIsDealer(false)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              !isDealer ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400 border border-yellow-500'
            }`}
          >
            <User className="inline-block w-4 h-4 mr-1" />
            User
          </button>
          <button
            onClick={() => setIsDealer(true)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isDealer ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400 border border-yellow-500'
            }`}
          >
            <Building2 className="inline-block w-4 h-4 mr-1" />
            Dealer
          </button>
        </div>

        {/* Toggle: Sign In / Sign Up */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setIsSignIn(true)}
            className={`px-4 py-2 rounded-lg ${
              isSignIn ? 'bg-yellow-400 text-gray-900 font-semibold' : 'bg-gray-800 text-yellow-400 border border-yellow-500'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`px-4 py-2 rounded-lg ${
              !isSignIn ? 'bg-yellow-400 text-gray-900 font-semibold' : 'bg-gray-800 text-yellow-400 border border-yellow-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Wallet Connect */}
        <button
          onClick={connect}
          className="mb-6 w-full px-6 py-3 rounded-xl font-semibold text-gray-800 bg-gradient-to-r from-yellow-400 to-yellow-300 border-2 border-yellow-400 hover:from-yellow-300 hover:to-yellow-200 hover:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-colors duration-300"
        >
          {walletAddress ? `Connected: ${walletAddress.slice(0, 9)}...` : 'Connect Wallet'}
        </button>

        {/* Divider */}
        <div className="text-center text-yellow-400 text-sm mb-6">
          {metaMaskAddress ? 'Wallet Connected' : 'or continue with credentials'}
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Signup-specific fields */}
          {!isSignIn && (
            <>
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 rounded bg-gray-800 text-yellow-300 border border-yellow-400"
                  placeholder="Enter name"
                  required
                />
              </div>

              {isDealer && (
                <div>
                  <label className="block text-sm mb-1">Dealer ID</label>
                  <input
                    type="text"
                    name="Dealer_ID"
                    className="w-full p-2 rounded bg-gray-800 text-yellow-300 border border-yellow-400"
                    placeholder="Enter Dealer ID"
                    required
                  />
                </div>
              )}
            </>
          )}

          {/* Common fields */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 rounded bg-gray-800 text-yellow-300 border border-yellow-400"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 rounded bg-gray-800 text-yellow-300 border border-yellow-400"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-yellow-400 text-gray-900 font-semibold py-3 rounded-xl hover:bg-yellow-300 transition-colors"
          >
            <Shield className="w-4 h-4 mr-2" />
            {isSignIn ? 'Sign In' : isDealer ? 'Register as Dealer' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthenticationModal;
