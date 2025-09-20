import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const allowedHostsEnv = process.env.VITE_ALLOWED_HOSTS ?? "";
const allowedHosts = allowedHostsEnv
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: allowedHosts.length ? allowedHosts : true,
  },
});
