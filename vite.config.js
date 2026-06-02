import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/8th-grade-web-spring-tri/",
    plugins: [react()],
    build: {
        outDir: "dist",
        emptyOutDir: true,
    },
    server: {
        open: "/",
        port: 5173,
        fs: {
            strict: false,
        },
    },

    resolve: {
        conditions: ["development"],
    },
    optimizeDeps: {
        include: ["fast-deep-equal"],
        exclude: ["@vis.gl/react-google-maps"],
    },
});
