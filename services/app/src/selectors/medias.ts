import { RootState } from "../reducers";
import { Media, MediaAccess } from "../utils/medias";

// ------------------------------------------------------------------

export const extractMedias = (
	state: RootState,
	mediaAccesses: MediaAccess[]
) => {
	const res: Array<Media | null> = [];
	const {
		medias: { medias }
	} = state;
	for (const mediaAccess of mediaAccesses) {
		const media =
			medias[mediaAccess.provider][mediaAccess.type][mediaAccess.id];
		if (!!media) {
			res.push(media);
		} else {
			res.push(null); // Stiil loading or cannot be loaded or to reload later because of rate limit
		}
	}
	return res;
};
