import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    base: "/8th-grade-web-spring-tri/",
    plugins: [react()],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                final_project: resolve(__dirname, "final_project/index.html"),
            },
        },
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
