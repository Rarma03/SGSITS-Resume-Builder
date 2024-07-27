import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ResumeNavPage from "../../ResumeNavPage";
import axios from 'axios';
import UserContext from "../../UserContext";

export default function PersonaInfoPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [branch, setBranch] = useState('');
    const [enrollmentNo, setEnrollmentNo] = useState('');
    const [year, setYear] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const { id } = useParams();

    // updating data from database if it is present
    useEffect(() => {
        // fetchUserData();
        if (!id) {
            return;
        }
        axios.get(`/resume/personinfo/${id}`).then((res) => {
            const { data } = res;
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setDob(data.dob || '');
            setGender(data.gender || '');
            setBranch(data.branch || '');
            setEnrollmentNo(data.enrollmentNo || '');
            setYear(data.year || '');
            setEmail(data.email || '');
            setPhone(data.phone || '');
        })
    }, [id]);

    // handling save button
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            firstName,
            lastName,
            dob,
            gender,
            branch,
            enrollmentNo,
            year,
            email,
            phone,
        };

        try {
            await axios.post(`/resume/personinfo/${id}`, formData);
            console.log('Form data submitted successfully');
            // navigate('/resume/academics/' + id);
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    // if (loading) {
    //     return <div>Loading...</div>; // Or any loading spinner/component
    // }

    return (
        <div className="bg-black min-h-screen text-white p-4 hide-scrollbar">
            <ResumeNavPage />
            <form
                className="flex flex-col gap-4 lg:px-[200px] md:px-[100px] mt-4"
                onSubmit={handleSubmit}
            >
                {/* Form fields */}
                <div className="flex flex-col">
                    <label>Name:</label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={event => setFirstName(event.target.value)}
                            className="p-2 rounded text-black flex-grow"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={event => setLastName(event.target.value)}
                            className="p-2 rounded text-black flex-grow"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label>Date of Birth</label>
                    <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={dob}
                        onChange={event => setDob(event.target.value)}
                        className="p-2 rounded text-black"
                    />
                </div>
                <div className="flex flex-col">
                    <label>Gender</label>
                    <select
                        value={gender}
                        onChange={event => setGender(event.target.value)}
                        className="p-2 rounded text-black"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label>Branch</label>
                    <select
                        value={branch}
                        onChange={event => setBranch(event.target.value)}
                        className="p-2 rounded text-black"
                    >
                        <option value="">Select Branch</option>
                        <option value="Information Technology">IT</option>
                        <option value="Computer Science and Engineering">CSE</option>
                        <option value="Electronics and Communication Engineering">ECE</option>
                        <option value="Mechanical Engineering">ME</option>
                        <option value="Civil Engineering">CE</option>
                        <option value="Electrical Engineering">EE</option>
                        <option value="Electronics Engineering">EC</option>
                        <option value="Electronics and Instrumentation">EI</option>
                        <option value="Biomedical Engineering">BME</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label>Enrollment No.</label>
                    <input
                        type="text"
                        placeholder="Enrollment No."
                        value={enrollmentNo}
                        onChange={event => setEnrollmentNo(event.target.value)}
                        className="p-2 rounded text-black"
                    />
                </div>
                <div className="flex flex-col">
                    <label>Current Year</label>
                    <input
                        type="text"
                        placeholder="e.g. I ,II ,III or IV"
                        value={year}
                        onChange={event => setYear(event.target.value)}
                        className="p-2 rounded text-black"
                    />
                </div>
                <div className="flex flex-col">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        className="p-2 rounded text-black"
                    />
                </div>
                <div className="flex flex-col">
                    <label>Phone</label>
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={phone}
                        onChange={event => setPhone(event.target.value)}
                        className="p-2 rounded text-black"
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <button
                        type="submit"
                        className="custom-btn-bg-side px-6 py-2 rounded-md"
                    >
                        Save
                    </button>
                    <Link to={'/resume/academics/' + id} className="custom-btn-bg-side px-6 py-2 rounded-md">
                        Next
                    </Link>
                </div>
            </form>
        </div>
    );
}