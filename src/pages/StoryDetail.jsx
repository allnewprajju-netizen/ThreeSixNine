import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/home.css";

function StoryDetail({
    stories = [],
    currentUser,
    isAdmin,
    isCreator,
    onDeleteStory,
    onUpdateStory,
    onUpvote,
    onAddFavorite
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

    const readingTime = Math.max(
        1,
        Math.ceil(story.content.split(" ").length / 200)
    );

    const hasUpvoted =
        currentUser &&
        story.upvoters?.includes(currentUser.uid);

    const randomViews =
        (String(story.id).length * 173) + 1200;

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

    <div className="story-hero">

        <img
            src={imageSrc}
            alt={story.title}
            onError={handleImageError}
        />

        <div className="story-hero-overlay">

            <div className="story-category">
                CONSPIRACY ARCHIVE
            </div>

            <h1 className="title">
                {story.title}
            </h1>

            <div className="story-meta-info">

                <span>
                    👁 {randomViews.toLocaleString()} Views
                </span>

                <span>
                    ⏱ {readingTime} min read
                </span>

                <span>
                    📅 {story.date}
                </span>

                {story.creatorName && (
                    <span>
                        ✍ {story.creatorName}
                    </span>
                )}

            </div>

        </div>

    </div>

    <div className="story-detail-content">

        <div className="story-toolbar">

            <button
                className={`toolbar-btn ${
                    hasUpvoted ? "active" : ""
                }`}
                onClick={() => onUpvote(story.id)}
            >
                ▲ {story.upvotes || 0}
            </button>

            <button
                className="toolbar-btn"
                onClick={() => onAddFavorite(story)}
            >
                ❤ Save
            </button>

            <button
                className="toolbar-btn"
                onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                }
            >
                🔗 Share
            </button>

        </div>

        <div className="story-divider"></div>

        <div className="content">

            {story.content
                .split("\n")
                .map((paragraph, i) => (

                    <p key={i}>
                        {paragraph}
                    </p>

                ))}

        </div>

        {canEdit && (

            <div className="story-actions">

                <button
                    className="edit-btn"
                    onClick={handleEdit}
                >
                    Edit Story
                </button>

                <button
                    className="delete-btn"
                    onClick={handleDelete}
                >
                    Delete Story
                </button>

            </div>

        )}

    </div>

</div>
        </div>
    );
}

export default StoryDetail;