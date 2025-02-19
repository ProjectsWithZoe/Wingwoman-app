import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import Chat from "./pages/Chat";
import StripeDisplay from "./components/StripeDisplay";
import StripePricing from "./components/StripePricing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/checkout-complete" element={<StripeDisplay />} />
        <Route path="/stripe-pricing" element={<StripePricing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
