/**
 * env.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all environment variables consumed by the Odoo
 * test suite.  Validates configuration at import-time and exposes typed,
 * trimmed values to the rest of the framework.
 */

const MARKETING_HOSTS = new Set(['odoo.com', 'www.odoo.com']);

function get(key: string, fallback?: string): string {
  const value = process.env[key]?.trim() ?? fallback ?? '';
  return value;
}

function requireNonEmpty(value: string, envKey: string): string {
  if (!value) {
    throw new Error(
      `[env] Required environment variable "${envKey}" is not set.\n` +
        `  Set it before running tests, e.g.:\n` +
        `  $env:${envKey}="your-value"  (PowerShell)\n` +
        `  export ${envKey}="your-value"  (bash/zsh)`,
    );
  }
  return value;
}

// ─── Exported env values ────────────────────────────────────────────────────

export const BASE_URL  = get('ODOO_BASE_URL',  '').replace(/\/$/, '');
export const EMAIL     = get('ODOO_EMAIL',     '');
export const PASSWORD  = get('ODOO_PASSWORD',  '');
export const VENDOR    = get('ODOO_VENDOR',    'Azure Interior');

// ─── Validation helpers ─────────────────────────────────────────────────────

/**
 * Returns a human-readable reason string when the environment is not ready
 * for Odoo tests, or an empty string when everything looks good.
 */
export function getSkipReason(): string {
  if (!BASE_URL || !EMAIL || !PASSWORD) {
    return [
      'Odoo credentials are not fully configured.',
      '  Required environment variables:',
      '    ODOO_BASE_URL  → e.g. https://yourcompany.odoo.com',
      '    ODOO_EMAIL     → login email',
      '    ODOO_PASSWORD  → password',
      '  Optional:',
      '    ODOO_VENDOR    → vendor name already in the DB (default: Azure Interior)',
    ].join('\n');
  }

  try {
    const host = new URL(BASE_URL).hostname;
    if (MARKETING_HOSTS.has(host)) {
      return [
        `ODOO_BASE_URL points to the Odoo marketing site (${host}).`,
        'Automated tests cannot pass Cloudflare Turnstile on the marketing site.',
        'Point ODOO_BASE_URL to your own Odoo tenant, e.g.:',
        '  https://yourcompany.odoo.com',
        '  https://demo.odoo.com  (start a free trial)',
      ].join('\n');
    }
  } catch {
    return `ODOO_BASE_URL "${BASE_URL}" is not a valid URL.`;
  }

  return '';
}

/** Throws if any required variable is missing (use in non-skippable contexts). */
export function requireOdooEnv(): void {
  requireNonEmpty(BASE_URL, 'ODOO_BASE_URL');
  requireNonEmpty(EMAIL,    'ODOO_EMAIL');
  requireNonEmpty(PASSWORD, 'ODOO_PASSWORD');
}
