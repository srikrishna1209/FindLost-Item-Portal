import AdminItems from "./pages/AdminItems";
import AdminClaims from "./pages/AdminClaims";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminContactMessages from "./pages/AdminContactMessages";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import MyItems from "./pages/MyItems";
import MyClaims from "./pages/MyClaims";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import ItemDetails from "./pages/ItemDetails";

import Navbar from "./components/Navbar";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ================= AUTHENTICATION ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================= LOST ITEMS ================= */}

        <Route
          path="/lost-items"
          element={<LostItems />}
        />


        {/* ================= REPORT LOST ================= */}

        <Route
          path="/report-lost"
          element={<ReportLost />}
        />


        {/* ================= FOUND ITEMS ================= */}

        <Route
          path="/found-items"
          element={<FoundItems />}
        />


        {/* ================= REPORT FOUND ================= */}

        <Route
          path="/report-found"
          element={<ReportFound />}
        />


        {/* ================= ITEM DETAILS ================= */}

        <Route
          path="/items/:id"
          element={<ItemDetails />}
        />

        <Route
          path="/my-claims"
          element={<MyClaims />}
        />
        <Route
          path="/my-items"
          element={<MyItems />}
        />

        <Route
          path="/how-it-works"
          element={<HowItWorks />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />
        
        
        <Route element={<AdminRoute />}>
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

       <Route
         path="/admin/contact-messages"
         element={<AdminContactMessages />}
       />

       <Route
         path="/admin/claims"
         element={<AdminClaims />}
       />

       <Route
         path="/admin/items"
         element={<AdminItems />}
       />

       </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;