import { createCookieSessionStorage } from "react-router";

type FlashData = {
    message?: string;
    errorMessage?: string;
}

type SessionFlashData = {
    flashData : FlashData
};

const { getSession, commitSession, destroySession } =
    createCookieSessionStorage<any, SessionFlashData>(
        {
            // a Cookie from `createCookie` or the CookieOptions to create one
            cookie: {
                name: "__session",
                httpOnly: true,
                maxAge: 60,
                path: "/",
                sameSite: "lax",
                secrets: ["ferrylinton"],
                secure: false,
            },
        }
    );

export { getSession, commitSession, destroySession };