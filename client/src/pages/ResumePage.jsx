import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import ResumeNavPage from "../ResumeNavPage";
import { useContext, useState } from "react";
import UserContext from "../UserContext";

export default function ResumePage() {
    const { id } = useParams();
    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'resume';
    }

    const { user, ready } = useContext(UserContext);

    let currentUser = 'Guest';
    if (user) {
        currentUser = user.email;
    }

    if (!ready) {
        return (
            <div>
                wait...
            </div>
        )
    }

    const [load, setLoad] = useState(false);
    const downloadResume = async (ev) => {
        ev.preventDefault();
        try {
            setLoad(true);
            const response = await axios.get(`/download-resume/${id}`, {
                responseType: 'blob',
            });
            setLoad(false);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'CV02Pages_{enrollmentNo}_BT_Branch_{firstName}_{lastName}.docx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading resume:', error);
            setLoad(false);
        }
    };

    return (
        <div className="bg-black min-h-screen text-white p-4">
            <div className="flex justify-end">
                <div className="bg-white text-black py-1 px-3 rounded-md flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    {currentUser}
                </div>
            </div>

            <ResumeNavPage />

            {subpage === 'resume' && (
                <div className="text-white text-2xl w-full text-center">
                    <h1 className="mt-20 mb-4">Your <span className="underline underline-offset-2 decoration-yellow-300">Resume</span> Not so far... Just Download it Now</h1>
                    <p className='text-sm -mt-3 mb-5'>For Best View Open Downloaded File In MS Word</p>
                    <div className="flex justify-center w-full">
                        <button
                            onClick={downloadResume}
                            className={`flex items-center p-2 rounded-md gap-2 border border-white custom-btn-bg-side ${load ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={load}
                        >
                            {load ? (
                                <span>Generate Ho rha Resume Wait...</span>
                            ) : (
                                <>
                                    Download
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                    <div className="my-5">Or</div>
                    <div className="my-5">Haven't Created One ?</div>
                    <div className="flex justify-center w-full">
                        <button className="flex items-center p-2 rounded-md gap-2 border border-white custom-btn-bg-side">
                            <Link to={'/resume/personinfo/' + id}>
                                Start Creating
                            </Link>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )
            }
        </div >
    );
}
