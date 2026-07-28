import StoryCard from "../components/StoryCard";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/home.css";

function Home({ stories = [], onAddFavorite, onUpvote, currentUser }) {

    const [searchQuery, setsearchQuery] = useState("");
    const [featuredImageError, setFeaturedImageError] = useState(false);
    const [featuredImage, setFeaturedImage] = useState("/default.png");



    const handleSearch = (e) => {
        e.preventDefault();
    };



    const filteredStories = stories.filter((story) =>
        story &&
        story.title &&
        story.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );



    const sortedByUpvotes = [...filteredStories].sort(
        (a, b) => (b.upvotes || 0) - (a.upvotes || 0)
    );



    const mostUpvoted =
        sortedByUpvotes.length > 0
            ? sortedByUpvotes[0]
            : null;



    const mostUpvotedHasVotes =
        mostUpvoted &&
        mostUpvoted.upvotes > 0;



    const remainingStories =
        mostUpvotedHasVotes
            ? sortedByUpvotes.slice(1)
            : sortedByUpvotes;



    useEffect(() => {

        setFeaturedImageError(false);


        if (mostUpvoted?.Imgurl) {

            setFeaturedImage(
                `${mostUpvoted.Imgurl}?t=${Date.now()}`
            );

        } else {

            setFeaturedImage("/default.png");

        }


    }, [mostUpvoted?.Imgurl]);




    return (
        <div className="home">


            <h1>
                SEARCH CONSPIRACY OR NARRATE A STORY
            </h1>



            <form
                onSubmit={handleSearch}
                className="search-form"
            >

                <input
                    type="text"
                    placeholder="Search for a story..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) =>
                        setsearchQuery(e.target.value)
                    }
                />


                <button type="submit">
                    SEARCH
                </button>

            </form>




            {mostUpvotedHasVotes && mostUpvoted && (

                <div className="featured-section">


                    <div className="featured-label">
                        MOST VIEWED
                    </div>



                    <div className="featured-card">


                        <div className="featured-image-wrapper">


                            <img
                                key={featuredImage}
                                src={
                                    featuredImageError
                                        ? "/default.png"
                                        : featuredImage
                                }
                                alt={mostUpvoted.title}
                                onError={() =>
                                    setFeaturedImageError(true)
                                }
                                className="featured-image"
                            />



                            <div className="featured-upvote-badge">

                                {mostUpvoted.upvotes} ⬆ UPVOTES

                            </div>


                        </div>





                        <div className="featured-content">


                            <h2>
                                {mostUpvoted.title}
                            </h2>



                            <p className="featured-creator">

                                by {mostUpvoted.creatorName || "Anonymous"}

                            </p>




                            <div className="story-tags">


                                <span className="story-tag">

                                    {mostUpvoted.storyType || "Conspiracy"}

                                </span>



                                <span className={`story-intensity intensity-${(mostUpvoted.intensity || "Low").toLowerCase()}`}>

                                    {mostUpvoted.intensity || "Low"}

                                </span>



                                <span className={`story-status status-${(mostUpvoted.status || "Unverified").toLowerCase().replace(" ", "-")}`}>

                                    {mostUpvoted.status || "Unverified"}

                                </span>


                            </div>





                            <p className="featured-description">

                                {mostUpvoted.content &&
                                    mostUpvoted.content
                                        .split(" ")
                                        .slice(0, 15)
                                        .join(" ")
                                }
                                ...

                            </p>





                            <div className="featured-actions">


                                <button
                                    className="featured-upvote-btn"
                                    onClick={() =>
                                        onUpvote(
                                            mostUpvoted.id
                                        )
                                    }
                                >

                                    ⬆ Upvote (
                                    {mostUpvoted.upvotes}
                                    )

                                </button>





                                <Link
                                    className="featured-read-btn"
                                    to={`/story/${mostUpvoted.id}`}
                                >

                                    Read Full Story

                                </Link>



                            </div>



                        </div>



                    </div>



                </div>

            )}






            <div className="story-grid">


                {remainingStories.length > 0 ? (


                    remainingStories.map((story) => (


                        <StoryCard

                            story={story}

                            key={story.id}

                            onAddFavorite={onAddFavorite}

                            onUpvote={onUpvote}

                            currentUser={currentUser}

                        />


                    ))


                ) : searchQuery ? (


                    <p className="empty-state">

                        No stories match your search.

                    </p>


                ) : (


                    <p className="empty-state">

                        No stories yet.

                    </p>


                )}



            </div>



        </div>
    );

}


export default Home;