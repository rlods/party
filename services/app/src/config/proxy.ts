const config = {
	secret: process.env.REACT_APP_PROXY_SECRET || "",
	url: process.env.REACT_APP_PROXY_URL || ""
};

// console.debug('[Proxy] Config', config);

export default config;
