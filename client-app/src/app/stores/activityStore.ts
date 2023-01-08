import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {

  activityRegistry: Map<string, Activity> = new Map();
  selectedActivity: Activity | undefined = undefined;
  editMode: boolean = false;
  loading: boolean = false;
  loadingInitial: boolean = true;

  constructor() {
    makeAutoObservable(this)
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a,b) => 
            Date.parse(a.date) - Date.parse(b.date));
  }

  loadActivities = async () => {

    try {

      const activitiesCall = await agent.Activities.list();


      activitiesCall.forEach((activity) => {
        const editedActivity =  {
          ...activity,
          "date": activity.date.split("T")[0]
        }
        this.activityRegistry.set(editedActivity.id, editedActivity)
      });

      this.setLoadingInitial(false);

    } catch (error) {
      this.setLoadingInitial(false);
    }
  }

  selectActivity = (id: string) => {
    this.editMode = false;
    this.selectedActivity = this.activityRegistry.get(id);
  }

  cancelSelectActivity = () => {
    this.selectedActivity = undefined;
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }

  openForm = (id?: string) => {

    id ? this.selectActivity(id)
      : this.cancelSelectActivity();

    this.editMode = true;
  }

  closeForm = () => {
    this.editMode = false;
  }

  createActivity = async (activity: Activity) => {
    this.loading = true;
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id,activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      })

    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  updateActivity = async (activity: Activity) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.loading = false;
        this.selectedActivity = activity;

      })

    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  deleteActivity = async (id: string) => {
    this.loading = true;

    try {
      await agent.Activities.delete(id);

      runInAction(() => {
        this.loading = false;
        this.editMode = false;
        this.activityRegistry.delete(id);
        if(this.selectedActivity?.id === id) this.cancelSelectActivity()
      })
      
    } catch (error) {
      runInAction(()=> {
        this.loading = false;
      })
    }
  }

}