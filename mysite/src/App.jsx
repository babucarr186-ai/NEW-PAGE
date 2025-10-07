import './App.css'
import {Gallery} from './components/Gallery'
import {PaboyBot} from './components/PaboyBot'

function App() {
  return (
    <main className="page">
      <Gallery title="Product Gallery" />
      <PaboyBot />
    </main>
  )
}

export default App
