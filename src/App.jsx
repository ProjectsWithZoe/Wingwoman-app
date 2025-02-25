import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import Chat from "./pages/Chat";
import PricingTable from "./components/PricingTable";
import Contact from "../public/pages/Contact";
import PrivacyPolicy from "../public/pages/Privacy-policy";
import Termsandonditions from "../public/pages/terms-and-conditions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/pt" element={<PricingTable />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-and-conditions" element={<Termsandonditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
