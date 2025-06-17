import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import DeliveryPage from "./pages/DeliveryPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/panier" element={<CartPage />} />
        <Route path="/livraison" element={<DeliveryPage />} />
        <Route path="/transport" element={<ShippingPage />} />
        <Route path="/paiement" element={<PaymentPage />} />
      </Routes>
    </div>
  );
}
