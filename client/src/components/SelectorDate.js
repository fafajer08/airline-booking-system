import React, { useState, useRef } from 'react';
import DatePicker from "react-datepicker";
import divisionIcon from '../assets/division.png';
import dropDownIcon from '../assets/dropdown.png';
import calendarIcon from '../assets/calendar.png';
import '../styles/selectordate.css';

function DateSelector({ label, onDateChange }) {
    const [startDate, setStartDate] = useState(new Date());
    const datePickerRef = useRef(null);

    const handleIconClick = () => {
        if (datePickerRef.current) {
            datePickerRef.current.setOpen(true);
        }
    };

    const handleDateChange = (selectedDate) => {
        setStartDate(selectedDate);
        onDateChange(selectedDate); // Pass the selected date to the parent component
    };

    const day = startDate.toLocaleString('en-US', { weekday: 'short' });
    const month = startDate.toLocaleString('en-US', { month: 'short' });
    const date = startDate.getDate();
    const year = startDate.getFullYear().toString().slice(-2);

    return (
        <div className="date-selector-outer-container">
            <p className="date-selector-label">{label}</p>
            <div className="date-selector-inner-container" onClick={handleIconClick}>
                <img className="date-selector-calendar-icon date-selector-icons" src={calendarIcon} alt="calendar icon" />
                <span className="date-selector-date-display">{date}</span>
                <img className="date-selector-division-icon" src={divisionIcon} alt="division icon" />
                <div className="date-selector-day-month-display">
                    <div className="date-selector-day-display">{day}</div>
                    <div className="date-selector-mmmyy-display">{month}'{year}</div>
                </div>
                <img
                    className="date-selector-dropdown-icon date-selector-icons"
                    src={dropDownIcon}
                    alt="dropdown icon"
                />
                <DatePicker
                    ref={datePickerRef}
                    selected={startDate}
                    onChange={handleDateChange}
                    minDate={new Date()}  // Restrict to dates from today onwards
                    className="date-selector-hidden-datepicker date-picker"
                    onClickOutside={() => datePickerRef.current.setOpen(false)}
                />
            </div>
        </div>
    );
}

export default DateSelector;
