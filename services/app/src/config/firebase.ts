const config = {
	appIDs: (process.env.REACT_APP_DATABASE_ID || "").split("|")
};

// console.debug('[Firebase] Config', config);

export default config;
