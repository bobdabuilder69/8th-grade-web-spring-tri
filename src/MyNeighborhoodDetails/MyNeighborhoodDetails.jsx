import { useState, useEffect, useRef } from "react";
import BackButton from "../Functions/BackButton";
import "./MyNeighborHoodDetails.css";
import {
    getUserByEmail,
    updateUserRadius,
    getMyRequests,
    getNearbyRequests,
    getAcceptedRequests,
    updateRequest,
    deleteRequest,
} from "../services/userService";
import { useNavigate } from "react-router-dom";
import Logout from "../Functions/Logout";
import supabase from "../services/supabase";
import EditRequest from "./EditRequest";
import RequestsNearby from "./RequestsNearby";
import MyRequests from "./MyRequests";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDateTime(dt) {
    if (!dt) return "No time set";
    return new Date(dt).toLocaleString();
}

function distanceMeters(a, b) {
    if (!a || !b) return Infinity;
    const toRad = (v) => (v * Math.PI) / 180;
    const [lat1, lon1] = a;
    const [lat2, lon2] = b;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const rLat1 = toRad(lat1);
    const rLat2 = toRad(lat2);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);
    const aa =
        sinDLat * sinDLat +
        Math.cos(rLat1) * Math.cos(rLat2) * sinDLon * sinDLon;
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
}

function extractLatLng(geo) {
    if (!geo) return null;
    if (typeof geo === "string") {
        try {
            geo = JSON.parse(geo);
        } catch {
            return null;
        }
    }
    if (Array.isArray(geo) && geo.length >= 2)
        return [Number(geo[0]), Number(geo[1])];
    if (geo.lat != null && geo.lng != null)
        return [Number(geo.lat), Number(geo.lng)];
    if (geo.latitude != null && geo.longitude != null)
        return [Number(geo.latitude), Number(geo.longitude)];
    return null;
}

