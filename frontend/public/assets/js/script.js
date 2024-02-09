// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (typeof localStorage !== "undefined" && (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches))) {
	// Check if running in a browser environment
	if (typeof window !== "undefined" && typeof document !== "undefined") {
		// On page load or when changing themes, best to add inline in `head` to avoid FOUC
		if (typeof localStorage !== "undefined" && (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches))) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}
}
// Whenever the user explicitly chooses light mode
if (typeof localStorage !== "undefined") localStorage.theme = "light";

// Whenever the user explicitly chooses dark mode
if (typeof localStorage !== "undefined") localStorage.theme = "dark";

// Whenever the user explicitly chooses to respect the OS preference
if (typeof localStorage !== "undefined") localStorage.removeItem("theme");
