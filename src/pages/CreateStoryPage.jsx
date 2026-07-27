import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/home.css';

function CreateStoryPage({ onCreateStory, currentUser }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        Imgurl: '',
        content: ''
    });

    useEffect(() => {
        // Set today's date as default
        const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        setFormData(prev => ({ ...prev, date: today }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        await onCreateStory({
            title: formData.title.trim(),
            date: formData.date.trim() || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            Imgurl: formData.Imgurl.trim() || '',
            content: formData.content.trim() || 'A new story created by the user.'
        });

        navigate('/');
    };

    return (
        <div className="home">
            <h1>Create a New Story</h1>
            <form className="create-story-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Story title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Search for an image or provide a URL"
                        value={formData.Imgurl}
                        onChange={(e) => setFormData({ ...formData, Imgurl: e.target.value })}
                    />
                </div>
                <textarea
                    placeholder="Story content"
                    rows="5"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
                <button type="submit" className="create-btn">ADD STORY</button>
            </form>
        </div>
    );
}

export default CreateStoryPage;
