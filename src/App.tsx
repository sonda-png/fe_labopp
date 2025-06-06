import { Link, Outlet } from '@tanstack/react-router'
import { Button } from './components/ui/button'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold">Vite React Boilerplate</h1>
              <div className="flex space-x-4">
                <Button asChild variant="ghost">
                  <Link to="/">Home</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/about">About</Link>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
