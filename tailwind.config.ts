import { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx}",
        "./src/styles/**/*.css"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

export default config;