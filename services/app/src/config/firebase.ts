const config = {
	dbIDs: (process.env.REACT_APP_DATABASE_IDS || "").split("|"),
	dbPrefix: process.env.REACT_APP_DATABASE_PREFIX || ""
};

export const DEFAULT_ROOM_DATABASE_ID = config.dbIDs[0];
export const DEFAULT_USER_DATABASE_ID = config.dbIDs[0];

// console.debug('[Firebase] Config', config);

export default config;
