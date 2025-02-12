import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { logtoClient } from "../lib/logto";
import { isTauri } from "../lib/detect-tauri";

const Logout = () => {
	const navigate = useNavigate();
	async function handleTauriLogout() {
		await logtoClient.signOut("tauri-logto://callback");
		navigate("/");
	}

	async function handleWebLogout() {
		await logtoClient.signOut("http://localhost:1420/");
	}

	return (
		<button
			type="button"
			onClick={isTauri ? handleTauriLogout : handleWebLogout}
		>
			Logout
		</button>
	);
};

const Details = () => {
	const [details, setDetails] = useState<Record<string, string>>({});
	async function onMount() {
		setDetails({
			access_token: await logtoClient.getAccessToken(),
			id_token: (await logtoClient.getIdToken()) ?? "<empty>",
		});
	}

	useEffect(() => {
		onMount();
	});

	return (
		<ul>
			{Object.entries(details).map(([key, value]) => (
				<li key={key}>
					{key}: {value}
				</li>
			))}
		</ul>
	);
};

export const AppPage = () => {
	const navigate = useNavigate();
	async function onMount() {
		if (!(await logtoClient.isAuthenticated())) {
			navigate("/");
		}
	}

	useEffect(() => {
		onMount();
	});

	return (
		<main>
			<div className="container">
				<h1>App Page</h1>
				<Logout />
				<Details />
			</div>
		</main>
	);
};
