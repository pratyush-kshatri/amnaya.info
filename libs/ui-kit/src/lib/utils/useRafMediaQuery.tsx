/*
    rAF (request Animation Frame) Media Query
    Prevents Layout Thrashing by Media Queries
*/
'use client';

import { useCallback, useEffect, useRef, useState } from "react";

const useRafMediaQuery= (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false);
    const mediaQueryRef = useRef<MediaQueryList | null>(null);
    const rafIdRef = useRef<number | null>(null);

    const updateMedia = useCallback(() => {
        if (mediaQueryRef.current) setIsMobile(mediaQueryRef.current.matches);

        rafIdRef.current = null;
    }, []);

    const updateState = useCallback(() => {
        // Throttle until rAF Frame
        if (rafIdRef.current === null) rafIdRef.current = requestAnimationFrame(updateMedia);
    }, [updateMedia]);

    useEffect(() => {
        mediaQueryRef.current = window.matchMedia(`(max-width: ${breakpoint}px)`);

        // Initial State
        setIsMobile(mediaQueryRef.current.matches)

        const mediaQuery = mediaQueryRef.current;

        // Breakpoint Change
        mediaQuery.addEventListener('change', updateState);

        return () => {
            mediaQuery.removeEventListener('change', updateState);
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        }
    }, [updateState, breakpoint]);

    return { isMobile };
};

export { useRafMediaQuery };