import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    return (
        <button
            style={{
                backgroundColor: "#a08e76",
                right: "3.5rem",
                top: "20px",
                position: "absolute",
                boxShadow: "1px 1px 8px rgba(0, 0, 0, 0.25)",
                color: "#fff",
                border: "none",
                padding: "10px",
                width: "100px",
            }}
            onClick={handleLogout}
        >
            Log Out
        </button>
    );
}
