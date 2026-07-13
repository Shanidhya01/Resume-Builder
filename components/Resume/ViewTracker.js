'use client';

import { useEffect, useRef } from 'react';

// Invisible: fires a single rate-limited view-count POST per page load.
// Kept as its own tiny client island so the rest of the public page can stay
// a server component (better SEO/initial paint, smaller client JS).
const ViewTracker = ({ slug }) => {
    const firedRef = useRef(false);

    useEffect(() => {
        if (firedRef.current) return;
        firedRef.current = true;

        fetch('/api/public/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug }),
        }).catch(() => {});
    }, [slug]);

    return null;
};

export default ViewTracker;
