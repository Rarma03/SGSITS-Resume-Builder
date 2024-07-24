import { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserContext from "./UserContext";

export default function ResumeNavPage() {
    const { pathname } = useLocation();
    let subpage = pathname.split('/')?.[2];
    if (subpage === undefined) {
        subpage = 'resume';
    }
    function linkClasses(type = null) {
        // const isActive => pathname === '/account' && type === 'profile';
        let classes = '';
        if (type === subpage) {
            classes += 'bg-white text-black rounded-md px-1'
        }
        else {
            classes = 'custom-btn-bg-side rounded-md ';
        }
        return classes;
    }

    const { user, ready } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (ready && !user) {
            navigate('/login');
        }
    }, [user, ready, navigate]);

    if (!ready) {
        return (
            <div>
                wait...
            </div>
        )
    }


    return (
        <div className="bg-black text-white p-4 border-b hide-scrollbar">
            <div className="w-full text-center">
                <button className="custom-btn-bg-side">
                    <Link to={'/profile'} className="custom-btn-bg-side px-2">Menu</Link>
                </button>
            </div>
            <nav className="w-full flex mt-8 gap-4 items-center justify-center  overflow-x-scroll sm:overflow-hidden hide-scrollbar">
                <Link to={'/resume/' + user._id} className={linkClasses('resume')}>
                    Resume
                </Link>
                <Link to={'/resume/personinfo/' + user._id} className={linkClasses('personinfo')}>
                    Personal&nbsp;Information
                </Link>
                <Link to={'/resume/academics/' + user._id} className={linkClasses('academics')}>
                    Academics
                </Link>
                <Link to={'/resume/projects/' + user._id} className={linkClasses('projects')}>
                    Projects
                </Link>
                <Link to={'/resume/platforms/' + user._id} className={linkClasses('platforms')}>
                    Platforms
                </Link>
                <Link to={'/resume/positions/' + user._id} className={linkClasses('positions')}>
                    Position
                </Link>
            </nav>
        </div>
    )
}