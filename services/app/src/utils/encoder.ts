export const encode = <T>(data: T) =>
	Buffer.from(JSON.stringify(data)).toString("base64");

export const decode = <T>(data: string) =>
	JSON.parse(Buffer.from(data, "base64").toString("ascii")) as T;
