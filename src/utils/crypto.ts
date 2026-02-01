const encoder = new TextEncoder();
const PASSWORD_PREFIX = 'pbkdf2';
const DEFAULT_ITERATIONS = 120000;
const SALT_BYTES = 16;
const DERIVED_KEY_BYTES = 32;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

async function sha256Hex(input: string): Promise<string> {
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(hashBuffer));
}

function isLegacySha256(hash: string): boolean {
  return /^[a-f0-9]{64}$/i.test(hash);
}

async function deriveKey(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations,
    },
    keyMaterial,
    DERIVED_KEY_BYTES * 8
  );
  return new Uint8Array(derivedBits);
}

/**
 * Hash password for storage using PBKDF2 with per-user salt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const derivedKey = await deriveKey(password, salt, DEFAULT_ITERATIONS);
  return `${PASSWORD_PREFIX}$${DEFAULT_ITERATIONS}$${bytesToBase64(salt)}$${bytesToBase64(derivedKey)}`;
}

/**
 * Verify password against hash. If legacy SHA-256 is detected, returns an upgraded hash.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<{ valid: boolean; upgradedHash?: string }> {
  if (!storedHash) {
    return { valid: false };
  }

  if (storedHash.startsWith(`${PASSWORD_PREFIX}$`)) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) {
      return { valid: false };
    }
    const iterations = Number.parseInt(parts[1], 10);
    if (!Number.isFinite(iterations) || iterations < 10000) {
      return { valid: false };
    }
    const salt = base64ToBytes(parts[2]);
    const expected = base64ToBytes(parts[3]);
    const derived = await deriveKey(password, salt, iterations);
    return { valid: constantTimeEqual(derived, expected) };
  }

  if (isLegacySha256(storedHash)) {
    const legacyHash = await sha256Hex(password);
    if (legacyHash === storedHash) {
      return { valid: true, upgradedHash: await hashPassword(password) };
    }
  }

  return { valid: false };
}

/**
 * Validate password strength for new passwords
 */
export type PasswordValidation =
  | { valid: true }
  | { valid: false; message: string };

export function validatePassword(password: string): PasswordValidation {
  if (password.length < 10) {
    return { valid: false, message: 'Password must be at least 10 characters long.' };
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return { valid: false, message: 'Password must include at least one letter and one number.' };
  }
  return { valid: true };
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * Normalize email for consistent hashing/comparisons
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Hash email for storage (privacy-friendly)
 */
export async function hashEmail(email: string): Promise<string> {
  return sha256Hex(normalizeEmail(email));
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return emailRegex.test(normalizeEmail(email));
}

/**
 * Rate limiting utility
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Filter out old attempts
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    this.attempts.set(key, recentAttempts);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  getRetryAfterMs(key: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    if (recentAttempts.length < this.maxAttempts) {
      return 0;
    }
    const oldest = Math.min(...recentAttempts);
    return Math.max(this.windowMs - (now - oldest), 0);
  }
}

export const formRateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute
export const loginRateLimiter = new RateLimiter(3, 300000); // 3 attempts per 5 minutes
