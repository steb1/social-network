import { suppressHydrationWarning } from "next/data-client";

const HydrationWarningWrapper = ({ children }) => {
	return process.browser ? suppressHydrationWarning(children) : children;
};

export default HydrationWarningWrapper;
