import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../UserContext";
import { checkValidEmail } from '../utils/utitlityFunctions'

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Use useNavigate hook for navigation
    const { setUser } = useContext(UserContext);
    const [load, setLoad] = useState(false);

    async function handleLoginSubmit(event) {
        event.preventDefault();
        try {
            setLoad(true);
            let chk = checkValidEmail(email);
            if (!chk) {
                alert('Use Appropriate Mail id only')
                setEmail('');
                setLoad(false);
                return;
            }
            const userData = await axios.post('/login', {
                email,
                password
            });

            alert("Login Success");
            setUser(userData.data); // we only want to pass data not other info
            setLoad(false);

            navigate('/profile');
        }
        catch (err) {
            alert(err.response?.data?.message);
            setLoad(false);
        }
    }
    return (
        <div className="bg-black text-white h-[100vh]">
            <div className="pt-4 pl-4 -mb-4">
                <Link to={'/'} className="hover:bg-white hover:text-black flex  w-10 rounded-full h-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </Link>
            </div>

            <div className="grow flex items-center justify-around">
                <div className="mb-32 mt-[30vh] p-5">
                    <h1 className="text-4xl text-center mb-4">Login</h1>
                    <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                        <label >
                            Email :
                        </label>
                        <input type="text"
                            className="text-black"
                            placeholder={"yourmail@sgsitsindore.in"}
                            value={email}
                            onChange={event => setEmail(event.target.value)} />
                        <label >
                            Password :
                        </label>
                        <input type="text"
                            className="text-black"
                            placeholder="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)} />
                        <button
                            type="submit"
                            className={`load-btn ${load ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={load}
                        >
                            {load ? 'Loading...' : 'Login'}
                        </button>
                        <div className="text-center">
                            Don't Have a Account?
                            <Link to={'/register'} className="ml-1 text-yellow-300 underline ">Register</Link>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}