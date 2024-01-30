package handler

import (
	"fmt"
	"server/models"
)

func HandleIndex() {
	var User models.User

	User.Email = "lomalack@gmail.com"
	User.FirstName = "Lomalack"
	User.LastName = "Malack"
	User.Password = "loml"
	User.Nickname = "Bastian"

	err := models.UserRepo.CreateUser(&User)
	if err != nil {
		fmt.Println(err)
	}

}
