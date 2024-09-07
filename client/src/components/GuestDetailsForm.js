import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/guestdetailsform.css';
import nationalities from '../data/nationalities';  // Import the nationalities list

function GuestDetailsForm({ setFinalGuests }) {
  const initialGuests = [
    { title: '', firstName: '', lastName: '', day: '', month: '', year: '', nationality: '', mobileNumber: '', email: '' },
    { title: '', firstName: '', lastName: '', day: '', month: '', year: '', nationality: '', mobileNumber: '', email: '' },
    // Add more guests as needed
  ];

  const [guests, setGuests] = useState(initialGuests);
  const [activeGuest, setActiveGuest] = useState(0);

  useEffect(() => {
    setFinalGuests(guests);
  }, [guests, setFinalGuests]);

  const handleTabClick = (index) => {
    setActiveGuest(index);
  };

  const handleInputChange = (e, guestIndex) => {
    const { name, value } = e.target;
    const updatedGuests = guests.map((guest, index) =>
      index === guestIndex ? { ...guest, [name]: value } : guest
    );

    if (guestIndex === guests.length - 1 && value !== "") {
      updatedGuests.push({
        title: '',
        firstName: '',
        lastName: '',
        day: '',
        month: '',
        year: '',
        age: '',
        nationality: '',
        mobileNumber: '',
        email: ''
      });
    }

    setGuests(updatedGuests);
  };

  const handleDateChange = (date, guestIndex) => {
    const updatedGuests = guests.map((guest, index) => {
      if (index === guestIndex) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const age = new Date().getFullYear() - year;

        return { ...guest, day, month, year, age };
      }
      return guest;
    });

    setGuests(updatedGuests);
  };

  return (
    <div className="guest-details-form">
      <GuestTabs guests={guests} activeGuest={activeGuest} onTabClick={handleTabClick} />
      <GuestForm
        guestIndex={activeGuest}
        guest={guests[activeGuest]}
        onInputChange={(e) => handleInputChange(e, activeGuest)}
        onDateChange={(date) => handleDateChange(date, activeGuest)}
      />
    </div>
  );
}

function GuestTabs({ guests, activeGuest, onTabClick }) {
  return (
    <div className="guest-tabs">
      {guests.map((guest, index) => (
        <button
          key={index}
          className={`guest-tab ${activeGuest === index ? 'active' : ''}`}
          onClick={() => onTabClick(index)}
        >
          {index + 1}. {guest.firstName ? guest.firstName : `Guest`}
        </button>
      ))}
    </div>
  );
}

function GuestForm({ guestIndex, guest, onInputChange, onDateChange }) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef(null);

  const openDatePicker = () => {
    setIsDatePickerOpen(true);
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  return (
    <div className="guest-form">
      <div className="form-group name-group">
        <div>
          <label>Title</label>
          <select name="title" value={guest.title || ''} onChange={onInputChange}>
            <option value="">Select</option>
            <option value="Mr">Mr</option>
            <option value="Ms">Ms</option>
            <option value="Mrs">Mrs</option>
          </select>
        </div>

        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={guest.firstName || ''}
            placeholder="First name"
            onChange={onInputChange}
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={guest.lastName || ''}
            placeholder="Last name"
            onChange={onInputChange}
          />
        </div>
      </div>

      <div className="form-group birthday-group">
        <label>Date of Birth</label>
        <div className="dob-inputs">
          <div>
            <label>Day</label>
            <input
              type="text"
              name="day"
              value={guest.day || ''}
              placeholder="Day"
              onFocus={openDatePicker}
              readOnly
            />
          </div>
          <div>
            <label>Month</label>
            <input
              type="text"
              name="month"
              value={guest.month || ''}
              placeholder="Month"
              onFocus={openDatePicker}
              readOnly
            />
          </div>
          <div>
            <label>Year</label>
            <input
              type="text"
              name="year"
              value={guest.year || ''}
              placeholder="Year"
              onFocus={openDatePicker}
              readOnly
            />
          </div>
          <div>
            <label>Age</label>
            <input
                type="text"
                name="age"
                value={guest.age || ''}
                placeholder="Age"
                readOnly
            />
          </div>

        </div>
        <DatePicker
          ref={datePickerRef}
          selected={guest.year ? new Date(guest.year, guest.month - 1, guest.day) : null}
          onChange={onDateChange}
          dateFormat="dd/MM/yyyy"
          showYearDropdown
          dropdownMode="select"
          onClickOutside={() => setIsDatePickerOpen(false)}
          open={isDatePickerOpen}
          maxDate={new Date()}  
          onSelect={() => setIsDatePickerOpen(false)} // Close date picker after selection
          className="hidden-datepicker"
        />
 
      </div>

      <div className="form-group nationality-group">
        <label>Nationality</label>
        <select name="nationality" value={guest.nationality || ''} onChange={onInputChange}>
          <option value="">Select Nationality</option>
          {nationalities.map((nationality) => (
            <option key={nationality.code} value={nationality.code}>
              {nationality.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group contact-group">
        <div>
            <label>Contact Information</label>
            <div className='contact-info'>
                <div>
                    <label>Mobile Number</label>
                    <input
                    type="text"
                    name="mobileNumber"
                    value={guest.mobileNumber || ''}
                    placeholder="Mobile Number"
                    onChange={onInputChange}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                    type="text"
                    name="email"
                    value={guest.email || ''}
                    placeholder="Email"
                    onChange={onInputChange}
                    />
                </div> 
            </div>
        </div>
      </div>
    </div> 
  );
}

export default GuestDetailsForm;
