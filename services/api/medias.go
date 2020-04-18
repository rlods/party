package main

type Artist struct {
	ID string `json:"id"`
	Link string `json:"link"`
	Name string `json:"name"`
	PictureBig string `json:"picture_big"`
	PictureSmall string `json:"picture_small"`
}

type User struct {
	ID string `json:"id"`
	Link string `json:"link"`
	Name string `json:"name"`
}

type Album struct {
	Artist Artist `json:"artist"`
	ID string `json:"id"`
	Link string `json:"link"`
	PictureBig string `json:"picture_big"`
	PictureSmall string `json:"picture_small"`
	Provider string `json:"provider"`
	Title string `json:"title"`
	Tracks []Track `json:"tracks"`
	Type string `json:"type"`
}

type AlbumLight struct {
	ID string `json:"id"`
	Link string `json:"link"`
	PictureBig string `json:"picture_big"`
	PictureSmall string `json:"picture_small"`
	Title string `json:"title"`
}

type Playlist struct {
	ID string `json:"id"`
	Link string `json:"link"`
	PictureBig string `json:"picture_big"`
	PictureSmall string `json:"picture_small"`
	Provider string `json:"provider"`
	Title string `json:"title"`
	Tracks []Track `json:"tracks"`
	Type string `json:"type"`
	User User `json:"user"`
}

type Track struct {
	Album AlbumLight `json:"album"`
	Artist Artist `json:"artist"`
	Duration int `json:"duration"`
	ID string `json:"id"`
	Link string `json:"link"`
	Preview string `json:"preview"`
	Provider string `json:"provider"`
	Title string `json:"title"`
	Type string `json:"type"`
}

type MediaAccess struct {
	ID string `json:"id"`
	Provider string `json:"provider"`
	Type string `json:"type"`
}
