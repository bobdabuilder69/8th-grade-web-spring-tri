import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BackButton from "../Functions/BackButton";
import styles from "./MyNeighborhood.module.css";
import {
	getAllUsernames,
	loginUser,
	getUserByUsername,
} from "../services/userService";

export default function MyNeighborhood() {
	const navigate = useNavigate();
	const [nameInput, setNameInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [usernames, setUsernames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		async function fetchNames() {
			console.log("[MyNeighborhood] Fetching all usernames...");
			const allUsernames = await getAllUsernames();
			console.log("[MyNeighborhood] Usernames fetched:", allUsernames);
			setUsernames(allUsernames);
			setLoading(false);
		}
		fetchNames();
	}, []);

	const handleChange = (e) => {
		setNameInput(e.target.value);
	};
	const handlePChange = (e) => {
		setPasswordInput(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		const normalizedName = nameInput.trim().toLowerCase();
		console.log(
			"[MyNeighborhood] Form submitted with username:",
			normalizedName,
		);

		// Check if username exists
		if (!usernames.includes(normalizedName)) {
			setError("Username not found.");
			return;
		}

		// Get user by username to get their email
		const user = await getUserByUsername(normalizedName);
		if (!user) {
			setError("User not found.");
			return;
		}

		// Login using Supabase Auth with email and password
		const loggedInUser = await loginUser(user.email, passwordInput);
		if (!loggedInUser) {
			setError("Incorrect username or password.");
			return;
		}

		localStorage.setItem("currentLogIn", normalizedName);
		setIsAnimating(true);
		setTimeout(() => {
			navigate("/myneighborhooddetails");
		}, 500);
	};

	return (
		<div>
			<BackButton />
			<h1 className={styles.h1}>View My Neighborhood</h1>
			<button onClick={() => navigate("/signup")}>Please register here</button>
			<h2>Or Enter Username and Password Below:</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					id="nameInput"
					name="nameInput"
					value={nameInput}
					onChange={handleChange}
					className={styles.buttonInput}
					placeholder="Username"
				/>
				<br></br>
				<input
					type="password"
					id="passwordInput"
					name="passwordInput"
					value={passwordInput}
					onChange={handlePChange}
					className={styles.buttonInput}
					placeholder="Password"
				/>
				<br></br>
				{error && <p style={{ color: "red" }}>{error}</p>}
				<button type="submit" className={styles.button}>
					Submit
				</button>
			</form>
			<h3>Registered usernames (for testing):</h3>
			{loading ? (
				<p className={styles.load}>Loading...</p>
			) : (
				<ul>
					{usernames.length > 0 ? (
						usernames.map((n) => <li key={n}>{n}</li>)
					) : (
						<p>No users registered yet.</p>
					)}
				</ul>
			)}
			{isAnimating && <div className={styles.sliderR}></div>}
		</div>
	);
}
