import React from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

function Homepage() {
    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") {
                console.log("Magic link or reset caught! Redirecting...");
                navigate("/myneighborhooddetails");
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleEmailChange = (e) => setEmailInput(e.target.value);
    const handlePasswordChange = (e) => setPasswordInput(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        const normalizedEmail = emailInput.trim().toLowerCase();

        if (!normalizedEmail || !passwordInput) {
            setError("Please enter both email and password.");
            setLoading(false);
            return;
        }

        const loggedInUser = await loginUser(normalizedEmail, passwordInput);

        if (!loggedInUser) {
            setError("Incorrect email or password.");
            setLoading(false);
            return;
        }

        setIsAnimating(true);
        setTimeout(() => {
            navigate("/myneighborhooddetails");
        }, 500);
    };

    const navigate = useNavigate();
    return (
        <div>
            <h1>NeighborLink</h1>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
            <br />
            <button onClick={() => navigate("/myneighborhood")}>
                Browse My Neighborhood
            </button>
        </div>
    );
}

export default Homepage;
