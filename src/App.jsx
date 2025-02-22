import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import Chat from "./pages/Chat";

import PricingTable from "./components/PricingTable";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/pt" element={<PricingTable />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
