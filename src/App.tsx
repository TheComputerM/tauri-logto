import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./routes";
import { AppPage } from "./routes/app";
import { CallbackPage } from "./routes/callback";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/app" element={<AppPage />} />
				<Route path="/callback" element={<CallbackPage />} />
			</Routes>
		</BrowserRouter>
	);
}
