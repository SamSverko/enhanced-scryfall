import { useEffect } from "react";

import { initOverlay, refreshOverlay } from "@/content/overlay";
import "@/content/overlay.css";

type OverlayMessage = { type: "REFRESH_OWNED" };

function App() {
    useEffect(() => {
        initOverlay();

        const listener = (message: OverlayMessage) => {
            if (message.type === "REFRESH_OWNED") {
                refreshOverlay().catch(console.error);
            }
        };

        chrome.runtime.onMessage.addListener(listener);

        return () => {
            chrome.runtime.onMessage.removeListener(listener);
        };
    }, []);

    return null;
}

export default App;
