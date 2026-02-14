'use client';

import { registerGsapPlugins } from "@amnaya.info/ui-kit";
import { useEffect } from "react";

function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => { registerGsapPlugins() }, []);

    return children;
}

export { Providers };