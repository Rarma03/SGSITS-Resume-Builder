import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

export default function RegisterPage() {
    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function registerUser(event) {
        event.preventDefault();
        try {
            await axios.post('/register', {
                name,
                email,
                password
            });
            alert("Registration Complete");
            navigate('/login');
        }
        catch (err) {
            alert(err.response?.data?.message || 'Some problem occured while registring');
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
                        <input type="text"
                            className="text-black"
                            placeholder="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}

                        />
                        <input type="submit" value="Register" />
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