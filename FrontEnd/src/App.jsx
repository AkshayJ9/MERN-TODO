import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";
import "./index.css";
import PageNotFound from "./component/PageNotFound";
import { Toaster } from "react-hot-toast";
function App() {
  const token = localStorage.getItem("jwt");
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={token ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* This is universal Route denoted by (*) star    */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
