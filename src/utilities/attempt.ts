/**
 * @description Attempts calling a function and bails if it fails
 * @param {function} func - The function to debounce
 * @return {boolean|Promise<boolean>}
 */

function attempt(func: Function): boolean | Promise<boolean> {
	try {
		const res = func();

		if (res instanceof Promise) {
			return res.then(() => true);
		}

		return true;
	} catch {
		// Bail.
		return false;
	}
};

export default attempt;