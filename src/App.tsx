import TodoList from './components/TodoList'
import ThemeToggle from './components/ThemeToggle'
import './App.less'

function App() {
  return (
    <div className="min-h-full py-32 px-16 relative">
      <ThemeToggle />
      <div className="flex items-center justify-center min-h-screen pb-32">
        <TodoList />
      </div>
    </div>
  )
}

export default App
