import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { HomePage } from "../../features/home/HomePage";
import { ToastContainer } from "react-toastify";
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import { LoadingComponent } from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";

function App() {
  const { commonStore, userStore } = useStore()
	const location = useLocation();

  useEffect(()=>{
    if(commonStore.token) {
      userStore.getUser().finally(()=> commonStore.setAppLoaded())
    } else {
      commonStore.setAppLoaded()
    }
  },[commonStore, userStore])

  if(!commonStore.appLoaded) return <LoadingComponent content="Loading app..." />

	return (
		<>
    <ModalContainer />
    <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
			{location.pathname === "/" ? (
				<HomePage />
			) : (
				<>
					<Navbar />
					<Container style={{ marginTop: "7em" }}>
						<Outlet />
					</Container>
				</>
			)}
		</>
	);
}

export default observer(App);
