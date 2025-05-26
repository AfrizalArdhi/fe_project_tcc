import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Resto from "./components/Resto";
import Profileaja from "./components/Profileaja";
import Profilereview from "./components/Profilereview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Resto/:id" element={<Resto />} />
        <Route path="/Profileaja" element={<Profileaja />} />
        <Route path="/Profilereview" element={<Profilereview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
