import { RootState } from "../reducers";
import { Track } from "../utils/medias";

// ------------------------------------------------------------------

export const selectTracks = (state: RootState): Array<Track | null> => {
	const res: Array<Track | null> = [];
	const {
		medias: { medias },
		room: { tracks }
	} = state;
	for (const access of tracks) {
		const track = medias[access.provider][access.type][access.id];
		if (!!track) {
			res.push(track);
		} else {
			res.push(null); // Stiil loading or cannot be loaded or to reload later because of rate limit
		}
	}
	return res;
};
