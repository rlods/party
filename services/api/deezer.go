package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
)

// ------------------------------------------------------------------

const API_BASE = "https://api.deezer.com";
const WWW_BASE = "https://www.deezer.com";

// ------------------------------------------------------------------

func callDeezer(url string) []byte {
	log.Printf("DEBUG - callDeezer: %s", url)

	res, err1 := http.Get(url)
	if err1 != nil {
		log.Fatal(err1)
	}
	defer res.Body.Close()

	body, err2 := ioutil.ReadAll(res.Body)
	if err2 != nil {
		log.Fatal(err2)
	}
	return body
}

type InitFunc func(length int) interface{}
type AppendFunc func(container interface{}, data []byte) interface{}

func loadDeezer(mediaType string, ids []string, init InitFunc, append AppendFunc) interface{} {
	channels := make([]interface{}, len(ids))
    for index, id := range ids {
		channels[index] = make(chan []byte)
		go func() {
			channels[index].(chan []byte) <- callDeezer(fmt.Sprintf("%s/%s/%s", API_BASE, mediaType, id))
		}()
	}
	medias := init(len(ids))
    for index, _ := range ids {
		medias = append(medias, <-channels[index].(chan []byte))
	}
	return medias
}


func searchDeezer(mediaType string, query string, limit int) []byte {
	return callDeezer(fmt.Sprintf("%s/search/%s?q=%s&limit=%d", API_BASE, mediaType, query, limit))
}

// ------------------------------------------------------------------

type DeezerApiError struct {
	Code int `json:"code"`
	Message string `json:"message"`
	Type string `json:"type"`
}

type DeezerApiAlbumLight struct {
	CoverBig string `json:"cover_big"`
	CoverSmall string `json:"cover_small"`
	ID int `json:"id"`
	Title string `json:"title"`
}

type DeezerApiArtist struct {
	ID int `json:"id"`
	Name string `json:"name"`
	PictureBig string `json:"picture_big"`
	PictureSmall string `json:"picture_small"`
}

type DeezerApiUser struct {
	ID int `json:"id"`
	Name string `json:"name"`
}

type DeezerApiAlbum struct {
	Error DeezerApiError `json:"error,omitempty"`
	Artist DeezerApiArtist `json:"artist"`
	CoverBig string `json:"cover_big"`
	CoverSmall string `json:"cover_small"`
	ID int `json:"ID"`
	Title string `json:"title"`
	Tracks DeezerApiTracksData `json:"tracks"`
}

type DeezerApiPlaylist struct {
	Error DeezerApiError `json:"error,omitempty"`
	Creator DeezerApiUser `json:"creator"`
	ID int `json:"id"`
	PictureBig string `json:"picture_big"`
	PictureSmall string `json:"picture_small"`
	Public bool `json:"public"`
	Title string `json:"title"`
	Tracks DeezerApiTracksData `json:"tracks"`
	User DeezerApiUser `json:"user"`
}

type DeezerApiTrack struct {
	Error DeezerApiError `json:"error,omitempty"`
	Album DeezerApiAlbumLight `json:"album"`
	Artist DeezerApiArtist `json:"artist"`
	Duration int `json:"duration"`
	ID int `json:"id"`
	Preview string `json:"preview"`
	Readable bool `json:"readable"`
	Title string `json:"title"`
}

type DeezerApiTracksData struct {
	Data []DeezerApiTrack `json:"data"`
}

// ------------------------------------------------------------------

type DeezerApiAlbumSearchResult struct {
	Data []DeezerApiAlbum `json:"data"`
	Total int `json:"total"`
}

type DeezerApiPlaylistSearchResult struct {
	Data []DeezerApiPlaylist `json:"data"`
	Total int `json:"total"`
}

type DeezerApiTrackSearchResult struct {
	Data []DeezerApiTrack `json:"data"`
	Total int `json:"total"`
}

// ------------------------------------------------------------------

