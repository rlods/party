export const sleep = (delay: number) =>
	new Promise(resolve => setTimeout(resolve, delay));

export const augmentedArrayIndexAccess = <T>(arr: T[], idx: number): T =>
	arr[(idx < 0 ? (idx % arr.length) + arr.length : idx) % arr.length];

export const chunkArray = <T>(arr: T[], chunkSize: number) => {
	const length = arr.length;
	const res: T[][] = [];
	for (let index = 0; index < length; index += chunkSize) {
		res.push(arr.slice(index, index + chunkSize));
	}
	return res;
};
