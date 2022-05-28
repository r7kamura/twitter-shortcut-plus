import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import manifest from "./manifest.json";

export default {
  plugins: [react(), crx({ manifest })],
};
