package main

import (
	"log"
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
	handler.HandleIndex()

	// Continue with your server initialization and other logic
}
