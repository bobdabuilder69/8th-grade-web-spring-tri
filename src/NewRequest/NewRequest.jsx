import { useState, useEffect } from "react";
import "./NewRequest.css";
import BackButton from "../Functions/BackButton";
import PhoneOrEmailSelector from "./PhoneOrEmailSelector.jsx";
import supabase from "../services/supabase";
import { getUserByEmail } from "../services/userService.js";
import { useNavigate } from "react-router-dom";

export default function NewRequest() {
    const [requestTitle, setRequestTitle] = useState("");
    const [requestDescription, setRequestDescription] = useState("");
    const [includeEmailOrNumber, setIncludeEmailOrNumber] = useState("none");
    const [user, setUser] = useState(null);
    const [timeEstimate, setTimeEstimate] = useState(10);
    const [requestDateTime, setRequestDateTime] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        async function loadUser() {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const email = session.user.email;
            const user = await getUserByEmail(email);
            console.log("[NewRequest] User loaded:", user);
            setUser(user);
        }
        loadUser();
    }, []);
    useEffect(() => {
        if (success) {
            alert("Request submitted successfully!");
            navigate("/myneighborhooddetails");
        }
    }, [success]);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setSubmitting(true);

        try {
            const { error } = await supabase
                .from("helpNeededLocations")
                .insert([
                    {
                        title: requestTitle,
                        description: requestDescription,
                        contactPreference: includeEmailOrNumber,
                        timeEstimate: Number(timeEstimate),
                        requestedTime: requestDateTime || null,
                        auth_user_id: user?.auth_user_id,
                        address: user?.address ?? null,
                        username: user?.username ?? null,
                        geolocation: user?.geolocation ?? null,
                        phone: user?.prettyPhone ?? null,
                        email: user?.email ?? null,
                    },
                ]);

            if (error) throw error;

            setSuccess(true);
            setRequestTitle("");
            setRequestDescription("");
            setIncludeEmailOrNumber("none");
            setTimeEstimate(10);
            setRequestDateTime("");
        } catch (err) {
            console.error("[NewRequest] Submit error:", err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>
            <BackButton />
            <h1 id="newRequestTitle">New Request</h1>
            <div
                id="newRequestContainer"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div id="newRequestColumnContainer">
                    <form className="newRequestForm" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="What am I Requesting?"
                            id="newRequestTitleInput"
                            value={requestTitle}
                            onChange={(e) => setRequestTitle(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Add more details about your request here (incentive, reason, materials, etc.)..."
                            id="newRequestDescriptionInput"
                            rows="5"
                            value={requestDescription}
                            onChange={(e) =>
                                setRequestDescription(e.target.value)
                            }
                            required
                        />
                        <input
                            type="datetime-local"
                            id="requestDateTime"
                            value={requestDateTime}
                            onChange={(e) => setRequestDateTime(e.target.value)}
                            required
                        />
                        <input
                            type="range"
                            id="timeEstimate"
                            min="10"
                            max="180"
                            value={timeEstimate}
                            onChange={(e) => setTimeEstimate(e.target.value)}
                            required
                        />
                        <label htmlFor="timeEstimate">
                            Time Estimate ({timeEstimate} minutes)
                        </label>

                        <h3>Include Phone/Email?</h3>
                        <PhoneOrEmailSelector
                            includeEmailOrNumber={includeEmailOrNumber}
                            setIncludeEmailOrNumber={setIncludeEmailOrNumber}
                            required
                        />

                        {error && <p style={{ color: "red" }}>{error}</p>}

                        <button
                            id="submitRequestButton"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? "Submitting..." : "Submit Request"}
                        </button>
                        {user && <p>Request for: {user.address}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
