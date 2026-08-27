export {};

declare global {
  interface Window {
    ArveXCMS?: {
      syncAll?: () => Promise<boolean>;
      clearSession?: () => void;
    };
  }

  type SecuritySettings = {
    twoFactorRequiredForAdmin: boolean;
    bruteForceProtection: boolean;
    maxLoginAttempts: number;
    lockoutDurationMinutes: number;
    sessionTimeoutMinutes: number;
    ipWhitelistEnabled: boolean;
    whitelistedIps: string[];
    blacklistedIps: string[];
    ddosMitigationLevel: string;
    sslTlsEnforced: boolean;
    hstsEnabled: boolean;
    contentSecurityPolicy: boolean;
    wafEnabled: boolean;
    masterSecurityPin: string;
  };
}
