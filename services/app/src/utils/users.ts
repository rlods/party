import { encode, decode } from "./encoder";

// ------------------------------------------------------------------

export type UserInfo = {
	name: string;
	online: boolean;
	status: string;
	timestamp: number;
};

export type UserAccess = {
	dbId: string;
	userId: string;
	secret: string;
};

// ------------------------------------------------------------------

export const loadUserAccess = (): UserAccess => {
	const res: UserAccess = {
		dbId: "",
		userId: "",
		secret: ""
	};
	const s = localStorage.getItem("U");
	if (s) {
		try {
			const d = decode<UserAccess>(s);
			if (
				typeof d.dbId === "string" &&
				typeof d.userId === "string" &&
				typeof d.secret === "string"
			) {
				res.dbId = d.dbId;
				res.userId = d.userId;
				res.secret = d.secret;
				console.debug("Loaded user access: ", res);
			}
		} catch (err) {
			console.debug("User cannot be loaded: ", err);
			deleteUserAccess();
		}
	}
	return res;
};

export const deleteUserAccess = () => {
	localStorage.removeItem("U");
};

export const saveUserAccess = (access: UserAccess) =>
	localStorage.setItem("U", encode<UserAccess>(access));
