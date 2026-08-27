export {};

declare global {
  interface Window {
    ArveXCMS?: {
      syncAll?: () => Promise<boolean>;
      clearSession?: () => void;
    };
  }
}
