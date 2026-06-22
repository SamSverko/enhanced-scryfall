import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
    action: {
        default_icon: {
            48: "public/logo.png",
        },
        default_popup: "src/popup/index.html",
    },
    content_scripts: [
        {
            js: ["src/content/main.tsx"],
            matches: ["https://scryfall.com/*"],
        },
    ],
    description: "Scryfall is awesome. This makes it even better.",
    host_permissions: ["https://scryfall.com/*"],
    icons: {
        48: "public/logo.png",
    },
    manifest_version: 3,
    name: "Enhanced Scryfall",
    permissions: ["contentSettings", "storage"],
    version: pkg.version,
});