export default function MyNeighborhoodDetails() {
    const [matchedUser, setMatchedUser] = useState(null);
    const [myRequests, setMyRequests] = useState([]);
    const [nearbyRequests, setNearbyRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [radius, setRadius] = useState(1000);
    const [isAnimating, setIsAnimating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editFields, setEditFields] = useState({});
    const circleRef = useRef(null);
    const mapDivRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadUser() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setLoading(false);
                return;
            }

            const email = session.user.email;
            const user = await getUserByEmail(email);
            setMatchedUser(user);
            console.log("[MyNeighborhoodDetails] loaded user:", user);

            if (user?.radius) setRadius(user.radius);

            if (user?.auth_user_id) {
                const [mine, nearby, accepted] = await Promise.all([
                    getMyRequests(user.auth_user_id),
                    getNearbyRequests(user.auth_user_id),
                    getAcceptedRequests(user.auth_user_id),
                ]);
                setMyRequests(mine);
                setNearbyRequests(nearby);
                setAcceptedRequests(accepted);
                console.log(
                    "[MyNeighborhoodDetails] myRequests count:",
                    (mine || []).length,
                    "nearbyRequests count:",
                    (nearby || []).length,
                    "acceptedRequests count:",
                    (accepted || []).length,
                );
            }

            setLoading(false);
        }
        loadUser();
    }, []);

    useEffect(() => {
        if (
            !window.L ||
            !matchedUser?.geolocation ||
            !Array.isArray(matchedUser.geolocation) ||
            !mapDivRef.current
        )
            return;

        const map = window.L.map(mapDivRef.current).setView(
            matchedUser.geolocation,
            13,
        );

        window.L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            { minZoom: 10, attribution: "© OpenStreetMap contributors" },
        ).addTo(map);

        window.L.marker(matchedUser.geolocation).addTo(map);

        circleRef.current = window.L.circle(matchedUser.geolocation, {
            radius,
            color: "blue",
        })
            .addTo(map)
            .bindPopup("My Neighborhood Range");

        return () => map.remove();
    }, [matchedUser, mapDivRef.current]);

    useEffect(() => {
        if (circleRef.current) circleRef.current.setRadius(radius);
    }, [radius]);

    function updateRadius(newRadius) {
        setRadius(newRadius);
        if (circleRef.current) circleRef.current.setRadius(newRadius);
    }

    async function updateRadiusDb(newRadius) {
        if (matchedUser?.auth_user_id) {
            try {
                await updateUserRadius(matchedUser.auth_user_id, newRadius);
            } catch (err) {
                console.error(
                    "[MyNeighborhoodDetails] Error saving radius:",
                    err,
                );
            }
        }
    }

    function startEdit(req) {
        setEditingId(req.requestId);
        setEditFields({
            title: req.title,
            description: req.description,
            timeEstimate: req.timeEstimate,
            requestedTime: req.requestedTime
                ? new Date(req.requestedTime).toISOString().slice(0, 16)
                : "",
        });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditFields({});
    }

    async function saveEdit() {
        try {
            const updated = await updateRequest(editingId, {
                title: editFields.title,
                description: editFields.description,
                timeEstimate: Number(editFields.timeEstimate),
                requestedTime: editFields.requestedTime || null,
            });
            setMyRequests((prev) =>
                prev.map((r) =>
                    r.requestId === editingId ? { ...r, ...updated } : r,
                ),
            );
            cancelEdit();
        } catch (err) {
            setError("Failed to save changes.");
        }
    }

    async function handleAccept(req) {
        try {
            if (!matchedUser?.auth_user_id) {
                setError("No user available to accept the request.");
                return;
            }
            const currentClaimed = Array.isArray(req.claimedBy)
                ? req.claimedBy
                : [];
            const capacity = Number(req.personAmount) || 1;
            if (currentClaimed.includes(matchedUser.auth_user_id)) {
                setError("You have already accepted this request.");
                return;
            }
            if (currentClaimed.length >= capacity) {
                setError("This request already has enough people.");
                return;
            }

            const updatedClaimedBy = [
                ...currentClaimed,
                matchedUser.auth_user_id,
            ];
            const updated = await updateRequest(req.requestId, {
                claimedBy: updatedClaimedBy,
            });

            setNearbyRequests((prev) =>
                prev.filter((r) => r.requestId !== req.requestId),
            );
            setAcceptedRequests((prev) => [...prev, updated]);
        } catch (err) {
            console.error("[MyNeighborhoodDetails] accept error:", err);
            setError("Failed to accept request.");
        }
    }

    async function handleDelete() {
        if (!window.confirm("Delete this request?")) return;
        try {
            await deleteRequest(editingId);
            setMyRequests((prev) =>
                prev.filter((r) => r.requestId !== editingId),
            );
            cancelEdit();
        } catch (err) {
            setError("Failed to delete request.");
        }
    }

    if (loading) {
        return (
            <div className="container">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <Logout />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "10px 20px",
                    boxSizing: "border-box",
                }}
            >
                <BackButton style={{ display: "block" }} />
                <h1 className="heading" style={{ margin: "0 auto" }}>
                    Neighborhood Details
                </h1>
            </div>

            {matchedUser ? (
                <div className="listItem">
                    <h2>
                        {capitalizeFirstLetter(
                            matchedUser.name.replace(/\b\w/g, (char) =>
                                char.toUpperCase(),
                            ),
                        )}
                    </h2>
                    <div id="columnMaker">
                        <div id="mapContainer">
                            <h3 className="title">Your Neighborhood</h3>
                            <div id="map" ref={mapDivRef}></div>
                            <input
                                className="slider"
                                type="range"
                                min="200"
                                max="20000"
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
                                <h3 className="title">Accepted Requests</h3>
                                {acceptedRequests &&
                                acceptedRequests.length > 0 ? (
                                    <ul className="myRequestContainer">
                                        {acceptedRequests.map((req) => {
                                            const claimedBy = Array.isArray(req.claimedBy)
                                                ? req.claimedBy
                                                : [];
                                            const capacity = Number(req.personAmount) || 1;
                                            return (
                                                <li
                                                    className="myRequestItem"
                                                    key={req.requestId}
                                                >
                                                    <strong>
                                                        {req.title} ~ {req.username}
                                                    </strong>
                                                    <span>{req.description}</span>
                                                    <small>
                                                        {req.timeEstimate === "0"
                                                            ? "Not Sure "
                                                            : ` ~${req.timeEstimate} min `}
                                                        &middot; {req.address}{" "}
                                                        &middot;{" "}
                                                        {formatDateTime(
                                                            req.requestedTime,
                                                        )}{" "}
                                                        &middot;{" "}
                                                        {claimedBy.length}/
                                                        {capacity > 1
                                                            ? `${capacity} people`
                                                            : "1 person"}
                                                    </small>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p>No accepted requests yet.</p>
                                )}
                            </div>

                            <MyRequests
                                myRequests={myRequests}
                                formatDateTime={formatDateTime}
                                startEdit={startEdit}
                                isAnimating={isAnimating}
                                setIsAnimating={setIsAnimating}
                            />
                        </div>
                    </div>
                    {error && (
                        <p style={{ color: "red", marginBottom: "10px" }}>
                            {error}
                        </p>
                    )}

                    <RequestsNearby
                        matchedUser={matchedUser}
                        nearbyRequests={nearbyRequests}
                        radius={radius}
                        extractLatLng={extractLatLng}
                        distanceMeters={distanceMeters}
                        formatDateTime={formatDateTime}
                        onAccept={handleAccept}
                    />
                </div>
            ) : (
                <p>No matching user found, or data could not be found.</p>
            )}

            {isAnimating && <div className="sliderL"></div>}

            {editingId && (
                <EditRequest
                    editFields={editFields}
                    setEditFields={setEditFields}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
