import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../UserContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Use useNavigate hook for navigation
    const { setUser } = useContext(UserContext);

    async function handleLoginSubmit(event) {
        event.preventDefault();
        try {
            const userData = await axios.post('/login', {
                email,
                password
            });
            alert("Login Success");
            setUser(userData.data); // we only want to pass data not other info

            navigate('/profile');
        }
        catch (err) {
            alert(err.response?.data?.message);
        }
    }
    return (
        <div className="bg-black text-white h-[100vh]">

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
                        <input type="submit" value="Login"
                        />
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