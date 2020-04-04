import { RootState } from "../reducers";
import { Track } from "../utils/medias";

export const extractTracks = (state: RootState, trackIds: string[]) => {
  const res: Track[] = [];
  const {
    tracks: { tracks },
  } = state;
  for (const trackId of trackIds) {
    const track = tracks[trackId];
    if (!!track) {
      res.push(track);
    }
  }
  return res;
};
