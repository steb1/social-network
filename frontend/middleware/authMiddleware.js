import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AuthMiddleware =
    (handler, serverUrl, isSignInOrSignUpPage = false) =>
    async (req, res) => {
        const cookieStore = cookies();
        const { value: tokenValue } = cookieStore.get("social-network") || {};

        if (!tokenValue) {
            return isSignInOrSignUpPage ? handler(req, res) : redirect("/auth/signin");
        }

        const response = await fetch(serverUrl, {
            method: "GET",
            cache: "no-cache",
            headers: {
                Authorization: tokenValue ? `${tokenValue}` : "",
            },
        });

        return response.status === 200
            ? isSignInOrSignUpPage
                ? redirect("/")
                : handler(req, res)
            : isSignInOrSignUpPage
              ? handler(req, res)
              : redirect("/auth/signin");
    };

export default AuthMiddleware;
