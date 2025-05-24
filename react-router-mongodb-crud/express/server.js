const compression = require("compression");
const express = require('express')
const morgan = require("morgan");

if (typeof crypto === "undefined") {
    const crypto = require('crypto').webcrypto;
    globalThis.crypto = crypto;
}

// Short-circuit the type-checking of the built output.
const BUILD_PATH = "./server/index.js";
const PORT = Number.parseInt(process.env.PORT || "3000");

const startApp = async () => {
    app.use(
        "/assets",
        express.static("client/assets", { immutable: true, maxAge: "1y" })
    );
    app.use(express.static("client", { maxAge: "1h" }));
    app.use(await import(BUILD_PATH).then((mod) => mod.app));
}

const app = express();

app.use(compression());
app.disable("x-powered-by");

startApp();

app.use(morgan("tiny"));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
