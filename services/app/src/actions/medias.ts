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
		trySomething(async () => {
			const {
				medias: { data: medias }
			} = getState();
			const track = findPreview(
				access,
				medias,
				await loadNewMedias([access], medias)
			);
			if (!track) {
				throw new Error("medias.errors.no_preview");
			}
			console.debug("[Medias] Previewing track...", { track });
			await PREVIEW_PLAYER.play(0, track.id, track.preview, 0);
			return true;
		})
	);
