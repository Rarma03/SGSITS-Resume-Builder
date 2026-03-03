import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { checkIfEmpty, checkValidEmail } from "../utils/utitlityFunctions";

export default function RegisterPage() {
    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);

    async function registerUser(event) {
        event.preventDefault();

        // Validate inputs
        if (checkIfEmpty(name) || checkIfEmpty(email) || checkIfEmpty(password)) {
            alert('Please fill all fields');
            return;
        }

        // Validate email format
        let chk = checkValidEmail(email);
        if (!chk) {
            alert('Use Appropriate Mail id only')
            setEmail('');
            return;
        }

        try {
            setLoad(true);
            const response = await axios.post('/register', {
                name,
                email,
                password
            });
            alert("Registration Complete");
            setLoad(false);
            navigate('/login');
        }
        catch (err) {
            console.error('Registration error:', err);
            alert(err.response?.data?.message || 'Registration failed. Please try again.');
            setLoad(false);
        }
    }

    return (
        <div className="bg-black text-white h-[100vh]">
            <div className="grow flex items-center justify-around ">
                <div className="mb-32 mt-[20vh] p-5">
                    <h1 className="text-4xl text-center mb-4">Register</h1>
                    <form className="max-w-md mx-auto" onSubmit={registerUser}>
                        <label >Name :</label>
                        <input type="text"
                            className="text-black"
                            placeholder={"e.g. Raj Verma"}
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                        <label >Email :</label>
                        <input type="text"
                            className="text-black"
                            placeholder={"yourmail@email.com"}
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                        />
                        <label >Password :</label>
                        <input type="password"
                            className="text-black"
                            placeholder="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}

                        />
                        <button
                            type="submit"
                            className={`load-btn ${load ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={load}
                        >
                            {load ? 'Wait we creating your Account...' : 'Register'}
                        </button>
                        <div className="text-center">
                            Already a Member?
                            <Link to={'/login'} className="ml-1 text-yellow-300 underline ">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}