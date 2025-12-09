import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/auth.ts/Register";
import Login from "./Pages/auth.ts/login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register/>}/>
         <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}
