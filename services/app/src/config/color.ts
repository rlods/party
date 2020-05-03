const config = {
	secret: process.env.REACT_APP_COLOR_SECRET || "...",
	url: process.env.REACT_APP_COLOR_URL || "https://color.rlods.xyz/api"
};

// console.debug('[Color] Config', config);

export default config;
