import { useEffect, useState } from 'react';
import './App.css';

import Favourites from './pages/Favourites';
import Home from './pages/Home';
import StoryDetail from './pages/StoryDetail';
import CreateStoryPage from './pages/CreateStoryPage';

import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';

import {
  createStoryInDb,
  fetchStoriesFromDb,
  deleteStoryFromDb,
  updateStoryInDb,
  isFirebaseConfigured,
  observeAuthState
} from './firebase';


const initialStories = [
  {
    id: 1,
    title: "Three Six Nine",
    date: "July 27 2026",

    category: "Conspiracy",

    intensity: "Class III",

    location: "Unknown",

    summary:
        "The mysterious significance of the numbers 3, 6 and 9 throughout history.",

    Imgurl: "...",

    content: "..."
}
];


const ADMIN_EMAIL = 'prajju.c18@gmail.com';


function App() {

  const [stories, setStories] = useState(
    initialStories.map(story => ({
      ...story,
      upvotes: 0,
      upvoters: []
    }))
  );

  const [favorites, setFavorites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);


  /*
   * Load stories from Firebase
   */
  useEffect(() => {

    const loadStories = async () => {

      if (!isFirebaseConfigured) {
        return;
      }

      const remoteStories = await fetchStoriesFromDb();

      if (remoteStories.length > 0) {
        setStories(remoteStories);
      }

    };

    loadStories();

  }, []);


  /*
   * Observe authentication state
   */
  useEffect(() => {

    const unsubscribe = observeAuthState((user) => {
      setCurrentUser(user);
    });

    return () => {

      if (unsubscribe) {
        unsubscribe();
      }

    };

  }, []);


  /*
   * Add a story to favourites
   */
  const addFavorite = (story) => {

    setFavorites((prevFavorites) => {

      const alreadyExists = prevFavorites.some(
        item => item.id === story.id
      );

      if (alreadyExists) {
        return prevFavorites;
      }

      return [
        ...prevFavorites,
        story
      ];

    });

  };


  /*
   * Remove a story from favourites
   */
  const removeFavorite = (storyId) => {

    setFavorites((prevFavorites) =>
      prevFavorites.filter(
        item => item.id !== storyId
      )
    );

  };


  /*
   * Create a new story
   */
  const createStory = async (storyData) => {

const newStory = {

    title: storyData.title,
    
  category: storyData.category,

  intensity: storyData.intensity,

  readTime: storyData.readTime,
    date:
        storyData.date ||
        new Date().toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        ),

    Imgurl: storyData.Imgurl || "/default.png",

    category:
        storyData.category || "Unclassified",

    intensity:
        storyData.intensity || "Class I",

    location:
        storyData.location || "Unknown",

    summary:
        storyData.summary || "",

    content:
        storyData.content ||
        "A new story created by the user.",

    creatorName:
        currentUser?.displayName ||
        "Anonymous"

};


    /*
     * Save to Firebase if possible
     */
    if (isFirebaseConfigured && currentUser) {

      const savedStory = await createStoryInDb(
        newStory,
        currentUser.uid,
        currentUser.displayName
      );

      if (savedStory) {

        setStories((prevStories) => [
          savedStory,
          ...prevStories
        ]);

        return savedStory;

      }

    }


    /*
     * Local fallback
     */
    const fallbackStory = {

      id: Date.now(),

      ...newStory,

      creatorId:
        currentUser?.uid ||
        'local'

    };


    setStories((prevStories) => [
      fallbackStory,
      ...prevStories
    ]);

    return fallbackStory;

  };


  /*
   * Update a story
   */
  const updateStory = async (storyId, storyData) => {

    if (isFirebaseConfigured) {

      await updateStoryInDb(
        storyId,
        storyData
      );

    }


    setStories((prevStories) =>

      prevStories.map((story) =>

        String(story.id) === String(storyId)

          ? {
              ...story,
              ...storyData
            }

          : story

      )

    );

  };


  /*
   * Delete a story
   */
  const deleteStory = async (storyId) => {

    if (isFirebaseConfigured) {

      await deleteStoryFromDb(storyId);

    }


    setStories((prevStories) =>

      prevStories.filter(
        story =>
          String(story.id) !== String(storyId)
      )

    );

  };


  /*
   * Upvote or remove an upvote
   */
  const upvoteStory = async (storyId) => {

    if (!currentUser) {

      alert(
        'Please sign in to upvote stories'
      );

      return;

    }


    setStories((prevStories) =>

      prevStories.map((story) => {

        if (
          String(story.id) === String(storyId)
        ) {

          const upvoters =
            story.upvoters || [];

          const hasUpvoted =
            upvoters.includes(
              currentUser.uid
            );


          let newUpvotes;
          let newUpvoters;


          if (hasUpvoted) {

            newUpvotes =
              Math.max(
                0,
                (story.upvotes || 0) - 1
              );

            newUpvoters =
              upvoters.filter(
                id =>
                  id !== currentUser.uid
              );

          } else {

            newUpvotes =
              (story.upvotes || 0) + 1;

            newUpvoters = [
              ...upvoters,
              currentUser.uid
            ];

          }


          /*
           * Save upvotes to Firebase
           */
          if (isFirebaseConfigured) {

            import('./firebase')
              .then(({ updateStoryUpvotes }) => {

                updateStoryUpvotes(
                  storyId,
                  newUpvotes,
                  newUpvoters
                )
                  .catch(err =>
                    console.error(
                      'Error updating upvotes:',
                      err
                    )
                  );

              });

          }


          return {

            ...story,

            upvotes:
              newUpvotes,

            upvoters:
              newUpvoters

          };

        }


        return story;

      })

    );

  };


  /*
   * User permissions
   */
  const isAdmin =
    currentUser &&
    currentUser.email === ADMIN_EMAIL;


  const isCreator = (creatorId) =>
    currentUser &&
    currentUser.uid === creatorId;


  return (

    <div>

      <Navbar
        currentUser={currentUser}
      />


      <main className="main-content">

        <Routes>

          <Route
            path="/"
            element={
              <Home
                stories={stories}
                onAddFavorite={addFavorite}
                onUpvote={upvoteStory}
                currentUser={currentUser}
              />
            }
          />


          <Route
            path="/create"
            element={
              <CreateStoryPage
                onCreateStory={createStory}
                currentUser={currentUser}
              />
            }
          />


          <Route
            path="/fav"
            element={
              <Favourites
                favorites={favorites}
                onRemoveFavorite={removeFavorite}
              />
            }
          />


          <Route
    path="/story/:storyId"
    element={
        <StoryDetail
            stories={stories}
            currentUser={currentUser}
            isAdmin={isAdmin}
            isCreator={isCreator}
            onDeleteStory={deleteStory}
            onUpdateStory={updateStory}
            onUpvote={upvoteStory}
            onAddFavorite={addFavorite}
        />
    }
>

</Route>

</Routes>

      </main>

    </div>

  );

}


export default App;