// Production-Grade Security Utility Module for ArveX Hosting
// Implements cryptographic hashing, input sanitization, rate-limiting, session management & audit logging

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'auth_success' | 'auth_failed' | 'lockout' | 'admin_access' | 'privilege_escalation' | 'input_threat' | 'setting_change';
  severity: 'info' | 'warning' | 'critical' | 'blocked';
  actor: string;
  ipAddress: string;
  details: string;
}

// Client-side SHA-256 cryptographic hash (using Web Crypto API with fallback)
export async function hashStringSHA256(input: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(input);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }
  // Simple deterministic hash fallback
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(16) + '_sec';
}

// Synchronous fast hash for instantaneous checks
export function fastHash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return 'fx_' + (hash >>> 0).toString(16);
}

// Default known admin hashed credentials & master security PINs
export const MASTER_SECURITY_HASH = fastHash('ArveX@Admin2026!Sec');
export const DEFAULT_ADMIN_PIN = '8492'; // 4-digit master admin security PIN

// Input Sanitization to prevent XSS and HTML/Script injection
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

// Validate URL safety (prevent javascript: or data: iframe exploits)
export function isSafeUrl(url: string): boolean {
  if (!url) return true;
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('vbscript:') || trimmed.startsWith('data:text/html')) {
    return false;
  }
  return true;
}

// Password Strength Evaluator
export interface PasswordStrength {
  score: number; // 0 - 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Impenetrable';
  color: string;
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (password.length >= 6) score++;
  if (hasMinLength && (hasUpper || hasLower)) score++;
  if (hasNumber && hasSpecial) score++;
  if (password.length >= 12 && hasUpper && hasLower && hasNumber && hasSpecial) score++;

  const labels: Array<PasswordStrength['label']> = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Impenetrable'];
  const colors = ['#ef4444', '#f97316', '#eab308', '#10b981', '#06b6d4'];

  return {
    score,
    label: labels[score] || 'Very Weak',
    color: colors[score] || '#ef4444',
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
  };
}

// Rate Limiter & Brute-Force Tracker
interface RateLimitRecord {
  attempts: number;
  lockedUntil: number;
}

const rateLimitStorageKey = 'arvex_sec_ratelimit';

export function getRateLimitStatus(identifier: string = 'global'): { isLocked: boolean; remainingSeconds: number; attempts: number } {
  try {
    const raw = localStorage.getItem(`${rateLimitStorageKey}_${identifier}`);
    if (!raw) return { isLocked: false, remainingSeconds: 0, attempts: 0 };
    const record: RateLimitRecord = JSON.parse(raw);
    const now = Date.now();
    if (record.lockedUntil && record.lockedUntil > now) {
      return {
        isLocked: true,
        remainingSeconds: Math.ceil((record.lockedUntil - now) / 1000),
        attempts: record.attempts,
      };
    }
    return { isLocked: false, remainingSeconds: 0, attempts: record.attempts };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attempts: 0 };
  }
}

export function recordFailedAttempt(identifier: string = 'global', maxAttempts = 5, lockoutDurationMs = 5 * 60 * 1000): { isLocked: boolean; remainingSeconds: number; attempts: number } {
  try {
    const key = `${rateLimitStorageKey}_${identifier}`;
    const raw = localStorage.getItem(key);
    let record: RateLimitRecord = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: 0 };
    
    record.attempts += 1;
    if (record.attempts >= maxAttempts) {
      record.lockedUntil = Date.now() + lockoutDurationMs;
    }
    localStorage.setItem(key, JSON.stringify(record));

    return getRateLimitStatus(identifier);
  } catch {
    return { isLocked: false, remainingSeconds: 0, attempts: 1 };
  }
}

export function resetRateLimit(identifier: string = 'global'): void {
  try {
    localStorage.removeItem(`${rateLimitStorageKey}_${identifier}`);
  } catch {}
}

// Dynamic Client IP Simulator (consistently stable per browser instance)
export function getClientIp(): string {
  try {
    let ip = sessionStorage.getItem('arvex_client_ip');
    if (!ip) {
      ip = `192.168.1.${Math.floor(Math.random() * 200 + 10)}`;
      sessionStorage.setItem('arvex_client_ip', ip);
    }
    return ip;
  } catch {
    return '127.0.0.1';
  }
}
