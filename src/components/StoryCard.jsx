import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/storycard.css"

function StoryCard({ story, onAddFavorite, onUpvote, currentUser }) {
    const [imageSrc, setImageSrc] = useState(story?.Imgurl || '/default.png');

    function addFav() {
        if (onAddFavorite) {
            onAddFavorite(story);
        }
    }

    function handleUpvote(e) {
        e.preventDefault();
        if (onUpvote) {
            onUpvote(story.id);
        }
    }

    function handleImageError() {
        setImageSrc('/default.png');
    }

    if (!story || !story.title) {
        return null;
    }

    const hasUpvoted = currentUser && story.upvoters && story.upvoters.includes(currentUser.uid);

    return (
        <div className="story-card">
            <div className="story-poster">
                <img src={imageSrc} alt={story.title} onError={handleImageError} />
                <div className="story-overlay">
                    <Link className="read-btn" to={`/story/${story.id}`}>READ</Link>
                </div>
            </div>
            <div className="story-info">
                <div className="text-group">
                    <h3>{story.title}</h3>
                    <p className="story-meta">{story.date}</p>
                    {story.creatorName && <p className="creator-name">by {story.creatorName}</p>}
                    <div className="upvote-display">⭐ {story.upvotes || 0} upvotes</div>
                </div>
                <div className="card-buttons">
                    <button
                        className={`upvote-btn ${hasUpvoted ? 'upvoted' : ''}`}
                        onClick={handleUpvote}
                        title={currentUser ? (hasUpvoted ? 'Remove upvote' : 'Upvote') : 'Sign in to upvote'}
                    >
                        ⭐
                    </button>
                    <button className="fav-btn" onClick={addFav}>♡</button>
                </div>
            </div>
        </div>
    );
}

export default StoryCard