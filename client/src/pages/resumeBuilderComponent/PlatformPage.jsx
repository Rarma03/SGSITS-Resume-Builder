import { useState, useEffect } from 'react';
import ResumeNavPage from "../../ResumeNavPage";
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PlatformsPage() {
    const [os, setOS] = useState([]);
    const [programmingSkills, setProgrammingSkills] = useState([]);
    const [webDesigning, setWebDesigning] = useState([]);
    const [softwareSkills, setSoftwareSkills] = useState([]);
    const [coreCourses, setCoreCourses] = useState([]);
    const [depthCourses, setDepthCourses] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlatformDetails = async () => {
            try {
                const response = await axios.get(`/resume/platforms/${id}`);
                const { operatingSystems, programmingSkills, webDesigningSkills, softwareSkills, courses } = response.data;
                setOS(operatingSystems);
                setProgrammingSkills(programmingSkills);
                setWebDesigning(webDesigningSkills);
                setSoftwareSkills(softwareSkills);
                setCoreCourses(courses.core);
                setDepthCourses(courses.depth);
            } catch (error) {
                console.error('Error fetching platform details:', error);
            }
        };

        fetchPlatformDetails();
    }, [id]);

    const handleAddTag = (setStateFunction, currentValue) => {
        if (currentValue.trim()) {
            setStateFunction(prevState => [...prevState, currentValue.trim()]);
        }
    };

    const handleRemoveTag = (setStateFunction, index) => {
        setStateFunction(prevState => prevState.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            operatingSystems: os,
            programmingSkills,
            webDesigningSkills: webDesigning,
            softwareSkills,
            courses: {
                core: coreCourses,
                depth: depthCourses,
            },
        };
        console.log('Form data:', formData);
        try {
            const response = await axios.post(`/resume/platforms/${id}`, formData);
            console.log('Server response:', response.data);
        } catch (error) {
            console.error('Error sending data to the server:', error);
        }
    };

    const renderTagInput = (label, state, setState, placeholder) => {
        const [inputValue, setInputValue] = useState('');

        return (
            <div className="flex flex-col bg-white rounded-md text-black p-2 mb-4">
                <div className="text-center font-bold">{label}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {state.map((tag, index) => (
                        <div key={index} className="bg-gray-200 p-1 rounded flex items-center">
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(setState, index)}
                                className="ml-2 text-red-500"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex mt-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-grow p-2 border rounded-l-md"
                        placeholder={placeholder}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            handleAddTag(setState, inputValue);
                            setInputValue('');
                        }}
                        className="bg-green-500 text-white p-2 rounded-full m-2 h-10 w-10"
                    >
                        +
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-black min-h-screen text-white p-4">
            <ResumeNavPage />
            <form className="flex flex-col gap-4 lg:px-[200px] md:px-[100px] mt-4" onSubmit={handleSubmit}>
                <div className="text-center font-bold text-xl mb-4">Platforms, Languages, Technologies & Tools Worked</div>
                {renderTagInput('Operating Systems', os, setOS, 'e.g., Windows, Linux')}
                {renderTagInput('Programming Skills', programmingSkills, setProgrammingSkills, 'e.g., Python, JavaScript')}
                {renderTagInput('Web Designing', webDesigning, setWebDesigning, 'e.g., HTML, CSS')}
                {renderTagInput('Software Skills', softwareSkills, setSoftwareSkills, 'e.g., Photoshop, MS Office')}

                <div className="text-center font-bold text-xl mb-4 mt-8">Courses Undertaken</div>
                {renderTagInput('Core Courses', coreCourses, setCoreCourses, 'e.g., Data Structures, Algorithms')}
                {renderTagInput('Depth Courses', depthCourses, setDepthCourses, 'e.g., Machine Learning, Artificial Intelligence')}

                <div className="flex justify-between mt-2">
                    <div>
                        <button type="submit" className="custom-btn-bg-side px-6 py-2 rounded-md">Save</button>
                    </div>
                    <div>
                        <button className="custom-btn-bg-side px-6 py-2 rounded-md"><Link to={'/resume/positions/' + id}>Next</Link></button>
                    </div>
                </div>
            </form>
        </div>
    );
}
