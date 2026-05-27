// SignUpForm.jsx
import React from "react";
import InputField from "./InputField";

export default function SignUpForm({
	formData,
	handleChange,
	phoneChange,
	handleSubmit,
	handleClear,
	styles,
}) {
	return (
		<form onSubmit={handleSubmit}>
			<InputField
				label="First Name:"
				type="text"
				name="first_name"
				id="firstName"
				value={formData.first_name}
				onChange={handleChange}
				className={styles.buttonInput}
			/>
			<InputField
				label="Last Name:"
				type="text"
				name="last_name"
				id="lastName"
				value={formData.last_name}
				onChange={handleChange}
				className={styles.buttonInput}
			/>
			<InputField
				label="Username:"
				type="text"
				name="username"
				id="username"
				value={formData.username}
				onChange={handleChange}
				className={styles.buttonInput}
			/>
			<InputField
				label="Password:"
				type="text"
				name="password"
				id="password"
				value={formData.password}
				onChange={handleChange}
				className={styles.buttonInput}
			/>
			<InputField
				label="Email:"
				type="email"
				name="email"
				id="email"
				value={formData.email}
				onChange={handleChange}
				className={styles.buttonInput}
			/>
			<InputField
				label="Address:"
				type="text"
				name="address"
				id="address"
				value={formData.address}
				onChange={handleChange}
				className={styles.buttonInput}
			/>
			<InputField
				label="Phone Number:"
				type="tel"
				name="phone_number"
				id="phoneNumber"
				value={formData.phone_number}
				onChange={phoneChange}
				className={styles.buttonInput}
				placeholder="(xxx) xxx-xxxx"
			/>
			<div className="submitGroup">
				<button type="submit" id={styles.submit}>
					Submit
				</button>
				<button type="reset" onClick={handleClear} id={styles.clear}>
					Clear
				</button>
			</div>
		</form>
	);
}
