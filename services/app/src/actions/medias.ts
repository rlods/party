import { AsyncAction } from ".";
import { MediaAccess, findPreview } from "../utils/medias";
import { PREVIEW_PLAYER } from "../utils/player";
import { loadNew } from "../utils/providers";
import { displayError } from "./messages";
import { extractErrorMessage } from "../utils/messages";

// ------------------------------------------------------------------

export const previewMedia = (access: MediaAccess): AsyncAction => async (
	dispatch,
	getState
) => {
	try {
		const {
			medias: { medias: oldMedias }
		} = getState();
		const { newMedias } = await loadNew([access], oldMedias);
		const track = findPreview(access, oldMedias, newMedias);
		if (!track) {
			throw new Error("[Medias] Cannot find track to preview...");
		}
		console.debug("[Medias] Previewing track...", { track });
		await PREVIEW_PLAYER.play(0, track.id, track.preview, 0);
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};
