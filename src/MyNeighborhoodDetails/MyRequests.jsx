import { useNavigate } from "react-router-dom";

export default function MyRequests(props) {
    const {
        myRequests,
        formatDateTime,
        startEdit,
        isAnimating,
        setIsAnimating,
    } = props;

    const navigate = useNavigate();

    const requestList = Array.isArray(myRequests) ? myRequests : [];

    return (
        <div className="columnRowContainer">
            <h3 className="title">My Requests</h3>
            <button
                id="newRequest"
                onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => navigate("/newrequest"), 500);
                }}
            >
                +
            </button>
            {requestList.length === 0 ? (
                <p>You have no active requests.</p>
            ) : (
                <ul className="myRequestContainer">
                    {requestList.map((req) => {
                        const claimedBy = Array.isArray(req.claimedBy)
                            ? req.claimedBy
                            : [];
                        const requestedCount = claimedBy.length;
                        const capacity = Number(req.personAmount) || 1;
                        return (
                            <li className="myRequestItem" key={req.requestId}>
                                <strong>{req.title}</strong>
                                <span>{req.description}</span>
                                <small>
                                    {req.timeEstimate === "0"
                                        ? "Not Sure "
                                        : ` ~${req.timeEstimate} min `}
                                    &middot; {formatDateTime(req.requestedTime)} &middot; {requestedCount}/{capacity > 1 ? `${capacity} people` : "1 person"}
                                </small>
                                <button
                                    className="editButton"
                                    onClick={() => startEdit(req)}
                                >
                                    Edit
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
