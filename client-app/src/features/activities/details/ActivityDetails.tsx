import { observer } from "mobx-react-lite";
import { useParams } from "react-router";
import { Button, Card, Image } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { useEffect } from 'react';
import { Link } from "react-router-dom";


export const ActivityDetails = observer(() => {

	const { activityStore } = useStore();
	const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams();

    useEffect(()=>{
        if (id)
        loadActivity(id)
    },[id, loadActivity])

	if(!activity || loadingInitial) return <LoadingComponent />;
    
	return (
		<Card fluid>
			<Image src={`../assets/categoryImages/${activity.category}.jpg`} alt={activity.category}/>
			<Card.Content>
				<Card.Header>{activity.title}</Card.Header>
				<Card.Meta>
					<span className="date">{activity.date}</span>
				</Card.Meta>
				<Card.Description>{activity.description}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Button.Group widths={2}>
					<Button basic color="blue" content="Edit" as={Link} to={`/manage/${activity.id}`}  />
					<Button basic color="grey" content="Cancel" type="button" />
				</Button.Group>
			</Card.Content>
		</Card>
	);
});
