import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Is my vehicle data secured on the NFT blockchain?",
    answer: "Yes, ownership and details are cryptographically secured and only updatable by verified dealers or owners.",
  },
  {
    question: "Can I transfer my vehicle NFT?",
    answer: "Absolutely! You can transfer the NFT to a new owner, and the vehicle registry updates instantly on blockchain.",
  },
  {
    question: "What happens to my previous vehicle records?",
    answer: "All previous ownership and history are securely stored and viewable in the NFT's complete audit trail.",
  },
  {
    question: "How do I prove NFT vehicle ownership?",
    answer: "Your blockchain wallet address acts as proof. Ownership can be validated in-app and on chain explorers.",
  },
  {
    question: "How do I update insurance or service history?",
    answer: "Authorized service centers and insurance providers can add entries via our NFT registry portal.",
  },
  {
    question: "Where can I find and download my vehicle certificate?",
    answer: "You can access and download your certified NFT vehicle documents directly from your dashboard.",
  }
];

function FAQSection() {
  const [open, setOpen] = useState(Array(faqs.length).fill(false));

  const handleToggle = (idx: number) =>
    setOpen(open => open.map((o, i) => (i === idx ? !o : o)));

  return (
    <div id="faq" className="faq max-w-4xl mx-auto mt-20 mb-8 px-6 py-10 rounded-2xl bg-white border border-slate-200 shadow-lg animate-fadeInUp animation-delay-400">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900">
        <HelpCircle className="w-8 h-8 text-cyber-accent" />
        Frequently Asked Questions
      </h2>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={faq.question}
            className={`rounded-xl border transition-all duration-300 ${
              open[idx]
                ? "border-violet-200 bg-violet-50/50 shadow-sm"
                : "border-slate-200 bg-white hover:border-violet-200"
            }`}
          >
            <button
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none text-base font-semibold text-slate-800 hover:text-cyber-accent transition-colors"
              onClick={() => handleToggle(idx)}
            >
              <span>{faq.question}</span>
              {open[idx] ? (
                <ChevronUp className="w-5 h-5 text-cyber-accent shrink-0 ml-4 transition-transform" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform" />
              )}
            </button>

            {open[idx] && (
              <div className="px-5 pb-5 text-slate-500 text-sm leading-relaxed animate-fadeInUp">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQSection;
