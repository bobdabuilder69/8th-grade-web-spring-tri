import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase"; 
import styles from "../MyNeighborhood/MyNeighborhood.module.css"; 

export default function UpdatePassword() {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Password updated successfully! Redirecting...");
            setTimeout(() => {
                navigate("/myneighborhooddetails");
            }, 1500);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1 className={styles.h1}>Set New Password</h1>
            <form onSubmit={handleUpdate}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={styles.buttonInput}
                />
                <br />
                <button type="submit" disabled={loading} className={styles.button}>
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
            
            <br />
            {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
        </div>
    );
}
