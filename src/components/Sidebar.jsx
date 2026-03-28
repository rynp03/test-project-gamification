import React from 'react';
import { 
  Home, 
  Brain, 
  Briefcase, 
  ClipboardList, 
  Wallet, 
  User, 
  Hexagon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveId, setActiveId } from '../app/features/navigationSlice';

const navItems = [
  { icon: Home, label: 'Home', id: 'home' },
  { icon: Brain, label: 'Insights', id: 'insights' },
  { icon: Briefcase, label: 'Gamification', id: 'gamification' },
  { icon: ClipboardList, label: 'Applications', id: 'applications' },
  { icon: Wallet, label: 'Payments', id: 'payments' },
];

const Sidebar = () => {
  const activeId = useSelector(selectActiveId);
  const dispatch = useDispatch();

  return (
    <aside className="w-60 h-screen bg-sidebar-custom-bg flex flex-col p-4 border-r border-sidebar-custom-active/5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8 mt-2 px-2">
        <div className="w-9 h-9 rounded-xl bg-sidebar-custom-active flex items-center justify-center shadow-lg shadow-sidebar-custom-active/20">
          <Hexagon className="text-white size-5 fill-white/20" />
        </div>
        <h1 className="text-xl font-bold text-sidebar-custom-active tracking-tight">Acme</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = item.id === activeId;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => dispatch(setActiveId(item.id))}
              className={cn(
                "w-full justify-start gap-3 px-3 py-5 rounded-xl transition-all duration-200",
                "text-sidebar-custom-text hover:text-sidebar-custom-active hover:bg-white/40",
                isActive && "bg-white text-sidebar-custom-active border-transparent"
              )}
            >
              <Icon className={cn("size-[1.2rem]", isActive ? "text-sidebar-custom-active" : "text-sidebar-custom-text opacity-70")} />
              <span className={cn("text-[0.95rem] font-medium tracking-wide", isActive ? "text-sidebar-custom-active" : "text-sidebar-custom-text")}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </nav>

      {/* Footer / Settings */}
      <div className="mt-auto pb-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-5 rounded-xl text-sidebar-custom-text hover:text-sidebar-custom-active hover:bg-white/40"
        >
          <User className="size-[1.2rem] text-sidebar-custom-text opacity-70" />
          <span className="text-[0.95rem] font-medium text-sidebar-custom-text">Settings</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
