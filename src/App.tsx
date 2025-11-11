import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.less'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-8">
        <a href="https://vite.dev" target="_blank" className="mr-8">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="mb-8">Vite + React</h1>
      <div className="card p-8 mb-8">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="mb-4"
        >
          count is {count}
        </button>
        <p className="text-center">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs text-center">
        Click on the Vite and React logos to learn more
      </p>
      {/* 工具类使用示例 */}
      <div className="mt-16 p-16 rounded-8">
        <h2 className="text-24 font-bold mb-8">工具类示例</h2>
        <div className="flex flex-col">
          <div className="p-8 rounded-4 mb-4">
            <p className="mb-4">使用 mb8: margin-bottom: 8px</p>
            <p className="mt-4">使用 mt4: margin-top: 4px</p>
          </div>
          <div className="px-16 py-8 rounded-6">
            <p>使用 px16 py8: padding左右16px, 上下8px</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
