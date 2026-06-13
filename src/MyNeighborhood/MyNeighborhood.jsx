import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BackButton from "../Functions/BackButton";
import styles from "./MyNeighborhood.module.css";
import { loginUser } from "../services/userService";
import supabase from "../services/supabase";

export default function MyNeighborhood() {
    const navigate = useNavigate();
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const redirectUrl = `${window.location.origin}/8th-grade-web-spring-tri/final_project/`;

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") {
                console.log("Magic link or reset caught! Redirecting...");
                navigate("/myneighborhooddetails");
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleEmailChange = (e) => setEmailInput(e.target.value);
    const handlePasswordChange = (e) => setPasswordInput(e.target.value);

    // --- 1. Standard Password Login ---
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

    const handleMagicLink = async () => {
        setError("");
        setMessage("");
        
        const normalizedEmail = emailInput.trim().toLowerCase();
        if (!normalizedEmail) {
            setError("Please enter your email first to send a Magic Link.");
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email: normalizedEmail,
            options: {
                emailRedirectTo: redirectUrl
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("🪄 Magic link sent! Check your email to log in.");
        }
        setLoading(false);
    };

    const handleForgotPassword = async () => {
        setError("");
        setMessage("");
        
        const normalizedEmail = emailInput.trim().toLowerCase();
        if (!normalizedEmail) {
            setError("Please enter your email first to reset your password.");
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
            redirectTo: redirectUrl
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("✉️ Password reset instructions sent to your email.");
        }
        setLoading(false);
    };

    return (
        <div>
            <BackButton />
            <h1 className={styles.h1}>View My Neighborhood</h1>
            <button onClick={() => navigate("/signup")}>
                Please register here
            </button>
            
            <h2>Or Enter Email and Password Below:</h2>
            
            {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="emailInput"
                    name="emailInput"
                    value={emailInput}
                    onChange={handleEmailChange}
                    className={styles.buttonInput}
                    placeholder="Email Address"
                    disabled={loading}
                />
                <br></br>
                <input
                    type="password"
                    id="passwordInput"
                    name="passwordInput"
                    value={passwordInput}
                    onChange={handlePasswordChange}
                    className={styles.buttonInput}
                    placeholder="Password"
                    disabled={loading}
                />
                <br></br>

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "Processing..." : "Login"}
                </button>
            </form>

            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <p style={{ margin: "5px 0", fontStyle: "italic" }}>- or -</p>
                
                <button 
                    onClick={handleMagicLink} 
                    disabled={loading}
                    style={{ background: "transparent", border: "1px solid #ccc", padding: "5px 15px", cursor: "pointer" }}
                >
                    Send Magic Link
                </button>
                
                <button 
                    onClick={handleForgotPassword} 
                    disabled={loading}
                    style={{ background: "transparent", border: "none", textDecoration: "underline", color: "blue", cursor: "pointer", fontSize: "0.9em" }}
                >
                    Forgot Password?
                </button>
            </div>
            
            {isAnimating && <div className={styles.sliderR}></div>}
        </div>
    );
}
