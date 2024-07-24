import { useEffect, useState } from 'react';
import ResumeNavPage from "../../ResumeNavPage";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function AcademicsPage() {
    const [tenthDetails, setTenthDetails] = useState({
        percentage: '',
        school: '',
        board: '',
        passOutYear: ''
    });

    const [twelfthDetails, setTwelfthDetails] = useState({
        percentage: '',
        school: '',
        board: '',
        passOutYear: '',
        is12th: false,
        isDiploma: false
    });

    const [graduationDetails, setGraduationDetails] = useState({
        percentage: '',
        college: '',
        university: '',
        passOutYear: ''
    });

    const [scholasticAchievement, setScholasticAchievement] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAcademicDetails = async () => {
            try {
                const response = await axios.get(`/resume/academics/${id}`);
                const { tenth, twelfth, graduation, scholasticAchievement } = response.data;
                setTenthDetails(tenth);
                setTwelfthDetails(twelfth);
                setGraduationDetails(graduation);
                setScholasticAchievement(scholasticAchievement || ''); // Handle case where scholasticAchievement might not be provided
            } catch (error) {
                console.error('Error fetching academic details:', error);
            }
        };

        fetchAcademicDetails();
    }, [id]);


    const handleTenthChange = (e) => {
        setTenthDetails({
            ...tenthDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleTwelfthChange = (e) => {
        setTwelfthDetails({
            ...twelfthDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleGraduationChange = (e) => {
        setGraduationDetails({
            ...graduationDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleScholasticAchievementChange = (e) => {
        setScholasticAchievement(e.target.value);
    };

    const handleTwelfthCheckboxChange = (e) => {
        setTwelfthDetails({
            ...twelfthDetails,
            is12th: e.target.checked
        });
    };

    const handleDiplomaCheckboxChange = (e) => {
        setTwelfthDetails({
            ...twelfthDetails,
            isDiploma: e.target.checked
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            tenthDetails,
            twelfthDetails,
            graduationDetails,
            scholasticAchievement
        };
        console.log('Form data:', formData);
        try {
            const response = await axios.post(`/resume/academics/${id}`, formData);
            console.log('Server response:', response.data);
            // navigate('/nextpage'); // Navigate to the next page or show success message
        } catch (error) {
            console.error('Error sending data to the server:', error);
        }
    };

    return (
        <div className="bg-black min-h-screen text-white p-4">
            <ResumeNavPage />
            <form
                className="flex flex-col gap-4 lg:px-[200px] md:px-[100px] mt-4"
                onSubmit={handleSubmit}
            >
                {/* 10th Details */}
                <div className="flex flex-col">
                    <div className="bg-white rounded-md text-black p-2">
                        <div className="text-center font-bold">10th Details</div>
                        <label>Percentage/CGPA :</label>
                        <input
                            type="text"
                            name="percentage"
                            value={tenthDetails.percentage}
                            onChange={handleTenthChange}
                            placeholder="e.g. 83.4 [don't use %]"
                        />
                        <label>School :</label>
                        <input
                            type="text"
                            name="school"
                            value={tenthDetails.school}
                            onChange={handleTenthChange}
                            placeholder="e.g. Kendriya Vidyalaya No.1"
                        />
                        <label>Board :</label>
                        <input
                            type="text"
                            name="board"
                            value={tenthDetails.board}
                            onChange={handleTenthChange}
                            placeholder="e.g. CBSE"
                        />
                        <label>Pass-Out Year :</label>
                        <input
                            type="text"
                            name="passOutYear"
                            value={tenthDetails.passOutYear}
                            onChange={handleTenthChange}
                            placeholder="e.g. 2018"
                        />
                    </div>
                </div>

                {/* 12th/Diploma Details */}
                <div className="flex flex-col">
                    <div className="bg-white rounded-md text-black p-2">
                        <div className="text-center font-bold">12th/Diploma Details</div>
                        <label>Percentage/CGPA :</label>
                        <input
                            type="text"
                            name="percentage"
                            value={twelfthDetails.percentage}
                            onChange={handleTwelfthChange}
                            placeholder="e.g. 88.5 [don't use %]"
                        />
                        <label>School/College :</label>
                        <input
                            type="text"
                            name="school"
                            value={twelfthDetails.school}
                            onChange={handleTwelfthChange}
                            placeholder="e.g. XYZ College"
                        />
                        <label>Board/University :</label>
                        <input
                            type="text"
                            name="board"
                            value={twelfthDetails.board}
                            onChange={handleTwelfthChange}
                            placeholder="e.g. State Board/XYZ University"
                        />
                        <label>Pass-Out Year :</label>
                        <input
                            type="text"
                            name="passOutYear"
                            value={twelfthDetails.passOutYear}
                            onChange={handleTwelfthChange}
                            placeholder="e.g. 2020"
                        />
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                name="is12th"
                                checked={twelfthDetails.is12th}
                                onChange={handleTwelfthCheckboxChange}
                                className="mr-2"
                            />
                            <label>12th</label>
                        </div>
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                name="isDiploma"
                                checked={twelfthDetails.isDiploma}
                                onChange={handleDiplomaCheckboxChange}
                                className="mr-2"
                            />
                            <label>Diploma</label>
                        </div>
                    </div>
                </div>

                {/* Graduation Details */}
                <div className="flex flex-col">
                    <div className="bg-white rounded-md text-black p-2">
                        <div className="text-center font-bold">Graduation Details</div>
                        <label>Percentage/CGPA :</label>
                        <input
                            type="text"
                            name="percentage"
                            value={graduationDetails.percentage}
                            onChange={handleGraduationChange}
                            placeholder="e.g. 7.5"
                        />
                        <label>College :</label>
                        <input
                            type="text"
                            name="college"
                            value={graduationDetails.college}
                            onChange={handleGraduationChange}
                            placeholder="e.g. ABC College"
                        />
                        <label>University :</label>
                        <input
                            type="text"
                            name="university"
                            value={graduationDetails.university}
                            onChange={handleGraduationChange}
                            placeholder="e.g. XYZ University"
                        />
                        <label>Pass-Out Year :</label>
                        <input
                            type="text"
                            name="passOutYear"
                            value={graduationDetails.passOutYear}
                            onChange={handleGraduationChange}
                            placeholder="e.g. 2023"
                        />
                    </div>
                </div>

                {/* Scholastic Achievement */}
                <div className="flex flex-col">
                    <div className="bg-white rounded-md text-black p-2">
                        <div className="text-center font-bold">Scholastic Achievement</div>
                        <label>Description :</label>
                        <input
                            type="text"
                            name="scholasticAchievement"
                            value={scholasticAchievement}
                            onChange={handleScholasticAchievementChange}
                            placeholder="e.g. National Science Olympiad Gold Medalist"
                        />
                    </div>
                </div>

                <div className="flex justify-between mt-2">
                    <button
                        type="submit"
                        className="custom-btn-bg-side px-6 py-2 rounded-md"
                    >
                        Save
                    </button>
                    <Link to={'/resume/projects/' + id} className="custom-btn-bg-side px-6 py-2 rounded-md">
                        Next
                    </Link>
                </div>
            </form>
        </div>
    );
}
