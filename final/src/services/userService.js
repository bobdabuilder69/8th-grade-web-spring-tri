import supabase from "./supabase";

// Fetch all users from Supabase
export async function getAllUsers() {
	try {
		console.log("[getAllUsers] Fetching all users from Supabase...");
		const { data, error, status } = await supabase.from("users").select("*");
		if (error) {
			console.error("[getAllUsers] Supabase error details:", {
				message: error.message,
				code: error.code,
				details: error.details,
				hint: error.hint,
				status,
			});
			throw error;
		}
		console.log("[getAllUsers] Successfully fetched users:", data);
		return data || [];
	} catch (error) {
		console.error("[getAllUsers] Exception:", error);
		return [];
	}
}

// Fetch a user by name
export async function getUserByUsername(username) {
	try {
		const normalizedUsername = username.toLowerCase().trim();
		console.log(
			"[getUserByUsername] Fetching user with username:",
			normalizedUsername,
		);
		const { data, error, status } = await supabase
			.from("users")
			.select("*")
			.eq("username", normalizedUsername)
			.single();

		if (error) {
			console.error("[getUserByUsername] Supabase error details:", {
				message: error.message,
				code: error.code,
				details: error.details,
				hint: error.hint,
				status,
			});
			if (error.code !== "PGRST116") throw error;
		}
		console.log("[getUserByUsername] User found:", data);
		return data || null;
	} catch (error) {
		console.error("[getUserByUsername] Exception:", error);
		return null;
	}
}

// Check if geolocation already exists
// Check if geolocation already exists
export async function geolocationExists(geolocation) {
	try {
		const geolocationString = geolocation.map(String).join(",");
		const { data, error } = await supabase
			.from("users")
			.select("auth_user_id, geolocation");
		if (error) {
			console.error("[geolocationExists] Supabase error:", error);
			throw error;
		}
		console.log("[geolocationExists] Incoming:", geolocationString);
		const exists = data.some((row) => {
			const dbGeolocationString = row.geolocation.join(",");
			console.log("[geolocationExists] DB value:", dbGeolocationString);
			return dbGeolocationString === geolocationString;
		});
		console.log("[geolocationExists] Geolocation exists?", exists);
		return exists;
	} catch (error) {
		console.error("[geolocationExists] Exception:", error);
		return false;
	}
}

// Check if email already exists
export async function emailExists(email) {
	try {
		const normalizedEmail = email.toLowerCase().trim();
		console.log("[emailExists] Checking email:", normalizedEmail);
		const { data, error } = await supabase
			.from("users")
			.select("auth_user_id")
			.eq("email", normalizedEmail)
			.maybeSingle();
		if (error) {
			console.error("[emailExists] Supabase error:", error);
			throw error;
		}
		const exists = !!data;
		console.log("[emailExists] Email exists?", exists);
		return exists;
	} catch (error) {
		console.error("[emailExists] Exception:", error);
		return false;
	}
}

// Check if username already exists
export async function usernameExists(name) {
	try {
		const normalizedName = name.toLowerCase().trim();
		console.log("[usernameExists] Checking username:", normalizedName);
		const { data, error } = await supabase
			.from("users")
			.select("auth_user_id")
			.eq("username", normalizedName)
			.maybeSingle();
		if (error) {
			console.error("[usernameExists] Supabase error:", error);
			throw error;
		}
		const exists = !!data;
		console.log("[usernameExists] Username exists?", exists);
		return exists;
	} catch (error) {
		console.error("[usernameExists] Exception:", error);
		return false;
	}
}

// Update user radius preference
export async function updateUserRadius(userId, radius) {
	try {
		console.log(
			"[updateUserRadius] Updating radius for user:",
			userId,
			"radius:",
			radius,
		);
		const { data, error } = await supabase
			.from("users")
			.update({ radius })
			.eq("auth_user_id", userId)
			.select();
		if (error) {
			console.error("[updateUserRadius] Supabase error:", error);
			throw error;
		}
		console.log("[updateUserRadius] Radius updated successfully:", data);
		return data[0]; // Return the first updated user object
	} catch (error) {
		console.error("[updateUserRadius] Exception:", error);
		throw error;
	}
}

export async function createUser(userData) {
	try {
		console.log("[createUser] Attempting to sign up user:", userData.email);

		const { data: authData, error: authError } = await supabase.auth.signUp({
			email: userData.email,
			password: userData.password,
		});

		if (authError) {
			console.error("[createUser] Auth error details:", authError);
			throw authError;
		}

		if (!authData.user) {
			throw new Error("Auth session missing - user not created");
		}

		console.log("[createUser] Auth successful, user ID:", authData.user.id);

		// Create custom user profile in users table
		const { data: userTableData, error: userError } = await supabase
			.from("users")
			.insert([
				{
					auth_user_id: authData.user.id,
					name: userData.name.toLowerCase().trim(),
					email: userData.email.toLowerCase().trim(),
					address: userData.address.trim(),
					phone: userData.phone,
					prettyPhone: userData.prettyPhone,
					geolocation: userData.geolocation,
					username: userData.username,
				},
			]);

		if (userError) throw userError;

		console.log("[createUser] User created:", userTableData);
		return userTableData;
	} catch (error) {
		console.error("[createUser] Error:", error);
		throw error;
	}
}

// Login user with email and password
export async function loginUser(email, password) {
	try {
		console.log("[loginUser] Logging in user:", email);
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("[loginUser] Auth error:", error);
			return null;
		}

		console.log("[loginUser] Login successful:", data.user);
		return data.user;
	} catch (error) {
		console.error("[loginUser] Exception:", error);
		return null;
	}
}

// Get all unique names (for the list in MyNeighborhood)
export async function getAllUsernames() {
	try {
		console.log("[getAllUsernames] Fetching all usernames...");
		const { data, error } = await supabase.from("users").select("username");
		if (error) {
			console.error("[getAllusernames] Supabase error:", error);
			throw error;
		}
		console.log("[getAllusernames] Raw data from Supabase:", data);
		const usernames = Array.from(
			new Set((data || []).map((u) => u.username).filter(Boolean)),
		);
		console.log("[getAllusernames] Unique names:", usernames);
		return usernames;
	} catch (error) {
		console.error("[getAllusernames] Exception:", error);
		return [];
	}
}

