import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import Navbar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";

function App() {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		agent.Activities.list().then((resp) => {
			let activs: Activity[] = [];

			resp.forEach((a) => {
				a.date = a.date.split("T")[0];
				activs.push(a);
			});

			setActivities(activs);
			setIsLoading(false);
		});
	}, []);

	const handleSelectActivity = (id: string) => {
		setSelectedActivity(activities.find((ac) => ac.id === id));
	};
	const handleCancelSelectActivity = () => {
		setSelectedActivity(undefined);
	};

	const handleFormOpen = (id?: string) => {
		id ? handleSelectActivity(id) : handleCancelSelectActivity();
		setEditMode(true);
	};

	const handleFormClose = () => {
		setEditMode(false);
	};

	const handleCreateOrEditActivity = (activity: Activity) => {
		setSubmitting(true);
		if (activity.id) {
			agent.Activities.update(activity).then(() => {
				setActivities([...activities.filter((x) => x.id !== activity.id), activity]);
				setSelectedActivity(activity);
				setSubmitting(false);
				setEditMode(false);
			});
		} else {
			activity.id = uuid();
			agent.Activities.create(activity).then(() => {
				setActivities([...activities, activity]);
				setSelectedActivity(activity);
				setSubmitting(false);
				setEditMode(false);
			});
		}

		setEditMode(false);
		setSelectedActivity(activity);
	};

	const handleDeleteActivity = (id: string) => {
		setSubmitting(true);
		agent.Activities.delete(id).then(() => {
			setActivities(activities.filter((x) => x.id !== id));
			setEditMode(false);
			setSelectedActivity(undefined);
			setSubmitting(false);
		});
	};

	return (
		<>
			{isLoading ? (
				<LoadingComponent />
			) : (
				<>
					<Navbar openForm={handleFormOpen} />
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
							submitting={submitting}
						/>
					</Container>
				</>
			)}
		</>
	);
}

export default App;
