import { Link } from "react-router-dom"
import { signInWithGoogle, signOutUser, seedDummyStories } from "../firebase"
import "../css/navbar.css"
import logo from "../assets/logo.png"

const ADMIN_EMAIL = 'prajju.c18@gmail.com';

function Navbar({ currentUser }) {
    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Sign-in error:", error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOutUser();
        } catch (error) {
            console.error("Sign-out error:", error);
        }
    };

    const handleSeedDummyStories = async () => {
        if (currentUser) {
            try {
                const stories = await seedDummyStories(currentUser.uid, currentUser.displayName);
                alert(`Successfully added ${stories.length} dummy stories!`);
                window.location.reload();
            } catch (error) {
                console.error("Error seeding stories:", error);
                alert("Error adding dummy stories");
            }
        }
    };

    const isAdmin = currentUser?.email === ADMIN_EMAIL;

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <img src={logo} alt="" srcset="" />
                <ul className="nav-links">
                    <li><Link to="/">HOME</Link></li>
                    {currentUser && <li><Link to="/create">CREATE</Link></li>}
                    <li><Link to="/fav">FAVOURITES</Link></li>
                </ul>
            </div>
            <div className="nav-auth">
                {currentUser ? (
                    <>
                        <span className="user-email">{currentUser.email}</span>
                        {isAdmin && (
                            <button onClick={handleSeedDummyStories} className="admin-btn">Add Demo Stories</button>
                        )}
                        <button onClick={handleSignOut} className="auth-btn">Sign Out</button>
                    </>
                ) : (
                    <button onClick={handleGoogleSignIn} className="auth-btn">Sign In with Google</button>
                )}
            </div>
        </nav>
    )
}

export default Navbar