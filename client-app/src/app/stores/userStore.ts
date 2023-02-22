import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { router } from "../router/Routes";
import { store } from "./store";

export default class UserStore {
  user: User | null = null;
  
  constructor() {
    makeAutoObservable(this)
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);
      runInAction(()=> this.user = user);
      store.modalStore.closeModal();
      router.navigate('/activities');
      
    } catch (error) {
      console.log(error);
      throw error;
    }

  }

  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds);
      store.commonStore.setToken(user.token);
      runInAction(()=> this.user = user);
      store.modalStore.closeModal();
      router.navigate('/activities');
      
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  logout = () => {
    localStorage.removeItem('jwt');
    this.user = null;
    router.navigate('/');
  }

  getUser = async() => {
    try {
      const user = await agent.Account.current();
      runInAction(()=> this.user = user);
    } catch (error) {
      console.log(error);
    }
  }

}
