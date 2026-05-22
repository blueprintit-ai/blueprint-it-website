import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ShopOS from './pages/ShopOS.jsx'
import ShopOSSI from './pages/ShopOSSI.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop-os" element={<ShopOS />} />
      <Route path="/shop-ossi" element={<ShopOSSI />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default App
