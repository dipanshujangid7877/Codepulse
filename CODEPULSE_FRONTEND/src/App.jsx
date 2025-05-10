import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext";
import Signup from "./components/auth/Signup";  //  Signup Component Import
import "./App.css";

function App() {
  return (
    <AuthProvider> 
      <Router> 
        <Routes>
          <Route path="/signup" element={<Signup />} />  {/*  Route for Signup Page */}
        </Routes>
      </Router>
    </AuthProvider>

  ); 
}

export default App;
