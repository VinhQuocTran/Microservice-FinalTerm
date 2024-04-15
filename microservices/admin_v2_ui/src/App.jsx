import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Signin, VerifyProperty, ListProperty } from "./pages/imports";
import './App.css'


function App() {
  const currentUser = useSelector((state) => state.user);

  return (
    <>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={currentUser?.user?.role === "admin" ? <Home /> : <Signin />} />
            <Route path="/verify-property" element={currentUser?.user?.role === "admin" ? <VerifyProperty /> : <Signin />} />
            <Route path="/list-property" element={currentUser?.user?.role === "admin" ? <ListProperty /> : <Signin />} />
            <Route path="/sign-in" element={currentUser.user ? <Home /> : <Signin />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
