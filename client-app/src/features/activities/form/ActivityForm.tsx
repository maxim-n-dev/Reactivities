import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { useEffect } from "react";
import { Activity } from "../../../app/models/activity";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { categoryOptions } from "../../../app/common/options/CategoryOptions";
import { MyDateInput, MySelectInput, MyTextArea, MyTextInput } from "../../../app/common/form";

export const ActivityForm = observer(() => {
	const validationSchema = Yup.object().shape({
		id: Yup.string(),
		title: Yup.string().required("The activity title is required"),
		description: Yup.string().required("The activity description is required"),
		category: Yup.string().required(),
		date: Yup.string().required("Date is required"),
		city: Yup.string().required(),
		venue: Yup.string().required(),
	});

	const { activityStore } = useStore();
	const { selectedActivity, loadActivity, loadingInitial, createActivity, updateActivity } = activityStore;

	const { id } = useParams();

	const navigate = useNavigate();

	const initialState = {
		id: "",
		title: "",
		category: "",
		description: "",
		city: "",
		venue: "",
		date: null,
	};

	const [activity, setActivity] = useState<Activity>(initialState);

	useEffect(() => {
		if (id)
			loadActivity(id).then(() => {
				if (selectedActivity) setActivity(selectedActivity);
			});
	}, [id, loadActivity, selectedActivity]);

	const handleFormSubmit = (activity: Activity) => {
		if (!activity.id) {
			activity.id = uuid();
			createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
		} else {
			updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
		}
	};

	if (loadingInitial) return <LoadingComponent content="Loading activity ..." />;

	return (
		<Segment clearing>
      <Header content='Activity Details' sub color="teal" />
			<Formik
				validationSchema={validationSchema}
				enableReinitialize
				initialValues={activity}
				onSubmit={(values) => handleFormSubmit(values)}
			>
				{({ handleSubmit, isValid, isSubmitting, dirty }) => (
					<Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
						<MyTextInput name="title" placeholder="Title" />
						<MyTextArea name="description" placeholder="Description" rows={5} />
						<MySelectInput options={categoryOptions} name="category" placeholder="Category" />
						<MyDateInput
							name="date"
							placeholderText="Date"
							showTimeSelect
							timeCaption="time"
							dateFormat="MMMM d, yyyy h:mm aa"
						/>
            <Header content='Location Details' sub color="teal" />
						<MyTextInput placeholder="City" name="city" />
						<MyTextInput placeholder="Venue" name="venue" />
						<Button
              disabled={ isSubmitting || !dirty || !isValid }
              loading={activityStore.loadingInitial} 
              floated="right" 
              positive 
              type="submit" 
              content="Submit" />

						<Button as={Link} floated="right" type="button" content="Cancel" to="/activities" />
					</Form>
				)}
			</Formik>
		</Segment>
	);
});
