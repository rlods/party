export const sleep = (delay: number) =>
	new Promise(resolve => setTimeout(resolve, delay));

export const augmentedArrayIndexAccess = <T>(arr: T[], idx: number): T =>
	arr[(idx < 0 ? (idx % arr.length) + arr.length : idx) % arr.length];
