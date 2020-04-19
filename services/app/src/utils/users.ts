import { encode, decode } from "./encoder";

export type UserInfo = {
	name: string;
	online: boolean;
	room_id: string;
	status: string;
	timestamp: number;
};

export type UserAccess = {
	id: string;
	secret: string;
};

// ------------------------------------------------------------------

export const loadUserAccess = (): UserAccess => {
	const res: UserAccess = {
		id: "",
		secret: ""
	};
	const s = localStorage.getItem("U");
	if (s) {
		try {
			const d = decode<UserAccess>(s);
			if (typeof d.id === "string" && typeof d.secret === "string") {
				res.id = d.id;
				res.secret = d.secret;
				console.debug("Loaded user access: ", res);
			}
		} catch (err) {}
	}
	return res;
};

export const deleteUserAccess = () => {
	localStorage.removeItem("U");
};

export const saveUserAccess = ({ id, secret }: UserAccess) => {
	localStorage.setItem(
		"U",
		encode({
			id,
			secret
		})
	);
};
