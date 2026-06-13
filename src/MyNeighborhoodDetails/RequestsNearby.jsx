export default function RequestsNearby(props) {
    const {
        matchedUser,
        nearbyRequests,
        radius,
        extractLatLng,
        distanceMeters,
        formatDateTime,
        onAccept,
    } = props;

    const center = extractLatLng(matchedUser?.geolocation);

    const visibleNearby = (nearbyRequests || []).filter((req) => {
        const rloc = extractLatLng(req.geolocation);
        if (!center || !rloc) return false;
        const d = distanceMeters(center, rloc);
        return d <= Number(radius || 0);
    });

    if (visibleNearby.length === 0) {
        return (
            <div className="columnRowContainerNearby">
                <h3 className="title">Requests Near You</h3>
                <p>No nearby requests yet.</p>
            </div>
        );
    }

    return (
        <div className="columnRowContainerNearby">
            <h3 className="title">Requests Near You</h3>
            <ul className="nearbyRequestContainer">
                {visibleNearby.map((req) => {
                    const claimedBy = Array.isArray(req.claimedBy)
                        ? req.claimedBy
                        : [];
                    const capacity = Number(req.personAmount) || 1;
                    const isFull = claimedBy.length >= capacity;
                    return (
                        <li className="nearbyRequestItem" key={req.requestId}>
                            <strong>
                                {req.title} ~ {req.username}
                            </strong>
                            <span>{req.description}</span>
                            <small>
                                {req.timeEstimate === "0"
                                    ? "Not Sure "
                                    : ` ~${req.timeEstimate} min `}
                                &middot; {formatDateTime(req.requestedTime)}
                                &middot; {claimedBy.length}/
                                {capacity > 1
                                    ? `${capacity} people`
                                    : "1 person"}
                            </small>
                            <button
                                onClick={() => onAccept && onAccept(req)}
                                disabled={isFull}
                                className={
                                    isFull
                                        ? "acceptRequestButtonFull"
                                        : "acceptRequestButton"
                                }
                            >
                                {isFull ? "Full" : "Accept"}
                            </button>
                        </li>
                    );
                })}
            </ul>
            <style>
                
            </style>
        </div>
    );
}
