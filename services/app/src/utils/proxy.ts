import axios from "axios";
//
import proxyConfig from "../config/proxy";
import { sign } from "./sign";

// ------------------------------------------------------------------

export const callProxy = async (
	path: string,
	params: { [key: string]: string }
) => {
	console.debug("[Proxy] Requesting... ", { path, params });
	return (
		await axios.get(`${proxyConfig.url}${path}`, {
			params: {
				...params,
				s: sign(path, params, proxyConfig.secret)
			}
		})
	).data;
};
