import * as firebase from "firebase/app";
import "firebase/database";
//
import firebaseConfig from "../../config/firebase";

// ------------------------------------------------------------------

const APPS: {
	[id: string]: {
		app: firebase.app.App;
		database: firebase.database.Database;
		rooms: firebase.database.Reference;
		users: firebase.database.Reference;
	};
} = {};

export const createOrGetApp = (dbId: string) => {
	let res = APPS[dbId];
	if (!res) {
		console.debug("[Firebase] Creating app", { dbId });
		const databaseURL = `https://${firebaseConfig.dbPrefix}${dbId}.firebaseio.com`;
		const app = firebase.initializeApp({ databaseURL }, dbId);
		const database = firebase.database(app);
		APPS[dbId] = res = {
			app,
			database,
			rooms: database.ref("rooms"),
			users: database.ref("users")
		};
	}
	return res;
};
