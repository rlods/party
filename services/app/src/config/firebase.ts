const config = {
	dbIDs: (process.env.REACT_APP_DATABASE_IDS || "").split(","),
	dbPrefix: process.env.REACT_APP_DATABASE_PREFIX || ""
};

export const selectRoomDatabaseId = () =>
	config.dbIDs[Math.floor(Math.random() * config.dbIDs.length)];

export const selectUserDatabaseId = () => config.dbIDs[0];

// console.debug("[Firebase] Config", config);

export default config;
