package main

type DeezerSearchResults struct {
	Album []Album `json:"album,omitempty"`
	Playlist []Playlist `json:"playlist,omitempty"`
	Track []Track `json:"track,omitempty"`
}

type SearchResults struct {
	Deezer DeezerSearchResults `json:"deezer,omitempty"`
}

func loadMedias(accesses []MediaAccess) []interface{} {
	albumIDs := make([]string, 0, len(accesses))
	playlistIDs := make([]string, 0, len(accesses))
	trackIDs := make([]string, 0, len(accesses))

	for _, access := range accesses {
		switch access.Type {
		case "album":
			albumIDs = append(albumIDs, access.ID)
		case "playlist":
			playlistIDs = append(playlistIDs, access.ID)
		case "track":
			trackIDs = append(trackIDs, access.ID)
		}
	}

	albumsCh, playlistsCh, tracksCh := loadAlbums(albumIDs), loadPlaylists(playlistIDs), loadTracks(trackIDs)
	albums, playlists, tracks := <-albumsCh, <-playlistsCh, <-tracksCh

	mixed := []interface{} {}
	for _, album := range albums {
		mixed = append(mixed, album)
	}
	for _, playlist := range playlists {
		mixed = append(mixed, playlist)
	}
	for _, track := range tracks {
		mixed = append(mixed, track)
	}

	return mixed
}

func searchMedias(query string, limit int) SearchResults {
	albumsCh, playlistsCh, tracksCh := searchDeezerAlbums(query, limit), searchDeezerPlaylists(query, limit), searchDeezerTracks(query, limit)
	albums, playlists, tracks := <-albumsCh, <-playlistsCh, <-tracksCh

	return SearchResults {
		Deezer: DeezerSearchResults {
			Album: albums,
			Playlist: playlists,
			Track: tracks,
		},
	}
}
