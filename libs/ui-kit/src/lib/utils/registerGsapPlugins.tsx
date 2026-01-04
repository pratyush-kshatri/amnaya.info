/*
    Register GSAP Plugins - Once per Runtime
    Safe - Multiple Calls
*/
import gsap from 'gsap';

let registered = false;

async function registerGsapPlugins() {
    if (registered || typeof window === 'undefined') return;

    try {
        const w = window as any;

        if (w.MorphSVGPlugin) gsap.registerPlugin(w.MorphSVGPlugin);
        else {
            const { MorphSVGPlugin } = await import('gsap/MorphSVGPlugin');
            gsap.registerPlugin(MorphSVGPlugin);
        }

        registered = true;
    } catch (e) {
        console.log('Register-Gsap-Plugin: Registration failed.', e);
    }
}

export { registerGsapPlugins };
/*
Place in Component Function
---------------------------
useEffect(() => { registerGsapPlugins(); }, []);
*/

/*
Place in Client App/providers.tsx
---------------------------------
'use client';

import { useEffect } from 'react';
import { registerGsapPlugins } from '@your/ui/gsap/registerPlugins';

export function Providers({ children }) {
    useEffect(() => { registerGsapPlugins(); }, []);

    return children;
}
*/