func FilterAlbums(albums []DeezerApiAlbum) []Album {
	res := make([]Album, 0, len(albums))
    for _, album := range albums {
       	res = append(res, ConvertAlbum(album))
    }
    return res
}

func FilterPlaylists1(playlists []DeezerApiPlaylist) []Playlist {
	res := make([]Playlist, 0, len(playlists))
    for _, playlist := range playlists {
       	res = append(res, ConvertPlaylist(playlist, playlist.User))
    }
    return res
}

func FilterPlaylists2(playlists []DeezerApiPlaylist) []Playlist {
	res := make([]Playlist, 0, len(playlists))
    for _, playlist := range playlists {
       	res = append(res, ConvertPlaylist(playlist, playlist.Creator))
    }
    return res
}

func FilterTracks1(tracks []DeezerApiTrack) []Track {
	res := make([]Track, 0, len(tracks))
    for _, track := range tracks {
        if track.Readable && len(track.Preview) > 0 {
            res = append(res, ConvertTrack(track, track.Album))
        }
    }
    return res
}

func FilterTracks2(tracks []DeezerApiTrack, album DeezerApiAlbum) []Track {
	res := make([]Track, 0, len(tracks))
	albumLight := DeezerApiAlbumLight {
		CoverBig: album.CoverBig,
		CoverSmall: album.CoverSmall,
		ID: album.ID,
		Title: album.Title,
	}
    for _, track := range tracks {
        if track.Readable && len(track.Preview) > 0 {
            res = append(res, ConvertTrack(track, albumLight))
        }
    }
    return res
}

func ConvertAlbum(album DeezerApiAlbum) Album {
	return Album {
		Artist: Artist {
			ID: strconv.Itoa(album.Artist.ID),
			Name: album.Artist.Name,
			Link: fmt.Sprintf("%s/artist/%d", WWW_BASE, album.Artist.ID),
			PictureBig: album.Artist.PictureBig,
			PictureSmall: album.Artist.PictureSmall,
		},
		ID: strconv.Itoa(album.ID),
		Link: fmt.Sprintf("%s/album/%d", WWW_BASE, album.ID),
		PictureBig: album.CoverBig,
		PictureSmall: album.CoverSmall,
		Provider: "deezer",
		Title: album.Title,
		Tracks: FilterTracks2(album.Tracks.Data, album),
		Type: "album",
	}
}

func ConvertPlaylist(playlist DeezerApiPlaylist, user DeezerApiUser) Playlist {
	return Playlist {
		ID: strconv.Itoa(playlist.ID),
		Link: fmt.Sprintf("%s/playlist/%d", WWW_BASE, playlist.ID),
		PictureBig: playlist.PictureBig,
		PictureSmall: playlist.PictureSmall,
		Provider: "deezer",
		Title: playlist.Title,
		Tracks: FilterTracks1(playlist.Tracks.Data),
		Type: "playlist",
		User: User {
			ID: strconv.Itoa(user.ID),
			Link: fmt.Sprintf("%s/profile/%d", WWW_BASE, user.ID),
			Name: user.Name,
		},
	}
}

func ConvertTrack(track DeezerApiTrack, album DeezerApiAlbumLight) Track {
	return Track {
		Album: AlbumLight {
			ID: strconv.Itoa(album.ID),
			Link: fmt.Sprintf("%s/album/%d", WWW_BASE, album.ID),
			Title: album.Title,
			PictureBig: album.CoverBig,
			PictureSmall: album.CoverSmall,
		},
		Artist: Artist {
			ID: strconv.Itoa(track.Artist.ID),
			Name: track.Artist.Name,
			Link: fmt.Sprintf("%s/artist/%d", WWW_BASE, track.Artist.ID),
			PictureBig: track.Artist.PictureBig,
			PictureSmall: track.Artist.PictureSmall,
		},
		Duration: track.Duration,
		ID: strconv.Itoa(track.ID),
		Link: fmt.Sprintf("%s/track/%d", WWW_BASE, track.ID),
		Preview: track.Preview,
		Provider: "deezer",
		Title: track.Title,
		Type: "track",
	}
}

