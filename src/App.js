import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Resto from "./components/Resto";
import Profileaja from "./components/Profileaja";
import Profilereview from "./components/Profilereview";
import Editresto from "./components/Editresto";
import Editmenu from "./components/Editmenu";
import Tambahresto from "./components/Tambahresto";
import Editrestoinput from "./components/Editrestoinput";
import Tambahmenu from "./components/Tambahmenu";
import Editmenuinput from "./components/Editmenuinput";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Resto/:id" element={<Resto />} />
        <Route path="/Profileaja" element={<Profileaja />} />
        <Route path="/Profilereview" element={<Profilereview />} />
        <Route path="/Editresto" element={<Editresto />} />
        <Route path="/Editmenu/:id" element={<Editmenu />} />
        <Route path="/Tambahresto" element={<Tambahresto />} />
        <Route path="/Editrestoinput/:id" element={<Editrestoinput />} />
        <Route path="/Tambahmenu/:id" element={<Tambahmenu />} />
        <Route path="/Editmenuinput/:id" element={<Editmenuinput />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
