package main

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
)

type User struct {
	Username string `json:"username"`
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func main() {
	http.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)

		fileData, err := os.ReadFile("data.json")
		if err != nil {
			http.Error(w, "не могу прочитать файл", 500)
			return
		}

		var users []User
		json.Unmarshal(fileData, &users)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(users)
	})

	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)

		if r.Method == "OPTIONS" {
			return
		}

		var newUser User
		body, _ := io.ReadAll(r.Body)
		json.Unmarshal(body, &newUser)

		if newUser.Username == "" {
			http.Error(w, "username и password обязательны", 400)
			return
		}

		fileData, _ := os.ReadFile("data.json")
		var users []User
		json.Unmarshal(fileData, &users)

		users = append(users, newUser)

		updatedData, _ := json.MarshalIndent(users, "", "  ")
		os.WriteFile("data.json", updatedData, 0644)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(newUser)
	})

	http.ListenAndServe(":8080", nil)
}
