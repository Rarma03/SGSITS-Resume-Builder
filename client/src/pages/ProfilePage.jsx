import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import axios from "axios";

export default function ProfilePage() {
    const { user, ready, setUser } = useContext(UserContext);


    const navigate = useNavigate();
    useEffect(() => {
        if (ready && !user) {
            navigate('/login');
        }
    }, [ready, user, navigate]);

    let currentUser = 'Guest';
    let firstname = "";
    if (user) {
        currentUser = user.name;
        firstname = user.name.split(' ')[0];
    }

    if (!ready) {
        return (
            <div>
                Wait... (refresh)
            </div>
        )
    }

    // logout function
    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            setUser(null); // Clear user state on successful logout
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };


    return (
        <div className="bg-black min-h-screen text-white p-4 md:text-2xl">
            <div className="flex justify-end">
                <div className="bg-white text-black py-1 px-3 rounded-md flex gap-2 justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    {currentUser}
                </div>
            </div>

            <div className="flex flex-col gap-2 w-full items-center mt-20 sm:mt-0">
                <div className="w-full">
                    <h1 className="">Welcome Back {firstname}...</h1>
                </div>
                <div className="card bg-white sm:h-[70vh] h-[40vh]">
                    <div className="bg-blue-500">
                        <Link to={'/resume/' + user._id}>
                            <span className="flex flex-col items-center justify-center">
                                Build Resume
                                <h1>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                                    </svg>
                                </h1>
                            </span>
                        </Link>
                    </div>
                    <div className="bg-green-500"><span>AI
                        Resume Enhancer<h1>Coming Soon</h1></span></div>
                    <div className="bg-violet-500"><span>Resume Examples<h1>Coming Soon</h1></span></div>
                    <div className="bg-yellow-500"><span>New Features</span></div>
                </div>

                <button
                    className="bg-red-500 h-[15vh] w-full flex justify-center items-center rounded-md hover:bg-red-900 cursor-pointer"
                    onClick={handleLogout} >
                    Logout
                </button>
            </div>
        </div>
    );
}
