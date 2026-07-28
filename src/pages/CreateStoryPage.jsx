import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

function CreateStoryPage({ onCreateStory }) {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        title: "",

        date: "",

        Imgurl: "",

        category: "Conspiracy",

        intensity: "Medium",

        readTime: "5 min",

        content: ""

    });

    useEffect(() => {

        const today = new Date().toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

        setFormData(prev => ({
            ...prev,
            date: today
        }));

    }, []);

    function handleChange(e) {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        if (!formData.title.trim()) return;

        await onCreateStory({

            ...formData,

            title: formData.title.trim(),

            Imgurl: formData.Imgurl.trim(),

            content: formData.content.trim()

        });

        navigate("/");

    }

    return (

        <div className="home">

            <form
                className="create-story-form"
                onSubmit={handleSubmit}
            >

                <h2>New Archive Entry</h2>

                <div className="form-grid">

                    <input
                        name="title"
                        placeholder="Report Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="date"
                        placeholder="Date"
                        value={formData.date}
                        onChange={handleChange}
                    />

                    <input
                        name="Imgurl"
                        placeholder="Cover Image URL"
                        value={formData.Imgurl}
                        onChange={handleChange}
                    />

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option>Conspiracy</option>
                        <option>Theory</option>
                        <option>Mystery</option>
                        <option>Paranormal</option>
                        <option>Historical</option>
                        <option>Government</option>
                        <option>Science</option>
                        <option>Psychology</option>
                    </select>

                    <select
                        name="intensity"
                        value={formData.intensity}
                        onChange={handleChange}
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Extreme</option>
                    </select>

                    <input
                        name="readTime"
                        placeholder="Estimated Reading Time"
                        value={formData.readTime}
                        onChange={handleChange}
                    />

                </div>

                <textarea
                    name="content"
                    placeholder="Write your report..."
                    rows="14"
                    value={formData.content}
                    onChange={handleChange}
                />

                <div className="edit-actions">

                    <button
                        className="cancel-btn"
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </button>

                    <button
                        className="create-btn"
                        type="submit"
                    >
                        Publish Report
                    </button>

                </div>

            </form>

        </div>

    );

}

export default CreateStoryPage;