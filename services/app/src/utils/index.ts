export const sleep = (delay: number) =>
	new Promise(resolve => setTimeout(resolve, delay));

export const onlyUnique = <T>(value: T, index: number, self: T[]) =>
	self.indexOf(value) === index;

export const getFromDict = <T>(dict: { [id: string]: T }, id: string) => {
	const value = dict[id];
	return !value ? void 0 : value;
};

export const getFromList = <T extends { id: string }>(
	list: T[],
	id: string
) => {
	return list.find(item => item.id === id);
};

export const getFromDictOrList = <T extends { id: string }>(
	dict: { [id: string]: T },
	list: T[],
	id: string
) => getFromDict(dict, id) || getFromList(list, id);
