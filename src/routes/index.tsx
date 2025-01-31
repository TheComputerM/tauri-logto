import { onUrl, start } from "@fabianlars/tauri-plugin-oauth";
import { logtoClient } from "../lib/logto";
import { isTauri } from "../lib/detect-tauri";

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
		await logtoClient.signIn("http://localhost:1420/callback");
	}

	return (
		<button type="button" onClick={isTauri ? handleTauriLogin : handleWebLogin}>
			Login
		</button>
	);
};

export const HomePage = () => {
	console.log(window);
	return (
		<div>
			<h1>Home</h1>
			<LoginButton />
		</div>
	);
};
