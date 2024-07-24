import { Route, Routes } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import ResumePage from './pages/ResumePage'
import AcademicsPage from './pages/resumeBuilderComponent/AcademicsPage'
import PersonaInfoPage from './pages/resumeBuilderComponent/PersonInfoPage'
import ProjectPage from './pages/resumeBuilderComponent/ProjectPage'
import PlatformPage from './pages/resumeBuilderComponent/PlatformPage'
import PositionPage from './pages/resumeBuilderComponent/PositionPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

export default function App() {
  return (
    // using context provider to pass information in all routes otherwise 
    // we need to pass them manually using states
    <UserContextProvider>
      {/* we going to define the routes up here */}
      <Routes>
        <Route path='/' element={<IndexPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/resume/:id' element={<ResumePage />} />
        <Route path='/resume/personinfo/:id' element={<PersonaInfoPage />} />
        <Route path='/resume/academics/:id' element={<AcademicsPage />} />
        <Route path='/resume/projects/:id' element={<ProjectPage />} />
        <Route path='/resume/platforms/:id' element={<PlatformPage />} />
        <Route path='/resume/positions/:id' element={<PositionPage />} />
      </Routes>
    </UserContextProvider>
  )
}

