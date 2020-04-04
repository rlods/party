import { RootState } from "../reducers";
import { ApiTrack } from "../utils/deezer";

export const extractTracks = (state: RootState, trackIds: string[]) => {
  const res: Array<ApiTrack> = [];
  const {
    tracks: { tracks }
  } = state;
  for (const trackId of trackIds) {
    const track = tracks[trackId];
    if (!!track) {
      res.push(track);
    }
  }
  return res;
};
