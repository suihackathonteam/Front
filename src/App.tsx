import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import AdminPanel from "./pages/AdminPanel";
import WorkerPanel from "./pages/WorkerPanel";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="worker" element={<WorkerPanel />} />
                    <Route path="admin" element={<AdminPanel />} />
                    <Route path="about" element={<About />} />
                    <Route path="services" element={<Services />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
