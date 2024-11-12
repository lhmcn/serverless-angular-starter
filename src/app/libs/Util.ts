/**
 * Gets the substring with a suffix if it's shortened
 * @param text
 * @param length
 * @param suffix
 */
const substr = (
	text: string,
	length: number,
	suffix: string = "...",
): string => {
	if (text.length <= length) {
		return text;
	}

	return text.substring(0, length - suffix.length) + suffix;
};

/**
 * Get the extension of a filename
 * @param filename
 */
const getFileExt = (filename: string): string => {
	if (filename.includes(".")) {
		return filename.split(".").pop() as string;
	}

	return "";
};

/**
 * Checks if one of the user groups has admin privileges
 * @param userGroups
 */
const isAdmin = (userGroups: string[]): boolean => {
	return userGroups?.some((group) =>
		["Root", "Administrators"].includes(group),
	);
};

/**
 * Invokes the callback when the element is visible
 * @param element
 * @param callback
 */
const onVisible = (element: Element, callback: () => void) => {
	const options = {
		root: document.documentElement,
	};

	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.intersectionRatio > 0) {
				callback();
			}
		});
	}, options);

	observer.observe(element);
};

export { substr, getFileExt, isAdmin, onVisible };
