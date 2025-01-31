import { onUrl, start } from "@fabianlars/tauri-plugin-oauth";
import { useState } from "react";
import { logtoClient } from "../lib/logto";

const LoginButton = () => {
	const [logs, setLogs] = useState<string[]>([]);

	async function handleSignin() {
		const port = await start();
		setLogs((logs) => [...logs, `Server started on port ${port}`]);
		await logtoClient.signIn(`http://localhost:${port}`);

		await onUrl(async (url) => {
			setLogs((logs) => [...logs, `Callback received: ${url}`]);

			await logtoClient.handleSignInCallback(url);
			if (await logtoClient.isAuthenticated()) {
				const accessToken = await logtoClient.getAccessToken();
				setLogs((logs) => [...logs, `Access Token: ${accessToken}`]);

				alert("Authentication successful!");
			} else {
				alert("Authentication failed!");
			}
		});
	}

	return (
		<div>
			<button type="button" onClick={handleSignin}>
				Login
			</button>
			<ul>
				{logs.map((log, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<li key={i}>{log}</li>
				))}
			</ul>
		</div>
	);
};

export const HomePage = () => {
	return (
		<div>
			<h1>Home</h1>
			<LoginButton />
		</div>
	);
};
