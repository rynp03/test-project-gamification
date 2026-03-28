import Sidebar from "./components/Sidebar"
import { useSelector } from "react-redux"
import { selectActiveId } from "./app/features/navigationSlice"
import GamificationPage from "./components/GamificationPage"

export default function App() {
  const activeId = useSelector(selectActiveId)

  // Simple mapping of labels based on activeId
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
              <header>
                <h1 className="text-2xl font-normal text-gray-800">
                  {getPageTitle(activeId)}
                </h1>
              </header>
              <GamificationPage />
            </div>
          ) : (
            <>
              <header className="mb-10">
                <h1 className="text-2xl font-bold text-gray-800">
                  {getPageTitle(activeId)}
                </h1>
                <p className="text-gray-500 mt-1 text-[0.9rem]">Manage your {activeId} and view statistics.</p>
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
            </>
          )}
        </div>
      </main>
    </div>
  )
}
