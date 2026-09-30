import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ShopOS from './pages/ShopOS.jsx'
import BlueprintOS from './pages/BlueprintOS.jsx'
import PurchaseThankYou from './pages/PurchaseThankYou.jsx'
import Consultation from './pages/Consultation.jsx'
import Products from './pages/Products.jsx'
import ProductsThankYou from './pages/ProductsThankYou.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/thank-you" element={<ProductsThankYou />} />
      <Route path="/shop-os" element={<ShopOS />} />
      <Route path="/blueprint-os" element={<BlueprintOS />} />
      <Route path="/blueprint-os/thank-you" element={<PurchaseThankYou />} />
      <Route path="/consultation" element={<Consultation />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default App
