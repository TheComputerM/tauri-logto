import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./routes";
import { CallbackPage } from "./routes/callback";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/callback" element={<CallbackPage />} />
			</Routes>
		</BrowserRouter>
	);
}
