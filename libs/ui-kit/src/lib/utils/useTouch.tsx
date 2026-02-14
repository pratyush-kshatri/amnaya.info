'use client';

import { useEffect, useState } from 'react';

function useTouch() {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    return isTouch;
}

export { useTouch };
