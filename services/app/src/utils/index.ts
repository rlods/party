export const sleep = (delay: number): Promise<void> =>
	new Promise(resolve => setTimeout(resolve, delay));

export const augmentedIndexProcess = (count: number, index: number): number =>
	(index < 0 ? (index % count) + count : index) % count;

export const augmentedArrayIndexAccess = <T>(
	arr: ReadonlyArray<T>,
	index: number
): T => arr[augmentedIndexProcess(arr.length, index)];

export const chunkArray = <T>(
	arr: ReadonlyArray<T>,
	chunkSize: number
): T[][] => {
	const length = arr.length;
	const res: T[][] = [];
	for (let index = 0; index < length; index += chunkSize) {
		res.push(arr.slice(index, index + chunkSize));
	}
	return res;
};

export const unifyArrayPreserveOrder = <T>(arr: ReadonlyArray<T>): T[] =>
	arr.filter((value, index) => arr.indexOf(value) === index);

export const unifyArrayPreserveOrderPred = <T>(
	arr: ReadonlyArray<T>,
	predicate: (value1: T, value2: T) => boolean
): T[] =>
	arr.filter(
		(value, index) =>
			arr.findIndex(other => predicate(value, other)) === index
	);
