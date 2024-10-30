import React from "react";
import Home from "../src/components/Home";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Blogs from "../src/pages/Blogs";
import About from "../src/pages/About";
import Contact from "../src/pages/Contact";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Dashboard from "../src/pages/Dashboard";
import Creators from "./pages/Creators";
import { useAuth } from "./context/AuthProvider";
import {Toaster} from "react-hot-toast"
import UpdateBlog from "./dashboard/UpdateBlog";
import Details from "./pages/Details";
import Notfound from "./pages/Notfound";
function App() {
  const location = useLocation();
  const hideNavbarFooter = ["/dashboard", "/login", "/register"].includes(
    location.pathname
  );
  const { blogs,isAuthenticated } = useAuth();
  console.log(blogs);
  console.log(isAuthenticated);
  return (
    <div>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/blogs" element={<Blogs />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/creators" element={<Creators />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        {/*Single Page route */}
        <Route exact path="/blog/:id" element={<Details/>} />
        {/*Update page route*/}
        <Route exact path="/blog/update/:id" element={<UpdateBlog/>} />
        {/*Universal Route */}
        <Route exact path="*" element={<Notfound/>} />

      </Routes>
    <Toaster/>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
