import { onUrl, start } from "@fabianlars/tauri-plugin-oauth";
import { logtoClient } from "../lib/logto";

const LoginButton = () => {
	async function handleSignin() {
		const port = await start();
		console.log(port);
		await logtoClient.signIn(`http://localhost:${port}`);
		await onUrl(async (url) => {
			await logtoClient.handleSignInCallback(url);
			if (await logtoClient.isAuthenticated()) {
				alert("Authentication successful!");
			}
		});
	}

	return <button type="button" onClick={handleSignin}>Login</button>;
};

export const HomePage = () => {
	return (
		<div>
			<h1>Home</h1>
			<LoginButton />
		</div>
	);
};
