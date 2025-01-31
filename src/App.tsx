import { BrowserRouter, Route } from "react-router";
import { HomePage } from "./routes";

export default function App() {
	return (
		<BrowserRouter>
			<Route path="/" element={<HomePage />} />
		</BrowserRouter>
	);
}
