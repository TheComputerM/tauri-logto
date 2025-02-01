import { useEffect } from "react";
import { useNavigate } from "react-router";
import { logtoClient } from "../lib/logto";
import { isTauri } from "../lib/detect-tauri";

const Login = () => {
	const navigate = useNavigate();

	async function handleTauriLogin() {
		await logtoClient.signIn("tauri-logto://callback");
		const stopListener = await window.__TAURI__?.event.listen<string>(
			"redirect_uri",
			async (event) => {
				await logtoClient.handleSignInCallback(event.payload);
				if (await logtoClient.isAuthenticated()) {
					stopListener?.();
					navigate("/app");
				}
			},
		);
	}

	async function handleWebLogin() {
		await logtoClient.signIn("http://localhost:1420/callback");
		if (await logtoClient.isAuthenticated()) {
			navigate("/app");
		}
	}

	return (
		<button type="button" onClick={isTauri ? handleTauriLogin : handleWebLogin}>
			Login
		</button>
	);
};

export const HomePage = () => {
	const navigate = useNavigate();
	async function onMount() {
		if (await logtoClient.isAuthenticated()) {
			navigate("/app");
		}
	}

	useEffect(() => {
		onMount();
	});

	return (
		<main>
			<br />
			<div className="container">
				<h1>Tauri + Logto OAuth2</h1>
				<Login />
				<p>Mode: {isTauri ? "Tauri" : "Web"}</p>
			</div>
		</main>
	);
};
