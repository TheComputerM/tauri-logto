import { useEffect } from "react";
import { logtoClient } from "../lib/logto";
import { useNavigate } from "react-router";

export const CallbackPage = () => {
	const navigate = useNavigate();
	async function onMount() {
		await logtoClient.handleSignInCallback(window.location.href);
		if (await logtoClient.isAuthenticated()) {
			navigate("/");
		} else {
			alert("Failed to sign in");
		}
	}

	useEffect(() => {
		onMount();
	});
  
	return <div>Redirecting to Homepage...</div>;
};
