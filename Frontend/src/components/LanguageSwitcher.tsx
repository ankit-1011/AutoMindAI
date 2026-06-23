import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'es', name: 'ਪੰਜਾਬੀ' }
  ];

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="relative group">
        <button 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-cyber-accent shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Globe className="w-5 h-5 text-cyber-accent" />
        </button>
        
        <div className="absolute bottom-full left-0 mb-2 transform scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 origin-bottom-left">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-2 w-32">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  language === lang.code ? 'bg-violet-50 text-cyber-accent font-medium' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;