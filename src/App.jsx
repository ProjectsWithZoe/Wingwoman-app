import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import Chat from "./pages/Chat";
import PricingTable from "./components/PricingTable";
import Contact from "../Contact";
import PrivacyPolicy from "../Privacy-policy";
import Termsandonditions from "../terms-and-conditions";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
