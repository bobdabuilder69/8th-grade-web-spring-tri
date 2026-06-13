import React, { useEffect } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase"; 

function Homepage() {

    const navigate = useNavigate();


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
