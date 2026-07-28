import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/storycard.css";

function StoryCard({
    story,
    onAddFavorite,
    onUpvote,
    currentUser
}) {


    const [imageError, setImageError] = useState(false);
    const [imageUrl, setImageUrl] = useState("/default.png");



    useEffect(() => {

        setImageError(false);


        if (story?.Imgurl) {

            setImageUrl(
                `${story.Imgurl}?t=${Date.now()}`
            );

        } else {

            setImageUrl("/default.png");

        }


    }, [story?.Imgurl]);




    if (!story || !story.title) {
        return null;
    }




    const hasUpvoted =
        currentUser &&
        story.upvoters?.includes(currentUser.uid);




    const readTime =
        story.readTime ||
        `${Math.max(
            1,
            Math.ceil(
                (story.content?.split(/\s+/).length || 0) / 200
            )
        )} min`;




    const category =
        story.category || " Unknown ";




    const intensity =
        story.intensity || "Medium";





    function handleImageError() {

        setImageError(true);

        setImageUrl("/default.png");

    }





    function handleUpvote(e) {

        e.preventDefault();

        if (onUpvote) {

            onUpvote(story.id);

        }

    }





    function handleFavorite(e) {

        e.preventDefault();

        if (onAddFavorite) {

            onAddFavorite(story);

        }

    }





    return (

        <div className="story-card">


            <div className="story-poster">


                <img
                    key={imageUrl}
                    src={
                        imageError
                            ? "/default.png"
                            : imageUrl
                    }
                    alt={story.title}
                    onError={handleImageError}
                />



                <div className="story-overlay">


                    <Link
                        className="read-btn"
                        to={`/story/${story.id}`}
                    >

                        READ REPORT

                    </Link>


                </div>


            </div>





            <div className="story-info">


                <div className="story-top">


                    <span className={`category-badge ${category.toLowerCase().replace(/\s/g, "-")}`}>

                        {category.toUpperCase()}

                    </span>



                    <span className={`intensity-badge intensity-${intensity.toLowerCase()}`}>

                        {intensity.toUpperCase()}

                    </span>


                </div>





                <h3>
                    {story.title}
                </h3>





                <p className="creator-name">

                    Submitted by {story.creatorName || " Unknown "}

                </p>





                <p className="story-meta">

                    {story.date}

                    <span className="dot"></span>

                    {readTime} read

                </p>





                <div className="archive-rating">


                    <span>
                        Archive Rating
                    </span>



                    <strong>
                        {story.upvotes || 0}
                    </strong>


                </div>





                <div className="card-buttons">


                    <button
                        className={`upvote-btn ${
                            hasUpvoted ? "upvoted" : ""
                        }`}
                        onClick={handleUpvote}
                    >

                        ★

                    </button>





                    <button
                        className="fav-btn"
                        onClick={handleFavorite}
                    >

                        ♡

                    </button>


                </div>


            </div>


        </div>

    );

}


export default StoryCard;