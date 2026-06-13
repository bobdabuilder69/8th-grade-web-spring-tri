export default function PhoneOrEmailSelector({ includeEmailOrNumber, setIncludeEmailOrNumber }) {
    return (
        <div id="includeNameContainer">
            <div>
                <input
                    type="radio"
                    id="includeNameEmail"
            name="includeName"
            value="item"
            className="includeNameRadio"
            checked={includeEmailOrNumber === "email"}
            onChange={() =>
                setIncludeEmailOrNumber("email")
            }
        />

        <label htmlFor="includeNameEmail">Email</label>
    </div>
    <div>
        <input
            type="radio"
            id="includeNamePhone"
            name="includeName"
            value="item"
            className="includeNameRadio"
            checked={includeEmailOrNumber === "phone"}
            onChange={() =>
                setIncludeEmailOrNumber("phone")
            }
        />
        <label htmlFor="includeNamePhone">Phone</label>
    </div>
    <div>
        <input
            type="radio"
            id="includeNameBoth"
            name="includeName"
            value="item"
            className="includeNameRadio"
            checked={includeEmailOrNumber === "both"}
            onChange={() =>
                setIncludeEmailOrNumber("both")
            }
        />
        <label htmlFor="includeNameBoth">Both</label>
    </div>
    <div>
        <input
            type="radio"
            id="includeNameNo"
            name="includeName"
            value="item"
            className="includeNameRadio"
            checked={includeEmailOrNumber === "none"}
            onChange={() =>
                setIncludeEmailOrNumber("none")
            }
        />
        <label htmlFor="includeNameNo">None</label>
    </div>
</div>
    )
}