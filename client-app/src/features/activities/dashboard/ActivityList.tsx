import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export const ActivityList = observer(() => {

	const { activityStore } = useStore();
	const { deleteActivity, activitiesByDate, loading } = activityStore;

	const [target, setTarget] = useState('');
	const handleActivityDelete = (id: string) => {
		setTarget(id);
		deleteActivity(id);
	}
	
	return (

		<Segment>
			<Item.Group divided>
				{activitiesByDate?.map((activity) => (
					<Item key={activity.id}>
						<Item.Content>
							<Item.Header as="a">{activity.title}</Item.Header>
							<Item.Meta>{activity.date}</Item.Meta>
							<Item.Description>
								<div>{activity.description}</div>
								<div>
									{activity.city}, {activity.venue}
								</div>
							</Item.Description>
							<Item.Extra>
								<Button
								  floated="right"
								  content="View"
								  color="blue"
                                  as={Link}
                                  to={`/activities/${activity.id}`}
                                />
								<Button
									name={activity.id}
									loading={loading && target === activity.id}
									floated="right"
									content="Delete"
									color="red"
									onClick={() => handleActivityDelete(activity.id)}
								/>
								<Label basic content={activity.category} />
							</Item.Extra>
						</Item.Content>
					</Item>
				))}
			</Item.Group>
		</Segment>
	);
});
