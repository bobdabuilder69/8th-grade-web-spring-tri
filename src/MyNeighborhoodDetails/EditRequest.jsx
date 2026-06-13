export default function EditRequest({ editFields, setEditFields, onSave, onCancel, onDelete }) {
    return (
        <div className="Overlay" onClick={onCancel}>
            <div className="Card" onClick={(e) => e.stopPropagation()}>
                <h3 className="title">Edit Request</h3>

                <div className="formGroup">
                    <label className="label">title</label>
                    <input
                        className="editInput"
                        value={editFields.title}
                        onChange={(e) =>
                            setEditFields({ ...editFields, title: e.target.value })
                        }
                        placeholder="Request title"
                    />
                </div>

                <div className="formGroup">
                    <label className="label">Description</label>
                    <textarea
                        className="editTextarea"
                        value={editFields.description}
                        onChange={(e) =>
                            setEditFields({ ...editFields, description: e.target.value })
                        }
                        placeholder="Provide more details..."
                    />
                </div>

                <div className="editRow">
                    <div className="formGroup" style={{ flex: 1 }}>
                        <label className="label">
                            Time Estimate: {editFields.timeEstimate} min
                        </label>
                        <input
                            className="rangeInput"
                            type="range"
                            min="10"
                            max="180"
                            value={editFields.timeEstimate}
                            onChange={(e) =>
                                setEditFields({ ...editFields, timeEstimate: e.target.value })
                            }
                        />
                    </div>

                    <div className="formGroup" style={{ flex: 1 }}>
                        <label className="label">Date &amp; Time</label>
                        <input
                            className="editInput"
                            type="datetime-local"
                            value={editFields.requestedTime}
                            onChange={(e) =>
                                setEditFields({ ...editFields, requestedTime: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div className="editActions">
                    <button className="saveButton" onClick={onSave}>Save</button>
                    <button className="cancelButton" onClick={onCancel}>Cancel</button>
                    <button className="deleteButton" onClick={onDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
}