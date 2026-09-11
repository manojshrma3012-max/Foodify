import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { serviceurl } from "../main"
import toast from "react-hot-toast"
import { useGoogleLogin} from '@react-oauth/google'
import { FcGoogle } from "react-icons/fc"
import { useAppdata } from "../context/AppContext"



const Login = () => {
    const [Loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const {setUser,setisAuth} = useAppdata()
   const googleres = async (authresult: any) => {
    console.log("Google success:", authresult);

    setLoading(true);

    try {
        console.log("Sending code to backend:", authresult.code);
        const res = await axios.post(
            `${serviceurl}/api/auth/login`,
            {
                code: authresult.code
            }
        );
      

        console.log("Backend response:", res);
        setUser(res.data.user)
        setisAuth(true)

        localStorage.setItem("token", res.data.token);
        

        toast.success(res.data.message);

        navigate("/");
    } catch (error) {
        console.error("Login error:", error);
        toast.error("Problem while logging in");
    } finally {
        setLoading(false);
    }
};

const googlelogin = useGoogleLogin({
    onSuccess: googleres,

    onError: (error) => {
        console.error("Google OAuth error:", error);
        toast.error("Google login failed");
        setLoading(false);
    },

    flow: "auth-code"
});
   
    
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full space-y-6 max-w-sm">
            <h1 className="text-center text-2xl font-bold text-[#E23774]">
                Foodify
            </h1>
            <p className="text-center text-sm text-gray-500"> 
            Log in or sign up to continue
            </p>
            <button onClick={googlelogin} disabled={Loading} className="w-full justify-center flex items-center rounded-xl gap-3 border border-gray-300 bg-white px-4 py-3">
                <FcGoogle size={16}/>
                {Loading ? "...Signing in " : "Continue With Google"}
            </button>

        </div>
    </div>
  )
}

export default Login