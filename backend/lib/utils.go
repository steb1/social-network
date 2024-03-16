package lib

import (
	"bufio"
	"database/sql"
	"encoding/json"
	"fmt"
	"mime/multipart"
	"unicode"

	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"text/template"
	"time"

	"github.com/gofrs/uuid"
)

var maxSize int64 = 20 * 1024 * 1024 // 20 MB

func Slugify(input string) string {
	input = strings.ToLower(input)
	re := regexp.MustCompile("[^a-z0-9]+")
	input = re.ReplaceAllString(input, "-")
	input = strings.Trim(input, "-")

	return input
}

func FormatDateDB(str string) string {
	str = strings.ReplaceAll(str, "T", " ")
	str = strings.ReplaceAll(str, "Z", "")
	str = TimeSinceCreation(str)

	return str
}

func RedirectToPreviousURL(res http.ResponseWriter, req *http.Request) {
	// Get the Referer header from the request
	previousPage := req.Header.Get("Referer")

	// Perform the redirection
	http.Redirect(res, req, previousPage, http.StatusSeeOther)
}

func LoadEnv(path string) error {
	file, err := os.Open(path)
	if err != nil {
		log.Println("🚨 " + err.Error())
	}
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			log.Println("🚨 Your env file must be set")
		}
		key := parts[0]
		value := parts[1]
		os.Setenv(key, value)
	}
	return scanner.Err()
}

func RedirectToHTTPS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("X-Forwarded-Proto") != "https" {
			http.Redirect(w, r, "https://"+r.Host+r.RequestURI, http.StatusPermanentRedirect)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func ValidateRequest(req *http.Request, res http.ResponseWriter, url, method string) bool {
	if strings.Contains(url, "*") {
		_urlSplit := strings.Split(req.URL.Path, "/")
		url = url[:len(url)-1]
		url += _urlSplit[len(_urlSplit)-1]
	}
	if req.URL.Path != url {
		res.WriteHeader(http.StatusNotFound)
		RenderPage("base", "index", "404", res)
		log.Println("404 ❌ - Page not found ", url)
		return false
	}

	if req.Method != method {
		res.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(res, "%s", "Error - Method not allowed")
		log.Printf("405 ❌ - Method not allowed %s - %s on URL : %s\n", req.Method, method, url)
		return false
	}
	return true
}

func WriteJSONResponse(w http.ResponseWriter, r *http.Request, data interface{}) {
	var origin = r.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Content-Type", "application/json")

	// Encode and write the JSON response
	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		http.Error(w, "Error encoding JSON response", http.StatusInternalServerError)
		return
	}
}

func RenderPage(basePath, pagePath string, data any, res http.ResponseWriter) {

	files := []string{"newtemplates/" + pagePath + ".html"}
	tpl, err := template.ParseFiles(files...)
	if err != nil {
		//res.WriteHeader(http.StatusInternalServerError)
		log.Println("🚨 " + err.Error())
	} else {
		tpl.Execute(res, data)
	}
}

func UploadImage(req *http.Request) string {
	image, header, err := req.FormFile("photo")
	if err != nil {
		log.Println("❌ Request doesn't contain image", err)
		return ""
	}
	defer image.Close()

	if header.Size > maxSize {
		log.Println("❌ File size exceeds limit")
		return ""
	}

	if !isValidFileType(header.Header.Get("Content-Type")) {
		log.Println("❌ Invalid file type")
		return ""
	}

	uploads := "/uploads" // Use "uploads" without the leading slash
	imageURL := filepath.Join(uploads, generateUniqueFilename(header.Filename))
	filePath := filepath.Join(".", imageURL) // Use "." to denote the current directory
	if filePath[0] != '/' {
		filePath = "" + filePath
	}
	file, err := os.Create(filePath)
	if err != nil {
		return ""
	}
	defer file.Close()
	_, err = io.Copy(file, image)
	if err != nil {
		return ""
	}

	return imageURL
}

func generateUniqueFilename(filename string) string {
	ext := filepath.Ext(filename)
	randomName, err := uuid.NewV4()
	if err != nil {
		log.Fatalf("❌ Failed to generate UUID: %v", err)
	}
	newFilename := randomName.String() + ext
	return newFilename
}

func isValidFileType(contentType string) bool {
	switch contentType {
	case "image/jpeg", "image/png", "image/gif", "image/svg+xml":
		return true
	}
	return false
}

func TimeSinceCreation(creationDate string) string {
	layout := "2006-01-02 15:04:05" // Date format layout

	creationTime, err := time.Parse(layout, creationDate)
	if err != nil {
		return "Invalid date format"
	}

	currentTime := time.Now()
	elapsedTime := currentTime.Sub(creationTime)

	if elapsedTime < time.Hour/60 {
		seconds := int(elapsedTime.Hours() * 60 * 60)
		return fmt.Sprintf("%d second%s ago", seconds, pluralize(seconds))
	} else if elapsedTime < time.Hour {
		minutes := int(elapsedTime.Hours() * 60)
		return fmt.Sprintf("%d minute%s ago", minutes, pluralize(minutes))
	} else if elapsedTime < 24*time.Hour {
		hours := int(elapsedTime.Hours())
		return fmt.Sprintf("%d hour%s ago", hours, pluralize(hours))
	} else if elapsedTime < 30*24*time.Hour {
		days := int(elapsedTime.Hours() / 24)
		return fmt.Sprintf("%d day%s ago", days, pluralize(days))
	} else if elapsedTime < 12*30*24*time.Hour {
		months := int(elapsedTime.Hours() / (24 * 30))
		return fmt.Sprintf("%d month%s ago", months, pluralize(months))
	} else {
		years := int(elapsedTime.Hours() / (24 * 30 * 12))
		return fmt.Sprintf("%d year%s ago", years, pluralize(years))
	}
}

