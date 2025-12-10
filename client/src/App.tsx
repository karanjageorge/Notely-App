import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./Pages/Homepage/LandingPage";
import Register from "./Pages/auth.ts/Register";
import Login from "./Pages/auth.ts/login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import CreateNote from "./Pages/Notes/CreateNote";
import Profile from "./Pages/Profile/profile";
import EditProfile from "./Pages/Profile/editProfile";
import EditNote from "./Pages/Notes/EditNote";
import ViewNote from "./Pages/Notes/ViewNote";
import Trash from "./Pages/Notes/Trash";

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast notifications */}
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createnote" element={<CreateNote />} />
        <Route path="/editnote/:id" element={<EditNote />} />
        <Route path="/viewnote/:id" element={<ViewNote />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
