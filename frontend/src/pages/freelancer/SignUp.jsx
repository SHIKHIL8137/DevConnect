import React,{useState,useEffect,useRef} from 'react'
import Navbar from '../../components/user/loginSignUp_Navbar/Navbar';
import signUpimg from '../../assets/images/freepik__background__53588.png'
import { Check ,Eye ,EyeOff } from 'lucide-react';
import { useNavigate,useLocation } from 'react-router-dom';
import {doPasswordsMatch, isValidEmail, isValidUsername, validateOTP ,isValidPassword} from '../../util/validation'
import { checkUserName, getOtp, validateOtp, validateUser } from '../../apis/userApi';
import { toast } from 'sonner';


const SignUp = () => {
   const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userName, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(false);
  
    const navigate = useNavigate();
    const location = useLocation();
  
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role');
  
    useEffect(() => {
      let timer;
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else if (isOtpSent && !isOtpVerified) {
        setCanResend(true);
      }
      
      return () => clearTimeout(timer);
    }, [countdown, isOtpSent, isOtpVerified]);
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
    const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };
  
    const handleSendOtp = async() => {
      if (isValidEmail(email)&&isValidUsername(userName)) {
        try {
          const response = await getOtp({email:email});
          if(!response.data.status){
            toast.error(response.data.message);
            return
          }
          setIsOtpSent(true);
          setCountdown(30);
          setCanResend(false);
          toast.success(response.data.message);
        } catch (error) {
         if (error.response && error.response.status === 409 || error.response.status === 400) {
                 toast.error(error.response.data.message);
                 }else{
                   toast.error('Internal server error')
         }
        }
      } else {
        if(!isValidEmail(email)){
          toast.error('Please enter valid mail');
        }else if(!isValidUsername(userName)){
          toast.error('Please enter valid username');
        }
      }
    };
  
    const userNameMessage = useRef();
    const userNameHandler =async(e)=>{
      try {
        const userNameInput = e.target.value;
      setUsername(userNameInput)
      const response = await checkUserName({userName:userNameInput});
      if(!response.data.status){
        userNameMessage.current.textContent = 'Username already exist'
        userNameMessage.current.style.color = 'red';
      }else{
      if(isValidUsername(userNameInput)){
        userNameMessage.current.textContent = 'Valid userName'
        userNameMessage.current.style.color = 'green';
      }else{
        userNameMessage.current.textContent = 'Username not valid'
        userNameMessage.current.style.color = 'red';
      }
      }
        setTimeout(() => {
          if (userNameMessage.current) {
            userNameMessage.current.textContent = '';
          }
        }, 3000);
      } catch (error) {
        if (error.response && error.response.status === 409 || error.response.status === 400) {
          userNameMessage.current.textContent = 'Username already exist'
          userNameMessage.current.style.color = 'red';
          setTimeout(() => {
            if (userNameMessage.current) {
              userNameMessage.current.textContent = '';
            }
          }, 3000);
        } else {
          console.error('Other error:', error.message);
        }
      }
    }
  
    const handleResendOtp = async() => {
      try {
        const response = await getOtp({email:email});
        if(!response.data.status){
          toast.error(response.data.message);
          return
        }
        setCountdown(30);
        setCanResend(false);
        toast.success(response.data.message);
      } catch (error) {
        toast.error(response.data.message);
      }
  
    };
  
    const handleVerifyOtp = async() => {
      if (validateOTP(otp)) {
        try {
          const response = await validateOtp({otp,email});
          if(!response.data.status) return toast.error(response.data.message);
          toast.success(response.data.message);
          setIsOtpVerified(true);
          setCanResend(false);
          localStorage.setItem('otp',response.data.otp);
        } catch (error) {
          toast.error('internal server error');
        }
      } else {
        toast.error('Please enter the OTP');
      }
    };
  
    const handleSubmit = async() => {
      if (!isOtpVerified) {
        toast.error('Please verify your email with OTP first');
        return;
      }
      if(!isValidPassword(password)){
        toast.error('Password must be at least 8 characters long and include at least one letter and one number');
        return;
      }
      if (!doPasswordsMatch(password,confirmPassword)) {
        toast.error('Passwords do not match');
        return;
      }
  
      const storedOtp = localStorage.getItem('otp');
      if(!storedOtp) return toast.error('otp expired');
      
      try {
        const response = await validateUser({email,otp:storedOtp,userName,password,role})
        if(!response.data.status){
          toast.error(response.data.message);
          return
        }
        setUsername('');
        setEmail('');
        setOtp('');
        setConfirmPassword('');
        setPassword('')
        setIsOtpSent(false);
        setIsOtpVerified(false);
        setCanResend(false);
        setCountdown(0);
        toast.success(response.data.message);
      } catch (error) {
        toast.error(response.data.message);
      }
  };

  const googleLoginFreelancer = ()=>{
    window.location = 'http://localhost:5000/user/auth/google?role=freelancer'
  }
  return (
    <div className="min-h-screen bg-blue-50 px-4 py-4">
    <Navbar/>
    <div className="flex items-center justify-center w-full h-full mt-15">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-blue-100 flex items-center justify-center p-8">
        <img src={signUpimg} alt="login image" />
        </div>
        <div className="w-full md:w-1/2 py-8 px-6 md:px-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Sign up to find work you love</h2>
          </div>

          <button 
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-full p-2 mb-6 hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={()=>googleLoginFreelancer()}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Log in with Google as a freelancer</span>
          </button>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">Email or Use</span>  
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                value={userName}
                onChange={(e) => userNameHandler(e)}
                className="w-full border-b-2 border-gray-300 py-2 outline-none focus:border-blue-500 transition-colors"
                placeholder="Username"
                disabled={isOtpVerified}
              />
               <p ref={userNameMessage} className="text-sm mt-1"></p>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-gray-300 py-2 outline-none focus:border-blue-500 transition-colors"
                placeholder="Email Address"
                disabled={isOtpVerified}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label htmlFor="otp" className="sr-only">OTP</label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border-b-2 border-gray-300 py-2 outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter OTP"
                  disabled={!isOtpSent || isOtpVerified}
                />
              </div>
              {!isOtpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition-colors cursor-pointer"
                  disabled={!email}
                >
                  Get OTP
                </button>
              ) : !isOtpVerified ? (
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Verify
                </button>
              ) : (
                <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg flex items-center">
                  <Check size={16} className="mr-1" /> Verified
                </div>
              )}
            </div>
            {isOtpSent && !isOtpVerified && (
                <div className="flex justify-end text-sm">
                  {countdown > 0 ? (
                    <span className="text-gray-500">Resend OTP in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors font-medium"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}

            {isOtpVerified && (
              <>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-b-2 border-gray-300 py-2 outline-none focus:border-blue-500 transition-colors pr-10"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-2 text-gray-400 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-b-2 border-gray-300 py-2 outline-none focus:border-blue-500 transition-colors pr-10"
                    placeholder="Confirm Password"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-2 top-2 text-gray-400 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </>
            )}

            <button
              onClick={handleSubmit}
              type="button"
              className="w-full cursor-pointer bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-lg font-medium transition-colors mt-4"
              disabled={!isOtpVerified}
            >
              SIGN UP
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Already have an account? 
                <span onClick={()=>navigate('/logIn')} className="text-blue-600 ml-1 font-medium cursor-pointer">LOG IN</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default SignUp
