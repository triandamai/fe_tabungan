<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="showModal"
        ref="modal-backdrop"
        class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
      >
        <div
          class="flex items-start justify-center min-h-screen pt-24 text-center"
        >
          <div
            class="bg-gray-900 rounded-md text-left overflow-hidden shadow-xl p-2 w-2/2 mx-2"
            role="dialog"
            ref="modal"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <button class="absolute top-4 right-4">
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <slot>Ini kosongan</slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import useClickOutside from "../composables/useClickOutside";

export default defineComponent({
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    dissmisable: {
      type: Boolean,
      default: true,
    },
  },
  emits: {
    onDismis: (payload: any) => {
      return payload;
    },
  },
  setup(props, { emit }) {
    const showModal = ref(false);
    const modal = ref(null);
    const { onClickOutside } = useClickOutside();
    function closeModal() {
      if (props.dissmisable) {
        showModal.value = false;
        emit("onDismis", true);
      }
    }
    onClickOutside(modal, () => {
      if (showModal.value == true) {
        closeModal();
      }
    });
    watch(
      () => props.show,
      (show) => {
        showModal.value = show;
      }
    );

    return {
      showModal,
      closeModal,
      modal,
    };
  },
});
</script>
