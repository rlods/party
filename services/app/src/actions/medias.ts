import { AxiosError } from "axios";
//
import { createAction, AsyncAction } from ".";
import { Media, MediaAccess, findPreviewTrack } from "../utils/medias";
import { PREVIEW_PLAYER } from "../utils/player";
import { loadNew } from "../utils/providers";

// ------------------------------------------------------------------

export type MediasAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof success>
	| ReturnType<typeof error>
	| ReturnType<typeof resetMedias>
	| ReturnType<typeof setMedias>;

const fetching = () => createAction("medias/FETCHING");
const success = () => createAction("medias/FETCHED");
const error = (error: AxiosError) => createAction("medias/ERROR", error);
const resetMedias = () => createAction("medias/RESET");
export const setMedias = (medias: Media[]) =>
	createAction("medias/SET", medias);

// ------------------------------------------------------------------

export const previewMedia = (access: MediaAccess): AsyncAction => async (
	dispatch,
	getState
) => {
	const {
		medias: { medias: oldMedias }
	} = getState();
	const { newMedias } = await loadNew([access], oldMedias);
	const track = await findPreviewTrack(access, oldMedias, newMedias);
	if (!track) {
		console.debug("Cannot find track to preview...");
		return;
	}
	console.debug("Previewing track...", {
		id: track.id,
		preview: track.preview
	});
	await PREVIEW_PLAYER.play(0, track.id, track.preview, 0);
};
