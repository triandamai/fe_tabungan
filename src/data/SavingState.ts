import { reactive } from "@vue/reactivity";
import { useRouter, useRoute } from "vue-router";
import { getCurrentUser } from "../services/FirebaseServices";
import apiServices from "../services/Services";
import { IDeposit, IFormDeposit } from "../services/Type";
import { useUser } from "./UserState";

interface IDepositState {
  listdeposit: Array<IDeposit>;
  formtabungan: IFormDeposit;
  isLoading: boolean;
  isResultDialog: boolean;
  dialogType: "success" | "failed" | "loading";
}

const depositState = reactive<IDepositState>({
  isLoading: false,
  isResultDialog: false,
  dialogType: "loading",
  listdeposit: [],
  formtabungan: {
    nominal: "",
    description: "",
    receipt: "",
    receiptname: "",
    tabungantype: "",
    filename: "Pilih",
  },
});

function useSaving() {
  /**
   * var
   */
  const router = useRouter();
  const route = useRoute();
  const { userState } = useUser();
  /**
   * action routing
   */
  function gotoHome() {
    router.push({ path: "/main/dashboard" });
  }
  /**
   * utility
   * dialog,move route etc
   */
  function showLoading() {
    depositState.isLoading = true;
    depositState.isResultDialog = false;
  }
  function hideLoading() {
    depositState.isLoading = false;
  }

  function showSuccess() {
    depositState.isLoading = false;
    depositState.isResultDialog = true;
    depositState.dialogType = "success";
  }
  function showFailed() {
    depositState.isLoading = false;
    depositState.isResultDialog = true;
    depositState.dialogType = "failed";
  }
  function dismiss() {
    depositState.isResultDialog = false;
  }
  function isDialogSuccess() {
    return depositState.dialogType == "success";
  }
  function isLoading() {
    return depositState.isLoading;
  }
  function isDialogResult() {
    return depositState.isResultDialog;
  }
  function resetForm() {
    depositState.formtabungan.description = "";
    depositState.formtabungan.filename = "";
    depositState.formtabungan.nominal = "";
    depositState.formtabungan.receiptname = "Pilih file";
    depositState.formtabungan.receipt = null;
  }
  /**
   * manipulate data
   * send data,retrieve data,accept data etc
   */
  async function createSaving() {
    showLoading();
    const { success, data } = await apiServices.createSaving({});

    if (success) {
      hideLoading();
      showSuccess();
      if (data) {
        userState.savings = data[0];
      }
    }
    if (!success) {
      hideLoading();
      showFailed();
    }
  }
  async function joinSaving() {
    const { success, data } = await apiServices.joinSaving({});
    if (success) {
      hideLoading();
      showSuccess();
      if (data) {
        userState.savings = data[0];
      }
    }
    if (!success) {
      hideLoading();
      showFailed();
    }
  }
  async function getAllDeposit() {
    const { success, data } = await apiServices.getMyDeposit(
      `${apiServices.getSaving()}`
    );

    if (success) {
      if (data) {
        depositState.listdeposit = data;
      }
    }
  }
  async function getDepositById() {
    return new Promise(async (resolve) => {
      showLoading();
      const { success, data } = await apiServices.getDepositById(
        `${route.params.id}`
      );

      if (success) {
        hideLoading();
        depositState.formtabungan.nominal = data[0].nominal;
      } else {
        hideLoading();
      }
    });
  }

  async function sendDeposit() {
    if (
      !depositState.formtabungan.nominal &&
      !depositState.formtabungan.description &&
      !depositState.formtabungan.receipt
    )
      return;
    showLoading();
    const user: any = await getCurrentUser();

    hideLoading();

    const { success, data } = await apiServices.createDeposit({});

    if (success) {
      showSuccess();
      resetForm();
    } else {
      depositState.dialogType = "failed";
      showFailed();
    }
  }
  async function acceptDeposit(uid: any, id: any) {
    showLoading();
    const { success, data } = await apiServices.confirmationDeposit("", {});
    hideLoading();
    if (success) {
      showSuccess();
    } else {
      showFailed();
    }
  }
  function sendSpending() {}
  function acceptSpending() {}

  function onImagePicked(e: any) {
    depositState.formtabungan.receipt = e.target.files[0];
    depositState.formtabungan.filename = e.target.files[0].name;
  }

  return {
    getAllDeposit,
    sendDeposit,
    acceptDeposit,
    sendSpending,
    acceptSpending,
    createSaving,
    joinSaving,
    onImagePicked,
    showFailed,
    showSuccess,
    showLoading,
    dismiss,
    isDialogSuccess,
    isLoading,
    isDialogResult,
    gotoHome,
    getDepositById,
    depositState,
  };
}

export { useSaving };
