export const sleep = (delay: number) =>
	new Promise(resolve => setTimeout(resolve, delay));

export const augmentedIndexProcess = (count: number, index: number): number =>
	(index < 0 ? (index % count) + count : index) % count;

export const augmentedArrayIndexAccess = <T>(
	arr: ReadonlyArray<T>,
	index: number
): T => arr[augmentedIndexProcess(arr.length, index)];

export const chunkArray = <T>(arr: ReadonlyArray<T>, chunkSize: number) => {
	const length = arr.length;
	const res: T[][] = [];
	for (let index = 0; index < length; index += chunkSize) {
		res.push(arr.slice(index, index + chunkSize));
	}
	return res;
};
