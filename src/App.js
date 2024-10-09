import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import AdminHome from "./components/AdminHome";
import LandingPage from "./components/Homepage/LandingPage";
import AdminDashboard from "./components/Admindashboard/AdminDashboard";
import CreatePoem from "./components/Poems/CreatePoem";
import Poems from "./components/Poems/Poems";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute allowedRoles={['admin','user']} />}>
          <Route path="/" element={<Home />}>
            <Route index element={<LandingPage />} />
            <Route path="poems" element={<Poems />} />

          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminHome />}>
            <Route index element={<AdminDashboard />} />
            <Route path="create/poem" element={<CreatePoem />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
