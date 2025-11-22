import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Commissions from './pages/Commissions'
import Products from './pages/Products'
import CraftFairs from './pages/CraftFairs'
import Sales from './pages/Sales'
import Branding from './pages/Branding'
import Customers from './pages/Customers'
import Finance from './pages/Finance'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="commissions" element={<Commissions />} />
          <Route path="products" element={<Products />} />
          <Route path="craft-fairs" element={<CraftFairs />} />
          <Route path="sales" element={<Sales />} />
          <Route path="branding" element={<Branding />} />
          <Route path="customers" element={<Customers />} />
          <Route path="finance" element={<Finance />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
