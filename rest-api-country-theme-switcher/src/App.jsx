import Home from "./pages/Home";
import CountryDetails from "./pages/CountryDetails";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/country/:name" element={<CountryDetails />} />
    </Routes>
  );
}

export default App;
