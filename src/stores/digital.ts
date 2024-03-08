import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useDigitalStore = defineStore("digital", () => {
  const nounExist = ref(false);
  const oneselfContent = ref<string[]>([
    '欢迎欢迎，现在开始愉快的玩耍吧！',
    '首次录音需要获取录音权限。',
  ]);

  return { nounExist, oneselfContent };
}, {
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, key: "digital" }],
  }
});
