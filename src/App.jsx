import Sidebar from "./components/Sidebar"
import { useSelector } from "react-redux"
import { selectActiveId } from "./app/features/navigationSlice"
import GamificationPage from "./components/GamificationPage"
import { Bell } from "lucide-react"

export default function App() {
  const activeId = useSelector(selectActiveId)

  // A simple function to get the page title based on the active navigation item.
  const getPageTitle = (id) => {
    switch (id) {
      case 'home': return 'Home';
      case 'insights': return 'Insights';
      case 'gamification': return 'Gamification';
      case 'applications': return 'Applications';
      case 'payments': return 'Payments';
      default: return 'Dashboard';
    }
  }

  return (
    <div className="flex h-screen bg-white font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="w-full max-w-5xl mx-auto">
          {activeId === 'gamification' ? (
            <div className="flex flex-col gap-12">
              <header className="flex justify-between items-center">
                <h1 className="text-2xl font-normal text-gray-800">
                  {getPageTitle(activeId)}
                </h1>
                <div className="flex items-center gap-6">
                  <div className="relative cursor-pointer">
                    <Bell className="size-6 text-gray-400" />
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                      5
                    </span>
                  </div>
                  <div className="size-10 rounded-full bg-gray-200 overflow-hidden cursor-pointer border border-gray-100 shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </header>
              <GamificationPage />
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              <header className="flex justify-between items-center">
                <h1 className="text-2xl font-normal text-gray-800">
                  {getPageTitle(activeId)}
                </h1>
                <div className="flex items-center gap-6">
                  <div className="relative cursor-pointer">
                    <Bell className="size-6 text-gray-400" />
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                      5
                    </span>
                  </div>
                  <div className="size-10 rounded-full bg-gray-200 overflow-hidden cursor-pointer border border-gray-100 shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                    <div className="h-40 bg-gray-200/50 rounded-xl mb-4"></div>
                    <div className="h-4 w-3/4 bg-gray-300/50 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200/50 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
