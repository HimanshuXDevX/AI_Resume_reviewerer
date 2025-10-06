import React from 'react';

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColor = '';
  let badgeText = '';

  if (score > 70) {
    // MODIFICATION: Switched text to a lighter shade (400) for dark contrast
    // MODIFICATION: Switched background to a dark, semi-transparent green
    badgeColor = 'bg-green-900/40 text-green-400';
    badgeText = 'Strong';
  } else if (score > 49) {
    // MODIFICATION: Switched text to a lighter shade (400) for dark contrast
    // MODIFICATION: Switched background to a dark, semi-transparent yellow/orange
    badgeColor = 'bg-yellow-900/40 text-yellow-400';
    badgeText = 'Good Start';
  } else {
    // MODIFICATION: Switched text to a lighter shade (400) for dark contrast
    // MODIFICATION: Switched background to a dark, semi-transparent red
    badgeColor = 'bg-red-900/40 text-red-400';
    badgeText = 'Needs Work';
  }

  return (
    // Ensured padding/shape remains the same
    <div className={`px-3 py-1 rounded-full ${badgeColor}`}>
      <p className="text-sm font-medium">{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;