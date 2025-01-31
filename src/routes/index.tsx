import { onUrl, start } from "@fabianlars/tauri-plugin-oauth";
import { logtoClient } from "../lib/logto";
import { isTauri } from "../lib/detect-tauri";
import { useEffect, useState } from "react";

const LoginButton = () => {
	async function handleTauriLogin() {
		const port = await start();
		await logtoClient.signIn(`http://localhost:${port}`);

		await onUrl(async (url) => {
			await logtoClient.handleSignInCallback(url);
			if (await logtoClient.isAuthenticated()) {
				alert("Authentication successful!");
			} else {
				alert("Authentication failed!");
			}
		});
	}

	async function handleWebLogin() {
		// also add this to your logto application's valid redirect uri's
		await logtoClient.signIn(new URL(`${window.location.origin}/callback`));
	}

	return (
		<button type="button" onClick={isTauri ? handleTauriLogin : handleWebLogin}>
			Login
		</button>
	);
};

const Status = () => {
	const [properties, setProperties] = useState<Record<string, string>>({});

	async function onMount() {
		setProperties({
			"Logged In": (await logtoClient.isAuthenticated()) ? "true" : "false",
			"Access Token": await logtoClient.getAccessToken(),
		});
	}
	useEffect(() => {
		onMount();
	});

	return (
		<ul>
			<li>Mode: {isTauri ? "Tauri" : "Web"}</li>
			{Object.entries(properties).map(([key, value]) => (
				<li key={key}>
					{key}: {value}
				</li>
			))}
		</ul>
	);
};

export const HomePage = () => {
	return (
		<main>
			<br />
			<div className="container">
				<h1>Tauri + Logto OAuth2</h1>
				<LoginButton />
				<Status />
			</div>
		</main>
	);
};
