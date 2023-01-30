import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {

  activityRegistry: Map<string, Activity> = new Map();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = true;

  constructor() {
    makeAutoObservable(this)
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) =>
      Date.parse(a.date) - Date.parse(b.date));
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = activity.date;
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] }
      ));
  }

  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {

      const activitiesCall = await agent.Activities.list();

      activitiesCall.forEach((activity) => {
        this.setActivity(activity);
      });

    } catch (error) {
      console.log(error)
    }
    this.setLoadingInitial(false);
  }

  loadActivity = async (id: string) => {
    this.loading = true;

    let activity = this.getActivity(id);

    if (activity) this.selectedActivity = activity;
    else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
      } catch (error) {
        console.log(error);
      }
      this.setLoadingInitial(false);
    }

    runInAction(() => {
      this.loading = false;
      this.selectedActivity = activity;
    });
    return activity;
  }

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }
  private setActivity = (activity: Activity) => {
    const editedActivity = {
      ...activity,
      "date": activity.date.split("T")[0]
    }
    this.activityRegistry.set(editedActivity.id, editedActivity)
  }


  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }


  createActivity = async (activity: Activity) => {
    this.loading = true;
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
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
    this.loading = true;
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
      })

    } catch (error) {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

}