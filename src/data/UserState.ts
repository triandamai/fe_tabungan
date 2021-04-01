import { reactive } from "@vue/reactivity";
import { auth, getCurrentUser } from "../services/FirebaseServices";
import firebase from "firebase/app";
import apiServices from "../services/Services";

import { useRouter } from "vue-router";
import { ICount, ISavings, IUser } from "../services/Type";

interface IUserState {
  email: string;
  password: string;
  authSuccess: boolean;
  isProgressing: boolean;
  savings: ISavings;
  profil: IUser;
  count: ICount;
}

const userState = reactive<IUserState>({
  email: "",
  password: "",
  authSuccess: false,
  isProgressing: false,
  savings: {
    _id: "",
    savingId: "",
    userId: "",
    description: "",
    createdBy: "",
    createdAt: 0,
    updatedAt: 0,
  },
  profil: {
    _id: "",
    uid: "",
    name: "",
    email: "",
    gender: "",
    password: "",
    createdAt: 0,
    updatedAt: 0,
  },
  count: {
    savingId: "",
    total: 0,
  },
});

function useUser() {
  const router = useRouter();
  function startAuthGoogle() {
    userState.isProgressing = true;
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithRedirect(provider);
  }
  async function startLoginBasic() {
    userState.isProgressing = true;
    const router = useRouter();
    const { success, data } = await apiServices.login(
      JSON.stringify({ email: userState.email, password: userState.password })
    );
    userState.isProgressing = false;
    userState.authSuccess = success;
    if (success) {
      router.push({ path: "/main/dashboard" });
    } else {
    }
  }
  async function getResultFromRedirect() {
    userState.isProgressing = true;
    const router = useRouter();
    const { user, additionalUserInfo } = await auth.getRedirectResult();

    if (user) {
      userState.isProgressing = false;
      if (additionalUserInfo?.isNewUser) {
        const { success, data } = await apiServices.register({
          email: user.email,
          name: user.displayName,
          gender: "laki-laki",
          uid: user.uid,
          password: user.uid,
        });

        userState.authSuccess = success;
        if (success) router.push({ path: "/main/dashboard" });
      } else {
        const { success, data } = await apiServices.login({
          email: user.email,
          password: user.uid,
        });
        userState.authSuccess = success;
        if (success) router.push({ path: "/main/dashboard" });
      }
    } else {
      userState.authSuccess = false;
    }
  }

  function getProfil() {
    getCurrentUser().then(async (user: any) => {
      const { success, data } = await apiServices.getProfil(`${user.uid}`);
      if (success) {
        userState.profil = data[0].user;
        userState.savings = data[0].saving;
        if (data[0].count.length > 0) userState.count = data[0].count[0];
      }
    });
  }

  function signOut() {
    auth.signOut().finally(() => {
      router.push({ path: "/login" });
    });
  }

  return {
    userState,
    startAuthGoogle,
    startLoginBasic,
    getResultFromRedirect,
    getProfil,
    signOut,
  };
}
export { useUser };
