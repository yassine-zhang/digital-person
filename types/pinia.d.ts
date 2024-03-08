import { DefineSetupStoreOptions } from "pinia";

interface CustomOptions {
  persist: {
    enabled: boolean;
    strategies: any;
  };
}

declare module "pinia" {
  interface DefineSetupStoreOptions extends CustomOptions {}
}