// ------------------------------------------------------------------

func loadAlbums(ids []string) <-chan []Album {
	x := func (length int) interface{} {
		return make([]DeezerApiAlbum, 0, length)
	}

	y := func (medias interface{}, data []byte) interface{} {
		media := DeezerApiAlbum {}
		err := json.Unmarshal(data, &media)
		if err != nil {
			log.Fatal(err)
		}
		if media.Error.Code == 4 {
			log.Print("Quota limit exceeded")
			return medias
		}
		if media.Error.Code != 0 {
			log.Print("An error occured while loading album: ", media.Error)
			return medias
		}
		return append(medias.([]DeezerApiAlbum), media)
	}

	channel := make(chan []Album)
	go func() {
		channel <- FilterAlbums(loadDeezer("album", ids, x, y).([]DeezerApiAlbum))
	}()
	return channel
}

func loadPlaylists(ids []string) <-chan []Playlist {
	x := func (length int) interface{} {
		return make([]DeezerApiPlaylist, 0, length)
	}

	y := func (medias interface{}, data []byte) interface{} {
		media := DeezerApiPlaylist {}
		err := json.Unmarshal(data, &media)
		if err != nil {
			log.Fatal(err)
		}
		if media.Error.Code == 4 {
			log.Print("Quota limit exceeded")
			return medias
		}
		if media.Error.Code != 0 {
			log.Print("An error occured while loading playlist: ", media.Error)
			return medias
		}
		return append(medias.([]DeezerApiPlaylist), media)
	}

	channel := make(chan []Playlist)
	go func() {
		channel <- FilterPlaylists2(loadDeezer("playlist", ids, x, y).([]DeezerApiPlaylist))
	}()
	return channel
}

func loadTracks(ids []string) <-chan []Track {
	x := func (length int) interface{} {
		return make([]DeezerApiTrack, 0, length)
	}

	y := func (medias interface{}, data []byte) interface{} {
		media := DeezerApiTrack {}
		err := json.Unmarshal(data, &media)
		if err != nil {
			log.Fatal(err)
		}
		if media.Error.Code == 4 {
			log.Print("Quota limit exceeded")
			return medias
		}
		if media.Error.Code != 0 {
			log.Print("An error occured while loading track: ", media.Error)
			return medias
		}
		return append(medias.([]DeezerApiTrack), media)
	}

	channel := make(chan []Track)
	go func() {
		channel <- FilterTracks1(loadDeezer("track", ids, x, y).([]DeezerApiTrack))
	}()
	return channel
};

// ------------------------------------------------------------------

func searchDeezerAlbums(query string, limit int) <-chan []Album {
	channel := make(chan []Album)
	go func() {
		defer close(channel)
		albums := DeezerApiAlbumSearchResult {}
		err := json.Unmarshal(searchDeezer("album", query, limit), &albums)
		if err != nil {
			log.Fatal(err)
		}
		channel <- FilterAlbums(albums.Data)
	}()
	return channel
}

func searchDeezerPlaylists(query string, limit int) <-chan []Playlist {
	channel := make(chan []Playlist)
	go func() {
		defer close(channel)
		playlists := DeezerApiPlaylistSearchResult {}
		err := json.Unmarshal(searchDeezer("playlist", query, limit), &playlists)
		if err != nil {
			log.Fatal(err)
		}
		channel <- FilterPlaylists1(playlists.Data)
	}()
	return channel
}

func searchDeezerTracks(query string, limit int) <-chan []Track {
	channel := make(chan []Track)
	go func() {
		defer close(channel)
		tracks := DeezerApiTrackSearchResult {}
		err := json.Unmarshal(searchDeezer("track", query, limit), &tracks)
		if err != nil {
			log.Fatal(err)
		}
		channel <- FilterTracks1(tracks.Data)
	}()
	return channel
}
