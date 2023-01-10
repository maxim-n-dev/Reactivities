import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function App() {


	return (
		<>
			<Navbar />
			<Container style={{ marginTop: "7em" }}>
				<Outlet />
			</Container>
		</>
	);
}

export default observer(App);
