import { useState, useEffect } from 'react';
import ResumeNavPage from "../../ResumeNavPage";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function PositionPage() {
    const [positions, setPositions] = useState([
        { position: '', duration: '', description: '' }
    ]);
    const [activities, setActivities] = useState([
        { event: '', duration: '', description: '' }
    ]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchPositionDetails = async () => {
            try {
                const response = await axios.get(`/resume/positions/${id}`);
                const { positions, activities } = response.data;
                setPositions(positions);
                setActivities(activities);
            } catch (error) {
                console.error('Error fetching position details:', error);
            }
        };

        fetchPositionDetails();
    }, [id]);

    const handlePositionChange = (index, event) => {
        const { name, value } = event.target;
        const newPositions = [...positions];
        newPositions[index][name] = value;
        setPositions(newPositions);
    };

    const handleActivityChange = (index, event) => {
        const { name, value } = event.target;
        const newActivities = [...activities];
        newActivities[index][name] = value;
        setActivities(newActivities);
    };

    const addPosition = () => {
        setPositions([...positions, { position: '', duration: '', description: '' }]);
    };

    const addActivity = () => {
        setActivities([...activities, { event: '', duration: '', description: '' }]);
    };

    const removePosition = (index) => {
        const newPositions = positions.filter((_, i) => i !== index);
        setPositions(newPositions);
    };

    const removeActivity = (index) => {
        const newActivities = activities.filter((_, i) => i !== index);
        setActivities(newActivities);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            positions,
            activities,
        };
        console.log('Form data:', formData);
        try {
            const response = await axios.post(`/resume/positions/${id}`, formData);
            console.log('Server response:', response.data);
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
                <div className="text-center font-bold text-xl">Positions of Responsibility</div>
                {positions.map((pos, index) => (
                    <div key={index} className="flex flex-col bg-white rounded-md text-black p-2 mb-4">
                        <div className="text-center font-bold">Position {index + 1}</div>
                        <label>Position:</label>
                        <input
                            type="text"
                            name="position"
                            value={pos.position}
                            onChange={(e) => handlePositionChange(index, e)}
                            placeholder="e.g. Team Lead"
                        />
                        <label>Duration:</label>
                        <input
                            type="text"
                            name="duration"
                            value={pos.duration}
                            onChange={(e) => handlePositionChange(index, e)}
                            placeholder="e.g. Jan 2021 - Dec 2021"
                        />
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={pos.description}
                            onChange={(e) => handlePositionChange(index, e)}
                            placeholder="e.g. Led a team of 5 developers..."
                        />
                        <button
                            type="button"
                            onClick={() => removePosition(index)}
                            className="bg-red-500 text-white p-2 mt-2 rounded"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addPosition}
                    className="bg-green-500 text-white p-2 mt-2 rounded flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Position
                </button>

                <div className="text-center font-bold text-xl mt-8">Extracurricular Activities</div>
                {activities.map((activity, index) => (
                    <div key={index} className="flex flex-col bg-white rounded-md text-black p-2 mb-4">
                        <div className="text-center font-bold">Activity {index + 1}</div>
                        <label>Event:</label>
                        <input
                            type="text"
                            name="event"
                            value={activity.event}
                            onChange={(e) => handleActivityChange(index, e)}
                            placeholder="e.g. Hackathon"
                        />
                        <label>Duration:</label>
                        <input
                            type="text"
                            name="duration"
                            value={activity.duration}
                            onChange={(e) => handleActivityChange(index, e)}
                            placeholder="e.g. Jan 2021 - Feb 2021"
                        />
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={activity.description}
                            onChange={(e) => handleActivityChange(index, e)}
                            placeholder="e.g. Participated in a 24-hour hackathon..."
                        />
                        <button
                            type="button"
                            onClick={() => removeActivity(index)}
                            className="bg-red-500 text-white p-2 mt-2 rounded"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addActivity}
                    className="bg-green-500 text-white p-2 mt-2 rounded flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Activity
                </button>
                <div className="flex justify-between mt-2">
                    <button
                        type="submit"
                        className="custom-btn-bg-side px-6 py-2 rounded-md"
                    >
                        Save
                    </button>
                    <Link to={'/resume/' + id} className="custom-btn-bg-side px-6 py-2 rounded-md">
                        Next
                    </Link>
                </div>
            </form>
        </div>
    );
}