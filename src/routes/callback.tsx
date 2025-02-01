import { useEffect } from "react";
import { useNavigate } from "react-router";
import { logtoClient } from "../lib/logto";

export const CallbackPage = () => {
	const navigate = useNavigate();
	async function onMount() {
		await logtoClient.handleSignInCallback(window.location.href);
		if (!(await logtoClient.isAuthenticated())) {
			alert("Failed to authenticate user");
			return;
		}
		navigate("/app");
	}

	useEffect(() => {
		onMount();
	});

	return <div>Redirecting to App...</div>;
};
