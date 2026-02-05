/*
    Register GSAP Plugins - Once per Runtime
    Safe - Multiple Calls
*/
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { Observer } from 'gsap/Observer';

let registered = false;

async function registerGsapPlugins() {
    if (registered || typeof window === 'undefined') return;

    try {
        const w = window as any;

        if (w.Flip) gsap.registerPlugin(w.Flip);
        else gsap.registerPlugin(Flip);

        if (w.MorphSVGPlugin) gsap.registerPlugin(w.MorphSVGPlugin);
        else gsap.registerPlugin(MorphSVGPlugin);

        if (w.SplitText) gsap.registerPlugin(w.SplitText);
        else gsap.registerPlugin(SplitText);

        if (w.Observer) gsap.registerPlugin(w.Observer);
        else gsap.registerPlugin(Observer);

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