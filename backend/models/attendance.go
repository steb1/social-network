package models

import "database/sql"

// Attendance structure represents the "attendance" table
type Attendance struct {
	AttendanceID     int `json:"attendance_id"`
	UserID           int `json:"user_id"`
	EventID          int `json:"event_id"`
	AttendanceOption int `json:"attendance_option"`
}

type AttendanceRepository struct {
	db *sql.DB
}

func NewAttendanceRepository(db *sql.DB) *AttendanceRepository {
	return &AttendanceRepository{
		db: db,
	}
}

// CreateAttendance adds a new attendance record to the database
func (ar *AttendanceRepository) CreateAttendance(attendance *Attendance) error {
	query := `
		INSERT INTO attendance (user_id, event_id, attendance_option)
		VALUES (?, ?, ?)
	`
	result, err := ar.db.Exec(query, attendance.UserID, attendance.EventID, attendance.AttendanceOption)
	if err != nil {
		return err
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	attendance.AttendanceID = int(lastInsertID)
	return nil
}

// GetAttendance retrieves an attendance record from the database by attendance_id
func (ar *AttendanceRepository) GetAttendance(attendanceID int) (*Attendance, error) {
	query := "SELECT * FROM attendance WHERE attendance_id = ?"
	var attendance Attendance
	err := ar.db.QueryRow(query, attendanceID).Scan(&attendance.AttendanceID, &attendance.UserID, &attendance.EventID, &attendance.AttendanceOption)
	if err != nil {
		return nil, err
	}
	return &attendance, nil
}
func (ar *AttendanceRepository) IsRegistered(event_id, user_id int) (*Attendance, error) {
	query := "SELECT * FROM attendance WHERE event_id = ? AND user_id = ? "
	var attendance Attendance
	err := ar.db.QueryRow(query, event_id, user_id).Scan(&attendance.AttendanceID, &attendance.UserID, &attendance.EventID, &attendance.AttendanceOption)
	if err != nil {
		return nil, err
	}
	return &attendance, nil
}

// UpdateAttendance updates an existing attendance record in the database
func (ar *AttendanceRepository) UpdateAttendance(attendance *Attendance) error {
	query := `
		UPDATE attendance
		SET user_id = ?, event_id = ?, attendance_option = ?
		WHERE attendance_id = ?
	`
	_, err := ar.db.Exec(query, attendance.UserID, attendance.EventID, attendance.AttendanceOption, attendance.AttendanceID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteAttendance removes an attendance record from the database by attendance_id
func (ar *AttendanceRepository) DeleteAttendance(attendanceID int) error {
	query := "DELETE FROM attendance WHERE attendance_id = ?"
	_, err := ar.db.Exec(query, attendanceID)
	if err != nil {
		return err
	}
	return nil
}

// GetAttendanceCountByEventID returns the number of attendances for a given event_id
func (ar *AttendanceRepository) GetAttendanceCountByEventID(eventID int) (int, error) {
	query := `
		SELECT COUNT(*) FROM attendance
		WHERE event_id = ? AND attendance_option = 0
	`

	var count int
	err := ar.db.QueryRow(query, eventID).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}