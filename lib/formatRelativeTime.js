/**
 * Formats a Firestore Timestamp as a short relative time string ("5m ago").
 * Shared by ResumeCard and the Share dialog so both agree on the same text.
 */
export function formatRelativeTime(timestamp) {
    if (!timestamp?.toMillis) return 'Unknown';
    const diffMs = Date.now() - timestamp.toMillis();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.round(diffHr / 24);
    return `${diffDay}d ago`;
}

export default formatRelativeTime;
