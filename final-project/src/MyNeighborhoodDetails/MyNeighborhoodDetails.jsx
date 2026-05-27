import { useState, useEffect, useRef } from "react";
import BackButton from "../Functions/BackButton";
import "./MyNeighborHoodDetails.css";
import { getUserByUsername, updateUserRadius } from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function MyNeighborhoodDetails() {
    const [matchedUser, setMatchedUser] = useState(null);
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [radius, setRadius] = useState(1000);
    const [isAnimating, setIsAnimating] = useState(false);
    const circleRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadUser() {
            const currentLogIn = localStorage.getItem("currentLogIn") || "";
            console.log(
                "[MyNeighborhoodDetails] Loading user with username:",
                currentLogIn,
            );
            if (!currentLogIn) {
                console.log("[MyNeighborhoodDetails] No currentLogIn found");
                setLoading(false);
                return;
            }
            const user = await getUserByUsername(currentLogIn);
            console.log("[MyNeighborhoodDetails] User loaded:", user);
            setMatchedUser(user);
            // Load radius from database if it exists, otherwise use default
            if (user?.radius) {
                setRadius(user.radius);
            }
            setLoading(false);
        }
        loadUser();
    }, []);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    useEffect(() => {
        if (
            !window.L ||
            !matchedUser?.geolocation ||
            !Array.isArray(matchedUser.geolocation)
        ) {
            console.log(
                "Map not initialized. matchedUser or geolocation missing.",
                matchedUser,
            );
            return;
        }

        const map = window.L.map("map").setView(matchedUser.geolocation, 13);

        // Add tiles so the map actually renders
        window.L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                minZoom: 10,
                attribution: "© OpenStreetMap contributors",
            },
        ).addTo(map);

        // Add a marker at the user's address
        window.L.marker(matchedUser.geolocation).addTo(map);

        console.log("Map initialized at:", matchedUser.geolocation);
        circleRef.current = window.L.circle(matchedUser.geolocation, {
            radius: radius,
            color: "blue",
        })
            .addTo(map)
            .bindPopup("My Neighborhood Range");

        return () => map.remove();
    }, [matchedUser]);

    useEffect(() => {
        if (circleRef.current) {
            circleRef.current.setRadius(radius);
        }
    }, [radius]);

    function updateRadius(newRadius) {
        setRadius(newRadius);
        if (circleRef.current) {
            circleRef.current.setRadius(newRadius);
        }
    }

    async function updateRadiusDb(newRadius) {
        if (matchedUser?.auth_user_id) {
            try {
                console.log(matchedUser);
                await updateUserRadius(matchedUser.auth_user_id, newRadius);
                console.log("[MyNeighborhoodDetails] Radius saved:", newRadius);
            } catch (error) {
                console.error(
                    "[MyNeighborhoodDetails] Error saving radius:",
                    error,
                );
            }
        }
    }

    if (loading) {
        return (
            <div className="container">
                <BackButton />
                <p>Loading...</p>
            </div>
        );
    }

    const currentLogIn = localStorage.getItem("currentLogIn") || "";

    return (
        <div className="container">
            <BackButton />
            <h1 className="heading">Neighborhood Details</h1>

            {matchedUser ? (
                <div className="listItem">
                    <h2>{capitalizeFirstLetter(matchedUser.name)}</h2>
                    <div id="columnMaker">
                        <div id="mapContainer">
                            <h3 className="title">Your Location</h3>
                            <div id="map"></div>
                            <input
                                type="range"
                                min="200"
                                max="10000"
                                value={radius}
                                onChange={(e) =>
                                    updateRadius(Number(e.target.value))
                                }
                                onMouseUp={(e) =>
                                    updateRadiusDb(Number(e.target.value))
                                }
                            />
                        </div>
                        <div className="columnContainer">
                            <div className="columnRowContainer">
                                <h3 className="title">People Near You</h3>
                            </div>
                            <div className="columnRowContainer">
                                <h3 className="title">My Requests</h3>
                                <button
                                    id="newRequest"
                                    onClick={() => {
                                        setIsAnimating(true);
                                        setTimeout(() => {
                                            navigate("/newrequest");
                                        }, 500);
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>


                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <ul>
                        {results.map((place) => (
                            <li key={place.place_id}>
                                {place.name + ", " + place.vicinity ||
                                    "Unnamed place"}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>
                    No matching user found for "{currentLogIn}", or data could
                    not be found.
                </p>
            )}
            {isAnimating && <div className="sliderL"></div>}
        </div>
    );
}
