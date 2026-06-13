import React, { useEffect } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";

function Homepage() {
    const navigate = useNavigate();

    useEffect(() => {

        const isRecovery = window.location.href.includes("type=recovery");

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {

            if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && isRecovery)) {
                console.log("Password reset caught. Sending to update page...");
                navigate("/UpdatePassword");
            } 

            else if (event === "SIGNED_IN" && !isRecovery) {
                console.log("Magic link caught. Sending to details...");
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