func pluralize(count int) string {
	if count > 1 {
		return "s"
	}
	return ""
}

func FormatDate(DateAndTime string) string {
	tab := strings.Split(DateAndTime, " ")
	if len(tab) != 2 {
		return DateAndTime
	}
	Date, Time := tab[0], tab[1]
	tabDate := strings.Split(Date, "-")
	year, month, day := tabDate[0], tabDate[1], tabDate[2]
	MonthInt := map[string]string{
		"01": "January",
		"02": "February",
		"03": "March",
		"04": "April",
		"05": "May",
		"06": "June",
		"07": "July",
		"08": "August",
		"09": "September",
		"10": "October",
		"11": "November",
		"12": "December"}
	month = MonthInt[month]
	tabTime := strings.Split(Time, ":")
	hour, minute := tabTime[0], tabTime[1]
	inthour, _ := strconv.Atoi(hour)
	suf := ""
	if inthour > 12 {
		inthour -= 12
		suf = "pm"
	} else {
		suf = "am"
	}
	hour = strconv.Itoa(inthour)
	minute += suf
	TimeFormatted := strings.Join([]string{hour, minute}, ":")
	TheDate := fmt.Sprintf("%s, %sth, %s, at %s time", month, day, year, TimeFormatted)
	return TheDate
}

func VerifyPassword(password string) bool {
	var num int
	for _, val := range password {
		if !unicode.IsSpace(val) {
			num++
		}
	}
	return num >= 8
}

func IsValidEmail(email string) bool {
	pattern := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$`
	regex := regexp.MustCompile(pattern)
	return regex.MatchString(email)
}

func HandleError(err error, task string) {
	if err != nil {
		log.Printf("Error While %s | more=> %v\n", task, err)
	}
}

func SaveFile(file multipart.File, filePath string) error {
	// Get the directory path from the filePath
	dir := filepath.Dir(filePath)

	// Create the directory and any parent directories if they don't exist
	if err := os.MkdirAll(dir, os.ModePerm); err != nil {
		return err
	}

	// Open the destination file
	destination, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer destination.Close()

	// Copy the content of the uploaded file to the destination file
	_, err = io.Copy(destination, file)
	if err != nil {
		return err
	}

	return nil
}

func IsBlank(s string) bool {
	return strings.TrimSpace(s) == ""
}

func IsValidDate(dateString string) bool {
	// Define the regex pattern for jj/mm/aaaa format
	pattern := regexp.MustCompile(`^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$`)

	// Check if the input string matches the pattern
	if !pattern.MatchString(dateString) {
		return false
	}

	// Extract day, month, and year from the input string
	dateParts := pattern.FindStringSubmatch(dateString)
	day, _ := strconv.Atoi(dateParts[1])
	month, _ := strconv.Atoi(dateParts[2])
	year, _ := strconv.Atoi(dateParts[3])

	// Validate day, month, and year ranges
	if day < 1 || day > 31 || month < 1 || month > 12 || year < 1000 || year > 9999 {
		return false
	}

	// Additional validation based on specific rules if needed

	return true
}

func IsExpired(expiry time.Time) bool {
	return time.Now().After(expiry)
}
func IsValidName(name string) bool {
	toto := strings.TrimSpace(name)
	validNameRegex := regexp.MustCompile(`^[a-zA-Z]+(?:\s[a-zA-Z]+)?$`)
	return validNameRegex.MatchString(toto)
}
func IsValidDOB(dob string) (bool, string) {
	// Regular expression to validate date format (yyyy-mm-dd)
	validDOBRegex := regexp.MustCompile(`^\d{4}[-\/]\d{2}[-\/]\d{2}$`)

	// Check if the date matches the regular expression
	if !validDOBRegex.MatchString(dob) {
		return false, "Invalid Date format."
	}
	// Replace '/' with '-' for consistent parsing
	dob = regexp.MustCompile(`-`).ReplaceAllString(dob, "/")

	// Parse the date string to a time.Time object
	dateOfBirth, err := time.Parse("2006/01/02", dob)
	if err != nil {
		return false, "Invalid Date format"
	}

	// Optional: Check if the person is at least 18 years old
	minimumAge := 13
	maximumAge := 120
	currentTime := time.Now()
	age := currentTime.Year() - dateOfBirth.Year()

	if currentTime.YearDay() < dateOfBirth.YearDay() {
		age--
	}

	if age < minimumAge || age > maximumAge {
		return false, "You must be 13 years old at least and 120 at most."
	}

	return true, ""
}

func IsValidNickname(nickname string) bool {
	// Regular expression to allow alphanumeric characters and specific special characters (excluding space)
	validNicknameRegex := regexp.MustCompile(`^[a-zA-Z0-9!@#$%^&*()-_=+]+$`)

	minLength := 3
	maxLength := 15

	return validNicknameRegex.MatchString(nickname) && len(nickname) >= minLength && len(nickname) <= maxLength
}

// Sert à envoyer NULL dans la base de données au lieu de recevoir ""
func NewNullString(s string) sql.NullString {
	if len(s) == 0 {
		return sql.NullString{}
	}
	return sql.NullString{
		String: s,
		Valid:  true,
	}
}

// Sert à récupérer les valeurs NULL dans le serveur sinon on a une erreur
func GetStringFromNullString(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}

func AddCorsPost(w http.ResponseWriter, r *http.Request) {
	var origin = r.Header.Get("Origin")
	//fmt.Println("Origin:", origin)
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
}

func AddCorsGet(w http.ResponseWriter, r *http.Request) {
	var origin = r.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
}
