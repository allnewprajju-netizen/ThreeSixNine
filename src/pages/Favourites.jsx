import { Link } from "react-router-dom";
import "../css/home.css";

function Favourites({ favorites = [], onRemoveFavorite }) {
    return (
        <div className="home">
            <h1>Your Favourite Stories</h1>
            {favorites.length === 0 ? (
                <p>No favourites added yet.</p>
            ) : (
                <div className="story-grid">
                    {favorites.map((story) => (
                        <div key={story.id} className="story-card">
                            <div className="story-poster">
                                <img src={story.Imgurl} alt={story.title} />
                            </div>
                            <div className="story-info">
                                <div className="text-group">
                                    <h3>{story.title}</h3>
                                    <p>{story.date}</p>
                                </div>
                            </div>
                            <div className="card-actions">
                                <Link className="read-link" to={`/story/${story.id}`}>Read</Link>
                                <button className="fav-btn" onClick={() => onRemoveFavorite(story.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Favourites