import './App.css'
import {Routes,Route, useLocation} from 'react-router-dom'
import Home from './pages/common/Home'
import Login from './pages/common/Login'
import SignUp from './pages/client/SignUp'
import FSignUp from './pages/freelancer/SignUp'
import SignupChoosing from './pages/common/signupChoosing'
import Forget from './pages/common/Forget'
import {Toaster} from 'sonner'
import FreelancerMarketplace from './pages/client/Home'
import FreelancerListing from './pages/freelancer/Home'
import { AdminProtectedRoute, AdminPublicRoute, ProtectedRoute, PublicRoute } from './util/protectedRoutes'
import Profile from './pages/client/Profile'
import ProfileFreelancer from './pages/freelancer/Profile'
import ProfileUpdate from './pages/freelancer/ProfileUpdate'
import ProfileUpdateClient from './pages/client/ProfileUpdate'
import GoogleAuthRedirect from './pages/common/authGoogle'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserData } from './redux/thunk/userThunk'
import { logout } from './redux/slices/userSlice'
import { logout as adminLogout} from './redux/slices/adminSlice'
import AdminLogin from './pages/admin/login'
import DevConnectDashboard from './pages/admin/DashBoard'
import { fetchAdminData } from './redux/thunk/adminThunk'
import ProfileCompletionModal from './components/user/modals/profileCompletionModal'


function App() {
const dispatch = useDispatch()
const {user} = useSelector((state)=>state.user);
const {admin} = useSelector((state)=>state.admin);
const location = useLocation();
const [showModal, setShowModal] = useState(false);
useEffect(() => {
  if(user){
    const verifyUser = async () => {
      const result = await dispatch(fetchUserData());
      console.log(result)
      if (
        fetchUserData.rejected.match(result) &&
        (result.payload === 'Token has expired' || result.payload === 'Invalid token')
      ) {
        dispatch(logout()); 
      }else if (result.payload?.block) {
        dispatch(logout()) 
      }else{
        if (result.payload?.role === 'freelancer') {
          const isIncomplete =
            !result.payload?.position ||
            !result.payload?.about ||
            !result.payload?.pricePerHour ||
            !result.payload?.skills || result.payload?.skills.length === 0;
        
          setShowModal(isIncomplete);
        }
        
      }
    };
    verifyUser();
  }else if(admin){
    const verifyAdmin = async () => {
      const result = await dispatch(fetchAdminData());
      if (
        fetchUserData.rejected.match(result) &&
        (result.payload === 'Token has expired' || result.payload === 'Invalid token')
      ) {
        dispatch(adminLogout()); 
      }
    };
    verifyAdmin();
  }else{
    dispatch(logout());
    dispatch(adminLogout()); 
  }
}, [location.pathname]);


  return (
    <>
    <Toaster richColors position="top-right" />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/logIn' element={<PublicRoute><Login/></PublicRoute>} />
      <Route path='/client/signUp' element={<PublicRoute><SignUp/></PublicRoute>} />
      <Route path='/freelancer/signUp' element={<PublicRoute><FSignUp/></PublicRoute>} />
      <Route path='/signUp' element={<PublicRoute><SignupChoosing/></PublicRoute>} />
      <Route path='/forgotPassword' element={<PublicRoute><Forget/></PublicRoute>} />
      <Route path='/client/home' element={<ProtectedRoute><FreelancerMarketplace/></ProtectedRoute> }/>
      <Route path='/freelancer/home' element={<ProtectedRoute><FreelancerListing/></ProtectedRoute>} />
      <Route path='/client/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
      <Route path='/freelancer/profile' element={<ProtectedRoute><ProfileFreelancer/></ProtectedRoute>}/>
      <Route path='/freelancer/profileUpdate' element={<ProtectedRoute><ProfileUpdate/></ProtectedRoute>}/>
      <Route path='/client/profileUpdate' element={<ProtectedRoute><ProfileUpdateClient/></ProtectedRoute>}/>
      <Route path='/google-auth-redirect' element={<GoogleAuthRedirect/>}/>


      <Route path="/admin/login" element={<AdminPublicRoute><AdminLogin /></AdminPublicRoute>} />
      <Route path="/admin/:tab?" element={<AdminProtectedRoute><DevConnectDashboard /></AdminProtectedRoute>} />

     
    </Routes>
    {user?.role === 'freelancer' && showModal && (
        <ProfileCompletionModal closeModal={() => setShowModal(false)} />
      )}

    </>
  )
}

export default App
