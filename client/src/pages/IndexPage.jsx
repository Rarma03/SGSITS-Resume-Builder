import { Link } from 'react-router-dom'
import sgsLogo from '../assets/sgsLogo.svg'

export default function IndexPage() {
    return (
        <div className="bg-black text-white w-[100vw] h-[100vh] p-1 overflow-hidden">
            <div className='h-20'>
                <div className='flex p-2 gap-4 justify-end'>
                    <Link to={'/register'} className="custom-btn-bg-side rounded-full px-5 py-2">
                        Sign Up
                    </Link>
                    <a href="https://www.linkedin.com/in/rajverma7/" target="_blank" rel="noopener noreferrer" className="custom-btn-bg-side rounded-full px-5 py-2">
                        Creator
                    </a>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className='rounded-full mt-[20vh]'>
                    <img src={sgsLogo} alt="Sgsits Logo" className='h-40 w-40' />
                </div>
                <div className="flex flex-col justify-center items-center  mb-20">
                    <h1 className="font-extrabold md:text-[50px] text-[42px]">GS Resume Builder</h1>
                    <span>Now Build Your Resume With Ease</span>
                </div>

                <Link to={'/login'} className="flex">
                    {/* <button class="btn-17">
                        <span class="text-container">
                            <span class="text">Login</span>
                        </span>
                    </button> */}
                    <button className="text-white flex gap-2 custom-btn-glow">
                        Login
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                        </svg>
                    </button>
                </Link>
            </div>
        </div>
    )
}