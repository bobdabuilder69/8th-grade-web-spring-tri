import BackButton from "../Functions/BackButton";

import { useState } from "react";
import styles from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import ErrorMessage from "./ErrorMessage";
import SignUpForm from "./SignUpForm";
import {
	createUser,
	emailExists,
	geolocationExists,
	usernameExists,
} from "../services/userService";

// SignUp form component for collecting and validating user data.
export default function SignUp() {
	// Local state for any validation or submission errors.
	const [errorMessage, setErrorMessage] = useState([]);

	// Form state for user input fields.
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		username: "",
		password: "",
		email: "",
		address: "",
		phone_number: "",
	});

	const navigate = useNavigate();

	// Generic input handler for most text fields.
	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "first_name" || name === "last_name") {
			const regex = /^[A-Za-z]*$/;
			if (!regex.test(value)) {
				return;
			}
		}
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	// Custom input handler for the phone field to format numbers as the user types.
	const phoneChange = (e) => {
		const { name, value } = e.target;
		let cleaned = value.replace(/[^\d]/g, "");
		if (cleaned.length > 13) cleaned = cleaned.slice(0, 13);
		let formatted = cleaned;
		if (cleaned.length === 10) {
			formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
		} else if (cleaned.length > 10 && cleaned.length < 14) {
			if (cleaned.length === 11) {
				formatted = `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
			} else if (cleaned.length === 12) {
				formatted = `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8, 12)}`;
			} else if (cleaned.length === 13) {
				formatted = `+${cleaned.slice(0, 3)} (${cleaned.slice(3, 6)}) ${cleaned.slice(6, 9)}-${cleaned.slice(9, 13)}`;
			}
		} else if (cleaned.length > 6) {
			formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
		} else if (cleaned.length > 3) {
			formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
		}
		setFormData((prevState) => ({
			...prevState,
			[name]: formatted,
		}));
	};

	// Clear the form fields and reset state.
	const handleClear = (e) => {
		setFormData({
			first_name: "",
			last_name: "",
			username: "",
			password: "",
			email: "",
			address: "",
			phone_number: "",
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("[SignUp] Form submission started with data:", formData);
		let errors = [];
		const formValues = Object.values(formData);
		const formKeys = Object.keys(formData);
		formKeys.forEach((key, i) => {
			if (formValues[i].trim() === "") {
				errors.push(`${key.replace(/_/g, " ")} is required`);
			}
		});
		const cleanedPhone = formData.phone_number.replace(/[^\d]/g, "");
		if (cleanedPhone.length < 10) {
			errors.push("phone number must be 10+ digits");
		}
		if (errors.length > 0) {
			console.log("[SignUp] Validation errors:", errors);
			setErrorMessage(errors);
			return;
		}
		setErrorMessage([]);

		// Combine first and last name
		const fullName = `${formData.first_name.toLowerCase().trim()} ${formData.last_name.toLowerCase().trim()}`;
		const normalizedAddress = formData.address.toLowerCase().trim();
		const normalizedEmail = formData.email.toLowerCase().trim();

		try {
			console.log(
				"[SignUp] No conflicts found, proceeding with geolocation...",
			);

			// Geolocate the address
			async function geolocate(address) {
				const response = await fetch(
					`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=d99a633a56c94dd79d82ee6b9a4d332b`,
				);
				if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

				const result = await response.json();
				console.log("[SignUp] Geolocation result:", result);
				
				return {
					coords: result.features?.[0]?.geometry?.coordinates.reverse() ?? null,
					prettyAddress: result.features?.[0]?.properties?.formatted ?? null,
					
				};
				
			}

			let { coords, prettyAddress } = await geolocate(normalizedAddress);
			console.log(`Pretty address: ${prettyAddress}`);
			console.log("[SignUp] Geolocation coords:", coords);

			// Now check for existing users with geolocation and other fields
			console.log("[SignUp] Checking for existing users...");
			const [emailExistsInDb, geolocationExistsInDb, usernameExistsInDb] =
				await Promise.all([
					emailExists(normalizedEmail),
					geolocationExists(coords),
					usernameExists(formData.username),
				]);

			console.log(
				"[SignUp] Existence checks - Email:",
				emailExistsInDb,
				"Geolocation:",
				geolocationExistsInDb,
				"Username:",
				usernameExistsInDb,
			);

			if (emailExistsInDb) {
				setErrorMessage(["Email already registered!"]);
				return;
			} else if (geolocationExistsInDb) {
				setErrorMessage(["Address taken!"]);
				return;
			} else if (usernameExistsInDb) {
				setErrorMessage(["Username taken!"]);
				return;
			}

			// Create user in Supabase
			console.log("[SignUp] Preparing user data for creation...");
			const createdUser = await createUser({
				name: fullName,
				email: normalizedEmail,
				username: formData.username.toLowerCase(),
				password: formData.password,
				address: prettyAddress || normalizedAddress,
				phone: cleanedPhone,
				prettyPhone: formData.phone_number.trim(),
				geolocation: coords,
			});


			alert("Thank you for signing up! Please note, confirmation emails may take up to 10 minutes to arrive.");
			navigate("/myneighborhood");
			console.log("[SignUp] Form submitted successfully");

			setFormData({
				first_name: "",
				last_name: "",
				username: "",
				password: "",
				email: "",
				address: "",
				phone_number: "",
			});
		} catch (error) {
			console.error("[SignUp] Error during sign up:", error);
			setErrorMessage([
				error.message || "An error occurred during sign up. Please try again.",
			]);
		}
	};

	return (
		<>
			<BackButton id="newShadow" />
			<div className="signUpContainer">
				<h1 className={styles.h1}>Sign Up Below</h1>
				<ErrorMessage
					errorMessage={errorMessage}
					className={styles.errorMessage}
				/>
				<SignUpForm
					formData={formData}
					handleChange={handleChange}
					phoneChange={phoneChange}
					handleSubmit={handleSubmit}
					handleClear={handleClear}
					styles={styles}
				/>
			</div>
		</>
	);
}