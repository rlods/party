const config = {
	databaseIDs: (process.env.REACT_APP_DATABASE_ID || "").split("|")
};

console.debug(config);

export default config;
