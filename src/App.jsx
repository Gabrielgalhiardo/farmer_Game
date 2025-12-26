import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Farm from './screens/FarmScreen/Farm'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Farm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
