package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func homeRoute(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome home!")
}

func loadRoute(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(loadMedias([]MediaAccess {
		MediaAccess {
			ID: "64119772",
			Type: "album",
		},
		MediaAccess {
			ID: "3133294742",
			Type: "playlist",
		},
		MediaAccess {
			ID: "78383429",
			Type: "track",
		},
	}))
}

func searchRoute(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(searchMedias("daft", 10))
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/", homeRoute)
	router.HandleFunc("/load", loadRoute)
	router.HandleFunc("/search", searchRoute)
	log.Print("Listening...")
	log.Fatal(http.ListenAndServe(":8080", router))
}
