import './App.css'
import ClerkRoutes from './auth/ClerkRoutes'
import { Routes, Route } from 'react-router'
import Layout from './pages/Layout'
import Authentication from './pages/Authentication'
import Upload from './pages/Upload'
import ResumeReview from './pages/ResumeReview'


function App() {
  return (
    <ClerkRoutes>
      <Routes>
        <Route path="/sign-in/*" element={<Authentication />} />
        <Route path="/sign-up/*" element={<Authentication />} />

        <Route element={<Layout />}>
          <Route path="/" element={null} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/ResumeReview/:id" element={<ResumeReview />} />
        </Route>

      </Routes>
    </ClerkRoutes>
  )
}


export default App
