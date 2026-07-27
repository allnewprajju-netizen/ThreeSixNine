// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useState } from "react";
// import "../css/home.css";

// function StoryDetail({ stories = [], currentUser, isAdmin, isCreator, onDeleteStory, onUpdateStory }) {
//     const { storyId } = useParams();
//     const navigate = useNavigate();
//     const [isEditing, setIsEditing] = useState(false);
//     const [editData, setEditData] = useState({});
//     const [imageSrc, setImageSrc] = useState('');

//     const story = stories.find((item) => String(item.id) === String(storyId));

//     const handleImageError = () => {
//         setImageSrc('/default.png');
//     };

//     if (!imageSrc && story) {
//         setImageSrc(story.Imgurl || '/default.png');
//     }

//     if (!story) {
//         return (
//             <div className="story-detail">
//                 <Link className="back-link" to="/">← Back to home</Link>
//                 <h2>Story not found.</h2>
//             </div>
//         );
//     }

//     const canEdit = currentUser && (isCreator(story.creatorId) || isAdmin);

//     const handleEdit = () => {
//         setEditData({ title: story.title, content: story.content, Imgurl: story.Imgurl, date: story.date });
//         setIsEditing(true);
//     };

//     const handleSaveEdit = async () => {
//         await onUpdateStory(story.id, editData);
//         setIsEditing(false);
//     };

//     const handleDelete = async () => {
//         if (confirm('Are you sure you want to delete this story?')) {
//             await onDeleteStory(story.id);
//             navigate('/');
//         }
//     };

//     if (isEditing) {
//         return (
//             <div className="story-detail">
//                 <Link className="back-link" to="/">← Back to home</Link>
//                 <form className="create-story-form">
//                     <h2>Edit Story</h2>
//                     <div className="form-grid">
//                         <input
//                             type="text"
//                             placeholder="Story title"
//                             value={editData.title}
//                             onChange={(e) => setEditData({ ...editData, title: e.target.value })}
//                         />
//                         <input
//                             type="text"
//                             placeholder="Date"
//                             value={editData.date}
//                             onChange={(e) => setEditData({ ...editData, date: e.target.value })}
//                         />
//                         <input
//                             type="text"
//                             placeholder="Image URL"
//                             value={editData.Imgurl}
//                             onChange={(e) => setEditData({ ...editData, Imgurl: e.target.value })}
//                         />
//                     </div>
//                     <textarea
//                         placeholder="Story content"
//                         rows="5"
//                         value={editData.content}
//                         onChange={(e) => setEditData({ ...editData, content: e.target.value })}
//                     />
//                     <div className="edit-actions">
//                         <button type="button" className="create-btn" onClick={handleSaveEdit}>Save</button>
//                         <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
//                     </div>
//                 </form>
//             </div>
//         );
//     }

//     return (
//         <div className="story-detail">
//             <Link className="back-link" to="/">← Back to home</Link>
//             <div className="story-detail-card">
//                 <img src={imageSrc} alt={story.title} onError={handleImageError} />
//                 <div className="story-detail-content">
//                     <h1 className="title">{story.title}</h1>
//                     <div className="story-meta-info">
//                         <p className="story-date">{story.date}</p>
//                         {story.creatorName && <p className="story-creator">by {story.creatorName}</p>}
//                     </div>
//                     <p className="content">{story.content}</p>
//                     {canEdit && (
//                         <div className="story-actions">
//                             <button className="edit-btn" onClick={handleEdit}>Edit</button>
//                             <button className="delete-btn" onClick={handleDelete}>Delete</button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default StoryDetail;
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/home.css";

function StoryDetail({
    stories = [],
    currentUser,
    isAdmin,
    isCreator,
    onDeleteStory,
    onUpdateStory
}) {
    const { storyId } = useParams();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [imageSrc, setImageSrc] = useState('/default.png');

    const story = stories.find(
        (item) => String(item.id) === String(storyId)
    );

    // Set the story image when the story is found
    useEffect(() => {
        if (story) {
            setImageSrc(story.Imgurl || '/default.png');
        }
    }, [story]);

    const handleImageError = () => {
        setImageSrc('/default.png');
    };

    if (!story) {
        return (
            <div className="story-detail">
                <Link className="back-link" to="/">
                    ← Back to home
                </Link>

                <h2>Story not found.</h2>
            </div>
        );
    }

    const canEdit =
        currentUser &&
        (isCreator(story.creatorId) || isAdmin);

    const handleEdit = () => {
        setEditData({
            title: story.title,
            content: story.content,
            Imgurl: story.Imgurl,
            date: story.date
        });

        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        await onUpdateStory(story.id, editData);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this story?")) {
            await onDeleteStory(story.id);
            navigate("/");
        }
    };

    if (isEditing) {
        return (
            <div className="story-detail">
                <Link className="back-link" to="/">
                    ← Back to home
                </Link>

                <form className="create-story-form">
                    <h2>Edit Story</h2>

                    <div className="form-grid">
                        <input
                            type="text"
                            placeholder="Story title"
                            value={editData.title || ""}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    title: e.target.value
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Date"
                            value={editData.date || ""}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    date: e.target.value
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Image URL"
                            value={editData.Imgurl || ""}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    Imgurl: e.target.value
                                })
                            }
                        />
                    </div>

                    <textarea
                        placeholder="Story content"
                        rows="5"
                        value={editData.content || ""}
                        onChange={(e) =>
                            setEditData({
                                ...editData,
                                content: e.target.value
                            })
                        }
                    />

                    <div className="edit-actions">
                        <button
                            type="button"
                            className="create-btn"
                            onClick={handleSaveEdit}
                        >
                            Save
                        </button>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="story-detail">
            <Link className="back-link" to="/">
                ← Back to home
            </Link>

            <div className="story-detail-card">
                <img
                    src={imageSrc}
                    alt={story.title}
                    onError={handleImageError}
                />

                <div className="story-detail-content">
                    <h1 className="title">
                        {story.title}
                    </h1>

                    <div className="story-meta-info">
                        <p className="story-date">
                            {story.date}
                        </p>

                        {story.creatorName && (
                            <p className="story-creator">
                                by {story.creatorName}
                            </p>
                        )}
                    </div>

                    <p className="content">
                        {story.content}
                    </p>

                    {canEdit && (
                        <div className="story-actions">
                            <button
                                className="edit-btn"
                                onClick={handleEdit}
                            >
                                Edit
                            </button>

                            <button
                                className="delete-btn"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StoryDetail;