import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Gift, Crown, Ticket } from 'lucide-react';

const GamificationPage = () => {
  // Updated grid pattern to better match the screenshot
  // 0: white, 1: #fef1fe (bg-gamification-grid-1), 2: #fefbfe (bg-gamification-grid-2)
  const gridPattern = [
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const cards = [
    {
      icon: Gift,
      title: "Reward Your Ambassadors",
      description: "Boost campaign performance by setting up rewards for ambassadors"
    },
    {
      icon: Crown,
      title: "Set Milestones",
      description: "Set up custom goals for sales, posts, or time-based achievements"
    },
    {
      icon: Ticket,
      title: "Customise Incentives",
      description: "Create custom incentives like flat fees, free products, or special commissions."
    }
  ];

  return (
    <div className="relative flex flex-col items-center">
      {/* Main Banner with Grid */}
      <div className="relative w-full h-[320px] border border-gamification-grid-border rounded-[15px] overflow-hidden bg-white mb-[-60px] z-0">
        {/* Background Grid */}
        <div 
          className="absolute inset-0 grid grid-cols-13"
          style={{ gridTemplateRows: 'repeat(4, 1fr) 0.33fr' }}
        >
          {gridPattern.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "border-[0.5px] border-sidebar-custom-active/10",
                  cell === 1 && "bg-gamification-grid-1",
                  cell === 2 && "bg-gamification-grid-2",
                  cell === 0 && "bg-white"
                )}
              />
            ))
          )}
        </div>

        {/* Local White Fade Overlay behind text */}
        <div className="absolute inset-0 z-5 flex items-center justify-center">
          <div className="w-[500px] h-[240px] bg-white/80 blur-3xl rounded-full" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 pb-16">
          <h2 className="text-[1.75rem] font-normal text-gamification-heading mb-1 tracking-tight">
            Gamify your Campaign
          </h2>
          <p className="text-sidebar-custom-text text-[1rem] max-w-[280px] mb-6 leading-relaxed font-light opacity-90">
            Enable gamification to start crafting your custom reward system.
          </p>
          <Button 
            className="bg-sidebar-custom-active hover:bg-sidebar-custom-active/90 text-white px-20 py-5 rounded-[10px] text-[1rem] font-normal transition-all active:scale-95"
          >
            Enable Gamification
          </Button>
        </div>
      </div>

      {/* Reward Cards (Floating) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4 z-20">
        {cards.map((card, idx) => (
          <div 
            key={idx}
            className="bg-white border border-sidebar-custom-active/10 rounded-[10px] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-[10px] bg-[#fbcffb] flex items-center justify-center mb-4">
              <div className="w-10 h-10 rounded-[8px] bg-white flex items-center justify-center shadow-sm">
                <card.icon className="size-6 text-gamification-icon" />
              </div>
            </div>
            <h3 className="text-black text-[1rem] font-normal mb-2">
              {card.title}
            </h3>
            <p className="text-gray-500 text-[0.85rem] leading-relaxed font-light">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamificationPage;
