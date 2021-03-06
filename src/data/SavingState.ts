import { reactive } from "@vue/reactivity";
import { useRouter, useRoute } from "vue-router";
import { getCurrentUser, uploadReceipt } from "../services/FirebaseServices";
import apiServices from "../services/Services";
import { ICurrentUser, IDeposit, IFormDeposit } from "../services/Type";
import { useUser } from "./UserState";

interface IDepositState {
  listdeposit: Array<IDeposit>;
  formtabungan: IFormDeposit;
  isLoading: boolean;
  isResultDialog: boolean;
  dialogType: "success" | "failed" | "loading";
  codeSaving: string;
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
  codeSaving: "",
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
    const user: ICurrentUser = await getCurrentUser();
    const { success, data } = await apiServices.createSaving({
      userId: user.uid,
      savingId: user.uid,
      description: "New Saving",
      createdBy: user.uid,
    });

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
    const user: ICurrentUser = await getCurrentUser();
    const { success, data } = await apiServices.joinSaving({
      savingId: depositState.codeSaving,
      ownerId: depositState.codeSaving,
      userId: user.uid,
    });
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
    const filename = `${Date.now()}.jpg`;
    uploadReceipt({
      file: depositState.formtabungan.receipt,
      filename: filename,
    })
      .then(async (receipt) => {
        const user: ICurrentUser = await getCurrentUser();
        const { success, data } = await apiServices.createDeposit({
          sender: user.uid,
          savingId: userState.savings.savingId,
          nominal: depositState.formtabungan.nominal,
          receipt: `${receipt}`,
          accepted: "",
          type: "deposit",
          receiptname: filename,
          description: depositState.formtabungan.description,
        });

        if (success) {
          hideLoading();
          showSuccess();
          resetForm();
        } else {
          hideLoading();

          showFailed();
        }
      })
      .catch(() => {
        hideLoading();
        showFailed();
      });
  }
  async function updateDeposit(id: string) {
    if (
      !depositState.formtabungan.nominal &&
      !depositState.formtabungan.description &&
      !depositState.formtabungan.receipt
    )
      return;
    showLoading();
    uploadReceipt({
      file: depositState.formtabungan.receipt,
      filename: depositState.formtabungan.filename,
    })
      .then(async (receipt) => {
        const user: ICurrentUser = await getCurrentUser();
        const { success, data } = await apiServices.changeDeposit(id, {
          sender: user.uid,
          savingId: userState.savings.savingId,
          nominal: depositState.formtabungan.nominal,
          receipt: `${receipt}`,
          accepted: "",
          type: "deposit",
          receiptname: depositState.formtabungan.receiptname,
          description: depositState.formtabungan.description,
        });

        if (success) {
          hideLoading();
          showSuccess();
          resetForm();
        } else {
          hideLoading();

          showFailed();
        }
      })
      .catch(() => {
        hideLoading();
        showFailed();
      });
  }

  async function acceptDeposit(id: any) {
    showLoading();
    const user: ICurrentUser = await getCurrentUser();
    const { success, data } = await apiServices.confirmationDeposit(
      id,
      `${user.uid}`
    );
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
