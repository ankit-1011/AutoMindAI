import React from 'react';

function FeatureCard({ title, description, icon }: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="cyber-feature-card group">
      <div className="cyber-icon-container">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-3 text-slate-900 group-hover:text-cyber-accent transition-colors">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

export default FeatureCard;
