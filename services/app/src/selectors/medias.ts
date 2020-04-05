import { RootState } from "../reducers";
import { Track } from "../utils/medias";

// ------------------------------------------------------------------

export const extractTracks = (state: RootState, trackIds: string[]) => {
  const res: Array<Track | null> = [];
  const {
    medias: {
      medias: { track: tracks },
    },
  } = state;
  for (const trackId of trackIds) {
    const track = tracks[trackId];
    if (!!track) {
      res.push(track);
    } else {
      res.push(null); // Stiil loading or cannot be loaded or to reload later because of rate limit
    }
  }
  return res;
};
