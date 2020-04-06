import { AxiosError } from "axios";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { appendInQueue } from "./queue";
import { getFromDictOrList, onlyUnique } from "../utils";
import {
	Media,
	MediaType,
	ProviderType,
	Track,
	Container
} from "../utils/medias";
import { extractErrorMessage } from "../utils/messages";

// ------------------------------------------------------------------

export type MediasAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof success>
	| ReturnType<typeof error>
	| ReturnType<typeof reset>
	| ReturnType<typeof set>;

const fetching = () => createAction("medias/FETCHING");
const success = () => createAction("medias/FETCHED");
const error = (error: AxiosError) => createAction("medias/ERROR", error);
const reset = () => createAction("medias/RESET");
const set = (medias: Media[]) => createAction("medias/SET", medias);

// ------------------------------------------------------------------

export const loadMedias = (
	provider: ProviderType,
	mediaType: MediaType,
	mediaIds: string[],
	enqueue: boolean,
	preview: boolean
): AsyncAction => async (dispatch, getState, { deezer, previewPlayer }) => {
	if (mediaIds.length > 0) {
		const {
			medias: { medias }
		} = getState();
		try {
			if (mediaType === "track") {
				// TRACK
				const { track: oldTracks } = medias;
				const newTrackIds: string[] = mediaIds
					.filter(trackId => !oldTracks[trackId])
					.filter(onlyUnique);
				let newTracks: Track[] = [];
				if (newTrackIds.length > 0) {
					console.debug("Loading tracks...", {
						mediaIds: newTrackIds
					});
					newTracks = await deezer.loadTracks(newTrackIds);
					dispatch(set(newTracks));
				}
				if (enqueue) {
					console.debug("Enqueuing tracks...", { mediaIds });
					dispatch(appendInQueue(provider, mediaIds));
				}
				if (preview) {
					const trackId = mediaIds[0];
					const track = getFromDictOrList(
						oldTracks,
						newTracks,
						trackId
					);
					if (track) {
						console.debug("Previewing track...", {
							track,
							trackId
						});
						await previewPlayer.play(0, track.id, track.preview, 0);
					} else {
						console.debug("Cannot load track to preview...");
					}
				}
			} else {
				// CONTAINERS
				const { [mediaType]: oldContainers } = medias;
				const newContainerIds: string[] = mediaIds
					.filter(containerId => !oldContainers[containerId])
					.filter(onlyUnique);
				let newContainers: Array<Container> = [];
				if (newContainerIds.length > 0) {
					console.debug("Loading containers...", {
						mediaIds: newContainerIds
					});
					newContainers = await deezer.loadContainers(
						mediaType,
						newContainerIds
					);

					const newContainersAndTracks: Media[] = [...newContainers];
					for (const container of newContainers) {
						newContainersAndTracks.push(...container.tracks!);
					}

					dispatch(set(newContainersAndTracks));
				}

				if (enqueue) {
					console.debug("Enqueuing containers tracks...", {
						mediaIds
					});
					for (const containerId of mediaIds) {
						const container = getFromDictOrList<Container>(
							oldContainers,
							newContainers,
							containerId
						);
						if (container) {
							dispatch(
								appendInQueue(
									provider,
									container.tracks!.map(track => track.id)
								)
							);
						}
					}
				}
				if (preview) {
					let track: Track | null = null;
					for (const containerId of mediaIds) {
						const container = getFromDictOrList<Container>(
							oldContainers,
							newContainers,
							containerId
						);
						if (
							container &&
							container.tracks &&
							container.tracks.length > 0
						) {
							track = container.tracks[0];
							break;
						}
					}
					if (track) {
						console.debug("Previewing container first track...");
						await previewPlayer.play(0, track.id, track.preview, 0);
					} else {
						console.debug("Cannot load track to preview...");
					}
				}
			}
		} catch (err) {
			dispatch(displayError(extractErrorMessage(err)));
		}
	}
};
