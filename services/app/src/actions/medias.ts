import { AsyncAction, trySomething } from ".";
import { MediaAccess, findPreview, Media } from "../utils/medias";
import { PREVIEW_PLAYER } from "../utils/player";
import { loadNewMedias } from "../utils/providers";
import { displayMessage } from "./messages";
import { renderMediaInToaster } from "../components/Room/Medias";

// ------------------------------------------------------------------

export const displayMediaInfo = (media: Media): AsyncAction => dispatch =>
	dispatch(
		displayMessage("info", {
			duration: 5000,
			extra: () => renderMediaInToaster(media)
		})
	);

// ------------------------------------------------------------------

export const previewMedia = (access: MediaAccess): AsyncAction => (
	dispatch,
	getState
) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					medias: { medias: oldMedias }
				} = getState();
				const { newMedias } = await loadNewMedias([access], oldMedias);
				const track = findPreview(access, oldMedias, newMedias);
				if (!track) {
					throw new Error("[Medias] Cannot find track to preview...");
				}
				console.debug("[Medias] Previewing track...", { track });
				await PREVIEW_PLAYER.play(0, track.id, track.preview, 0);
				return true;
			}
		})
	);
