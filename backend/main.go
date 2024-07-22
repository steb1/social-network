package main

import (
	"fmt"
	"log"
	"net/http"

	"server/handler"
	"server/pkg/db/sqlite"
)

func main() {
	db, err := sqlite.Connect()
	if err != nil {
		log.Fatal(err)
	}

	err = sqlite.ApplyMigrations(db)
	if err != nil {
		log.Fatal(err)
	}
	for _, route := range handler.Routes {
		http.HandleFunc(route.Path, handler.MiddlewareError(route.Path, route.Handler, route.Methods))
	}

	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("./uploads/avatar/"))))

	/*******************/
	log.Println("")
	fmt.Println("\n\t\033[1;32m ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞")
	fmt.Print("\t| o Server started and listenning on port", handler.Port, "™®|\n")
	fmt.Print("\t|\t   http://localhost"+handler.Port, "\t\t|")
	fmt.Println("\n\t\033[1;32m ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞")
	log.Fatal(http.ListenAndServe(handler.Port, nil))
}
