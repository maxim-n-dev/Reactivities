import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';
import axios from "axios";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import Navbar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

function App() {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

	useEffect(() => {
		axios.get<Activity[]>("http://localhost:5000/api/activities").then((resp) => {
			setActivities(resp.data);
		});
	}, []);

	const handleSelectActivity = (id: string) => {
		setSelectedActivity(activities.find((ac) => (ac.id === id)));
	};
	const handleCancelSelectActivity = () => {
		setSelectedActivity(undefined);
	};

	const handleFormOpen = (id?: string) => {
		id ? handleSelectActivity(id) : handleCancelSelectActivity();
		setEditMode(true);
	}

	const handleFormClose = () => {
		setEditMode(false);
	}

	const handleCreateOrEditActivity = (activity: Activity) => {
		activity.id  ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
								: setActivities([...activities, {...activity, id : uuid()}]);

		setEditMode(false);
		setSelectedActivity(activity);
	}

	const handleDeleteActivity = (id: string) => {
		setActivities(activities.filter(x => x.id !== id));
		setEditMode(false);
		setSelectedActivity(undefined);
	}

	return (
		<>
			<Navbar openForm={ handleFormOpen } />
			<Container style={{ marginTop: "7em" }}>
				<ActivityDashboard 
					activities={activities} 
					selectActivity={handleSelectActivity}
					selectedActivity={selectedActivity}
					cancelSelectActivity={handleCancelSelectActivity}
					editMode={editMode}
					openForm={handleFormOpen}
					closeForm={handleFormClose}
					createOrEdit={handleCreateOrEditActivity}
					delete={handleDeleteActivity}
				/>
			</Container>
		</>
	);
}

export default App;
