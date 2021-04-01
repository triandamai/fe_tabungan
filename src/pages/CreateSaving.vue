<template>
  <section
    class="h-full w-full border-box transition-all duration-500 linear"
    style="background-color: #232130"
  >
    <div style="font-family: 'Poppins', sans-serif">
      <div class="flex flex-col items-center h-full lg:flex-row">
        <div class="relative hidden lg:block h-full width-left-empty-3-6">
          <img
            class="absolute object-fill centered-empty-3-6"
            src="http://api.elements.buildwithangga.com/storage/files/2/assets/Empty%20State/EmptyState3/Empty-3-6.png"
            alt=""
          />
        </div>
        <div
          class="flex w-full h-full px-8 width-right-empty-3-6 sm:px-16 py-32 lg:mx-0 mx-auto items-left justify-left"
          style="background-color: #211f2d"
        >
          <div
            class="w-full sm:w-7/12 md:w-8/12 lg:w-9/12 xl:w-7/12 mx-auto lg:mx-0"
          >
            <div class="items-center justify-center lg:hidden flex">
              <img
                src="http://api.elements.buildwithangga.com/storage/files/2/assets/Empty%20State/EmptyState3/Empty-3-6.png"
                alt=""
              />
            </div>
            <h3 class="text-3xl font-semibold mb-3" style="color: #d8d7df">
              Bikin rencana
            </h3>
            <p class="leading-7 text-sm" style="color: #737182">
              Ehm.. ternyata kamu belum bikin rencana tabungan<br />
              sekarang bikin yuk.
            </p>
            <form class="mt-6" @submit.prevent="sendDeposit">
              <div class="mb-7">
                <label class="block text-lg font-medium" style="color: #d8d7df"
                  >Gabung
                </label>
                <div
                  class="flex w-full px-5 py-4 mt-3 text-base font-light rounded-xl input-empty-3-6"
                >
                  <svg
                    class="mr-4 icon-empty-3-6"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                      fill="#4E4B62"
                    />
                  </svg>
                  <input
                    type="text"
                    v-model="depositState.formtabungan.description"
                    placeholder="Kode tabungan"
                    class="w-full focus:outline-none text-base font-light"
                    autocomplete
                    required
                    style="background-color: #252332"
                  />
                </div>
              </div>

              <div class="flex">
                <button
                  type="submit"
                  class="mr-2 btn-fill-empty-3-6 block w-full px-4 py-3 mt-9 font-medium text-xl text-white transition duration-500 ease-in-out transform rounded-xl hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
                >
                  Gabung
                </button>
                <button
                  class="ml-2 block border-gray-500 border-1 w-full px-4 py-3 mt-9 font-medium text-xl text-white transition duration-500 ease-in-out transform rounded-xl hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
                >
                  Bikin baru
                </button>
              </div>
            </form>

            <p class="mt-8 text-center text-sm" style="color: #737182">
              Masih bingung ?
              <a
                href="https://api.whatsapp.com/send?phone=6281226809435"
                class="font-medium hover:underline"
                style="color: #2ec49c"
                >Tanya pembuatnya</a
              >
            </p>
            <button
              @click="gotoHome()"
              class="block border-gray-500 border-1 w-full px-4 py-3 mt-9 font-medium text-xl text-white transition duration-500 ease-in-out transform rounded-xl hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
            >
              Nanti aja
            </button>
          </div>
        </div>
      </div>
    </div>
    <base-dialog
      :show="isLoading()"
      :dissmisable="false"
      @onDismis="hideLoading()"
      ><dialog-loading
    /></base-dialog>
    <base-dialog
      :show="isDialogResult()"
      :dissmisable="true"
      @onDismis="dismiss()"
    >
      <dialog-result
        v-if="isDialogSuccess()"
        :title="'Yeeey...'"
        :message="' Bagus! kamu berhasil nabung nih,mau nabung lagi ?'"
        :positive="'Oke nabung lagi'"
        :negative="'Engga Besok lagi'"
        @onPositive="dismiss()"
        @onNegative="gotoHome()"
        ><div>
          <icon-success /></div
      ></dialog-result>
      <dialog-result
        v-else
        :title="'Yaah..'"
        :message="'Gagal simpan tabugan nih..Hal kaya gini normal sih bisanya si server lagi cape..'"
        :positive="'Oke Coba lagi'"
        :negative="'Yaudah kembali'"
        @onPositive="dismiss()"
        @onNegative="gotoHome()"
        ><div>
          <icon-failed /></div
      ></dialog-result>
    </base-dialog>
  </section>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useTabungan } from "../data/SavingState";

import BaseDialog from "../components/DialogBase.vue";
import DialogResult from "../components/DialogResult.vue";
import IconSuccess from "../components/icon/Transfer.vue";
import IconFailed from "../components/icon/NotFound.vue";
import DialogLoading from "../components/DialogLoading.vue";
export default defineComponent({
  components: {
    BaseDialog,
    DialogResult,
    DialogLoading,
    IconSuccess,
    IconFailed,
  },
  setup() {
    return {
      ...useTabungan(),
    };
  },
});
</script>
<style scoped>
.inputFile {
  opacity: 0;
}
</style>
