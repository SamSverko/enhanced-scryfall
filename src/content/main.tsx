import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/content/App";

const container = document.createElement("div");
container.id = "enhanced-scryfall-app";
document.body.appendChild(container);

createRoot(container).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
