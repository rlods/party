import axios from "axios";
//
import proxyConfig from "../config/proxy";

// ------------------------------------------------------------------

export const callProxy = async (
	path: string,
	params?: { [key: string]: string }
) => {
	console.debug("[Proxy] Requesting... ", { path, params });
	return (await axios.get(`${proxyConfig.baseUrl}${path}`, { params })).data;
};
