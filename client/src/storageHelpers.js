// src/storageHelpers.js
export const EMAILS_KEY = "emails";
export const CLASSIFIED_EMAILS_KEY = "classifiedEmails";
export const EMAILS_META_KEY = "emailsMeta";

/** Save fetched emails and timestamp */
export function saveEmails(emails) {
  localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
  localStorage.setItem(
    EMAILS_META_KEY,
    JSON.stringify({ lastFetched: Date.now(), count: emails.length })
  );
  // Clear old classification cache (since new data fetched)
  localStorage.removeItem(CLASSIFIED_EMAILS_KEY);
}

/** Load previously stored emails */
export function getStoredEmails() {
  try {
    const emails = localStorage.getItem(EMAILS_KEY);
    return emails ? JSON.parse(emails) : [];
  } catch {
    return [];
  }
}

/** Save classified emails */
export function saveClassifiedEmails(classified) {
  localStorage.setItem(CLASSIFIED_EMAILS_KEY, JSON.stringify(classified));
}

/** Load classified emails (if any) */
export function getClassifiedEmails() {
  try {
    const data = localStorage.getItem(CLASSIFIED_EMAILS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Clear everything when fetching new emails */
export function clearEmailCache() {
  localStorage.removeItem(EMAILS_KEY);
  localStorage.removeItem(EMAILS_META_KEY);
  localStorage.removeItem(CLASSIFIED_EMAILS_KEY);
}
