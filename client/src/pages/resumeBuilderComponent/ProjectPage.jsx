import { useEffect, useState } from 'react';
import ResumeNavPage from "../../ResumeNavPage";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProjectPage() {
    const [projects, setProjects] = useState([
        { title: '', description: '', technologies: '', duration: '', link: '' }
    ]);
    const [workExperience, setWorkExperience] = useState([
        { jobTitle: '', company: '', duration: '', description: '' }
    ]);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchPositionDetails = async () => {
            try {
                const response = await axios.get(`/resume/projects/${id}`);
                const { projects, workExperience } = response.data;
                setProjects(projects);
                setWorkExperience(workExperience);
            } catch (error) {
                console.error('Error fetching position details:', error);
            }
        };

        fetchPositionDetails();
    }, [id]);

    // Handle changes for projects
    const handleProjectChange = (index, event) => {
        const { name, value } = event.target;
        const newProjects = [...projects];
        newProjects[index][name] = value;
        setProjects(newProjects);
    };

    const addProject = () => {
        setProjects([...projects, { title: '', description: '', technologies: '', duration: '', link: '' }]);
    };

    const removeProject = (index) => {
        const newProjects = projects.filter((_, i) => i !== index);
        setProjects(newProjects);
    };

    // Handle changes for work experience
    const handleWorkExperienceChange = (index, event) => {
        const { name, value } = event.target;
        const newWorkExperience = [...workExperience];
        newWorkExperience[index][name] = value;
        setWorkExperience(newWorkExperience);
    };

    const addWorkExperience = () => {
        setWorkExperience([...workExperience, { jobTitle: '', company: '', duration: '', description: '' }]);
    };

    const removeWorkExperience = (index) => {
        const newWorkExperience = workExperience.filter((_, i) => i !== index);
        setWorkExperience(newWorkExperience);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            projects,
            workExperience,
        };
        console.log('Form data:', formData);
        try {
            const response = await axios.post(`/resume/projects/${id}`, formData);
            console.log('Server response:', response.data);
            // Optionally navigate to another page or provide user feedback
        } catch (error) {
            console.error('Error sending data to the server:', error);
            // Optionally provide user feedback on error
        }
    };

    return (
        <div className="bg-black min-h-screen text-white p-4">
            <ResumeNavPage />
            <form
                className="flex flex-col gap-4 lg:px-[200px] md:px-[100px] mt-4"
                onSubmit={handleSubmit}
            >
                <div className="text-center font-bold text-xl mb-4">Projects</div>
                {projects.map((project, index) => (
                    <div key={index} className="flex flex-col bg-white rounded-md text-black p-2">
                        <div className="text-center font-bold">Project {index + 1}</div>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={project.title}
                            onChange={(e) => handleProjectChange(index, e)}
                            placeholder="e.g. Project Title"
                        />
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={project.description}
                            onChange={(e) => handleProjectChange(index, e)}
                            placeholder="e.g. Description-Point1/Point2/Point3..."
                        />
                        <label>Technologies:</label>
                        <input
                            type="text"
                            name="technologies"
                            value={project.technologies}
                            onChange={(e) => handleProjectChange(index, e)}
                            placeholder="e.g. React, Node.js"
                        />
                        <label>Duration:</label>
                        <input
                            type="text"
                            name="duration"
                            value={project.duration}
                            onChange={(e) => handleProjectChange(index, e)}
                            placeholder="e.g. Jan 2021 - May 2021"
                        />
                        <label>Link:</label>
                        <input
                            type="text"
                            name="link"
                            value={project.link}
                            onChange={(e) => handleProjectChange(index, e)}
                            placeholder="e.g. https://github.com/user/project"
                        />
                        <button
                            type="button"
                            onClick={() => removeProject(index)}
                            className="bg-red-500 text-white p-2 mt-2 rounded"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addProject}
                    className="bg-green-500 text-white p-2 mt-2 rounded flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Project
                </button>

                <div className="text-center font-bold text-xl mb-4 mt-8">Work Experience</div>
                {workExperience.map((work, index) => (
                    <div key={index} className="flex flex-col bg-white rounded-md text-black p-2">
                        <div className="text-center font-bold">Work Experience {index + 1}</div>
                        <label>Job Title:</label>
                        <input
                            type="text"
                            name="jobTitle"
                            value={work.jobTitle}
                            onChange={(e) => handleWorkExperienceChange(index, e)}
                            placeholder="e.g. Software Engineer"
                        />
                        <label>Company:</label>
                        <input
                            type="text"
                            name="company"
                            value={work.company}
                            onChange={(e) => handleWorkExperienceChange(index, e)}
                            placeholder="e.g. Tech Corp"
                        />
                        <label>Duration:</label>
                        <input
                            type="text"
                            name="duration"
                            value={work.duration}
                            onChange={(e) => handleWorkExperienceChange(index, e)}
                            placeholder="e.g. Jan 2020 - Dec 2021"
                        />
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={work.description}
                            onChange={(e) => handleWorkExperienceChange(index, e)}
                            placeholder="e.g. Developed web applications"
                        />
                        <button
                            type="button"
                            onClick={() => removeWorkExperience(index)}
                            className="bg-red-500 text-white p-2 mt-2 rounded"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addWorkExperience}
                    className="bg-green-500 text-white p-2 mt-2 rounded flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Work Experience
                </button>

                <div className="flex justify-between mt-2">
                    <button
                        type="submit"
                        className="custom-btn-bg-side px-6 py-2 rounded-md"
                    >
                        Save
                    </button>
                    <Link to={'/resume/platforms/' + id} className="custom-btn-bg-side px-6 py-2 rounded-md">
                        Next
                    </Link>
                </div>
            </form>
        </div>
    );
}
