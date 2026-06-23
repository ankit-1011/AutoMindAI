import React, { useState, useContext } from 'react';
import {
  X,
  Shield,
  User,
  Building2,
  Wrench,
  Brain,
  Mail,
  Lock,
  Wallet,
  Sparkles,
  UserPlus,
} from 'lucide-react';
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

const roles = [
  { id: 'user' as const, label: 'Owner', icon: User },
  { id: 'dealer' as const, label: 'Dealer', icon: Building2 },
  { id: 'service' as const, label: 'Service', icon: Wrench },
];

function AuthenticationModal({
  isOpen,
  onClose,
}: AuthenticationModalProps) {
  const [role, setRole] = useState<'user' | 'dealer' | 'service'>('user');
  const [isSignIn, setIsSignIn] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const walletAddress = useSelector((state: RootState) => state.wallet.value);
  const nftcontext = useContext(NFTContext);
  if (!nftcontext) return null;

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

    const payload: Record<string, unknown> = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    if (!isSignIn) {
      payload.name = formData.get('name');
      if (role === 'dealer') payload.Dealer_ID = formData.get('Dealer_ID');
      if (role === 'service') payload.Service_ID = formData.get('Service_ID');
    }

    try {
      const baseUrl = 'https://og-devahan-2.onrender.com/auth';
      const endpoint = `${baseUrl}/${role === 'user' ? 'customer' : role}/${
        isSignIn ? 'login' : 'signup'
      }`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(assignEmail(data.email));
        dispatch(assignUser(data.name));
        dispatch(
          loginSuccess({
            name: data.name,
            email: data.email,
            role,
            token: data.token,
          })
        );
        onClose();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  if (!isOpen) return null;

  const submitLabel = isSignIn
    ? 'Sign In'
    : role === 'dealer'
    ? 'Register as Dealer'
    : role === 'service'
    ? 'Register Service Center'
    : 'Create Account';

  return (
    <div
      className="auth-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="auth-modal-card relative w-full max-w-[440px] animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Compact Header */}
        <div className="auth-modal-header px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="auth-modal-logo shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="text-left min-w-0">
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">AutoMindAi</span>
            </h2>
            <p className="text-xs text-slate-500 truncate">
              {isSignIn ? 'Sign in to your account' : 'Create a new account'}
            </p>
          </div>
        </div>

        <div className="px-6 pb-5">
          {/* Sign In / Sign Up + Role in one row area */}
          <div className="auth-segment mb-3">
            <button
              type="button"
              onClick={() => setIsSignIn(true)}
              className={`auth-segment-btn ${isSignIn ? 'auth-segment-btn-active' : ''}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignIn(false)}
              className={`auth-segment-btn ${!isSignIn ? 'auth-segment-btn-active' : ''}`}
            >
              Sign Up
            </button>
          </div>

          {/* Role pills */}
          <div className="flex gap-1.5 mb-3">
            {roles.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setRole(id)}
                className={`auth-role-pill flex-1 ${role === id ? 'auth-role-pill-active' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[11px]">{label}</span>
              </button>
            ))}
          </div>

          {/* Wallet connect */}
          <button
            type="button"
            onClick={connect}
            className={`auth-wallet-btn mb-3 ${walletAddress ? 'auth-wallet-btn-connected' : ''}`}
          >
            <Wallet className="w-4 h-4 shrink-0" />
            <span className="truncate text-xs font-medium">
              {walletAddress
                ? `Connected · ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : 'Connect MetaMask Wallet'}
            </span>
            {walletAddress && (
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            )}
          </button>

          <div className="auth-divider mb-3">
            <span>or with email</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {!isSignIn && (
              <>
                <div className="auth-input-group auth-input-group-compact">
                  <div className="auth-input-wrap">
                    <UserPlus className="auth-input-icon" />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Full name"
                      className="auth-input"
                      required
                    />
                  </div>
                </div>

                {role === 'dealer' && (
                  <div className="auth-input-group auth-input-group-compact">
                    <div className="auth-input-wrap">
                      <Building2 className="auth-input-icon" />
                      <input
                        id="dealer-id"
                        type="text"
                        name="Dealer_ID"
                        placeholder="Dealer ID"
                        className="auth-input"
                        required
                      />
                    </div>
                  </div>
                )}

                {role === 'service' && (
                  <div className="auth-input-group auth-input-group-compact">
                    <div className="auth-input-wrap">
                      <Wrench className="auth-input-icon" />
                      <input
                        id="service-id"
                        type="text"
                        name="Service_ID"
                        placeholder="Service Center ID"
                        className="auth-input"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="auth-input-group auth-input-group-compact">
              <div className="auth-input-wrap">
                <Mail className="auth-input-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-input-group auth-input-group-compact">
              <div className="auth-input-wrap">
                <Lock className="auth-input-icon" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn group !mt-1">
              {isSignIn ? (
                <Shield className="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110" />
              ) : (
                <Sparkles className="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110" />
              )}
              {submitLabel}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthenticationModal;
