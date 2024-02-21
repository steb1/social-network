import { useRouter } from "next/navigation";

export async function checkAuth() {
    router = useRouter();
    const cookieStore = cookies();
    const token = cookieStore.get("social-network") ?? "";
    console.log(token);
    if (token != "") {
        try {
            const response = await fetch(`${config.serverApiUrl}checkAuth`, {
                method: "GET",
                headers: {
                    Authorization: token.value,
                },
            });
            if (response.status === 401) {
                cookies().delete("social-network");
                return false;
            }
            if (response.ok) {
                user = await response.json();
                return true;
            } else {
                return false;
            }
        } catch {
            return false;
        }
    }
    return false;
}
