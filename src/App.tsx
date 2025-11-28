import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Dashboard from './Dashboard'
import Home from './Home'
import About from './About'
import Services from './Services'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
