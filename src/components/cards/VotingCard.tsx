import { useState } from "react";
import { Check } from "lucide-react";

const VotingCard = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [votes, setVotes] = useState([42, 31, 27]);
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVoters, setTotalVoters] = useState(127);
  const [showConfetti, setShowConfetti] = useState(false);

  const missions = [
    { name: "Tanzania School Project" },
    { name: "Local Food Bank" },
    { name: "Guatemala Hope Center" },
  ];

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const handleSelect = (index: number) => {
    if (!hasVoted) {
      setSelectedIndex(index);
    }
  };

  const handleCastVote = () => {
    if (selectedIndex !== null && !hasVoted) {
      const newVotes = [...votes];
      newVotes[selectedIndex] += 1;
      setVotes(newVotes);
      setTotalVoters(prev => prev + 1);
      setHasVoted(true);
      setShowConfetti(true);
      
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 6)],
    size: 4 + Math.random() * 6,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 max-w-sm border border-border relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute animate-confetti"
              style={{
                left: `${piece.left}%`,
                top: '-10px',
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <h3 className="font-heading font-bold text-foreground mb-1">Vote on Next Mission</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {hasVoted ? "Thanks for voting!" : "Community allocation vote ends in 3 days"}
      </p>
      
      {/* Voting Options */}
      <div className="space-y-3 mb-6">
        {missions.map((mission, i) => {
          const percentage = Math.round((votes[i] / totalVotes) * 100);
          const isSelected = selectedIndex === i;
          
          return (
            <div 
              key={i} 
              onClick={() => handleSelect(i)}
              className={`relative rounded-xl p-4 border-2 transition-all ${
                hasVoted ? 'cursor-default' : 'cursor-pointer'
              } ${
                isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isSelected && (
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      hasVoted ? 'bg-emerald-500' : 'bg-primary'
                    }`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <span className="font-medium text-foreground">{mission.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{votes[i]} votes</span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isSelected ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Cast Vote Button */}
      <button 
        onClick={handleCastVote}
        disabled={hasVoted || selectedIndex === null}
        className={`w-full rounded-xl py-3 font-medium transition-all ${
          hasVoted 
            ? 'bg-emerald-500 text-white cursor-default' 
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        } ${selectedIndex === null && !hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {hasVoted ? '✓ Vote Cast!' : 'Cast Vote'}
      </button>
      
      {/* Voter count */}
      <p className="text-center text-sm text-muted-foreground mt-3">
        {totalVoters} members have voted
      </p>
    </div>
  );
};

export default VotingCard;
