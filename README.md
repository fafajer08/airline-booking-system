# Technical Specifications Document for Qatar Airways Website

## 1. Introduction

- **Project Name:** Fly Airlines Booking System
- **Version:** 1.0
- **Date:** August 21, 2024
- **Prepared by:** B460 Special Project Team
- **Reviewed by:** Nicole Katherine G. Gamat
- **Approved by:** 

- **Members :** 
Jay Descalsota
Prince Caneba
Isaiah Domingo
Jerwin Maguyon
Brian Bamba


## 2. Purpose

This document provides the technical specifications for the development, deployment, and maintenance of the Fly Airlines Booking System website. It serves as a guide for developers, designers, and stakeholders involved in the project.

## 3. Scope

The scope of this document covers the functional and non-functional requirements, architecture, system components, and security specifications for the Qatar Airways website.

## 4. System Overview

- **Website Type:** Corporate/Commercial Airline Website
- **Primary Users:** General public, travelers, corporate clients, travel agents
- **Key Functionalities:** Flight booking, travel information, account management, customer support, loyalty program management (Privilege Club)
- **Supported Platforms:** Desktop, Mobile, Tablet
- **Supported Browsers:** Chrome, Firefox, Safari, Edge

## 5. Functional Requirements

### 5.1 User Interface (UI)

- **Design Language:** Modern, responsive, and intuitive UI.
- **Layout:** Adaptive design with multi-device compatibility (Desktop, Mobile, Tablet).
- **Navigation:**
  - Top navigation bar with links to Home, Flights, Destinations, Deals, My Bookings and Accounts
- **Accessibility:** Compliance with WCAG 2.1 standards to ensure accessibility for users with disabilities.

### 5.2 Core Functionalities

- **Flight Search and Booking:**
  - Search for flights by destination, dates, and passenger count.
  - Display available flights, seat classes, and prices.
  - Secure online booking and payment gateway integration.
- **Account Management:**
  - User registration and profile management.
  - View and manage bookings.
  - Access to Privilege Club details, points, and redemption options.
    **Content Management System (CMS):**
  - Easy-to-use backend for managing content (blogs, news, travel guides).
  - Multi-language support for global accessibility.
- **Customer Support:**
  - Integrated live chat, FAQs, and contact forms.
  - Support ticketing system.

### 5.3 Non-Functional Requirements

- **Performance:**
  - Load time: < 3 seconds for the main pages.
  - Optimized for high traffic with scalable server architecture.
- **Security:**
  - HTTPS protocol for all communications.
  - Passwords should be hashed and stored securely.
  - Regular security audits and vulnerability assessments.
- **Reliability:**
  - 99.9% uptime requirement.
  - Automated backups and disaster recovery plans.
- **Scalability:**
  - Modular architecture to support future expansions.
  - Cloud-based infrastructure for scalability.

## 6. Technical Architecture

### 6.1 Frontend

- **Technologies:** HTML5, CSS3, JavaScript, React.js
- **Frameworks/Libraries:** Bootstrap, jQuery
- **Responsive Design:** Media queries for different screen sizes.
- **Content Delivery Network (CDN):** For faster delivery of static assets.

### 6.2 Backend

- **Server-Side Language:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **APIs:** RESTful APIs for integration with third-party services (payment gateways, customer service systems).
- **Authentication:** OAuth 2.0 for secure user authentication.

### 6.3 Infrastructure

- **Hosting:** Cloud-based hosting (AWS, Azure, or Google Cloud)
- **Load Balancer:** To distribute traffic evenly across servers.
- **Auto-scaling:** Automated scaling based on traffic patterns.
- **CI/CD Pipeline:** Jenkins/GitLab CI for continuous integration and deployment.

## 7. Security Considerations

- **Data Encryption:** Use of SSL/TLS for all data transmissions.
- **User Data Protection:** GDPR compliance for handling user data.
- **Session Management:** Secure session management with tokens and cookies.
- **Regular Updates:** Frequent updates and patches to protect against vulnerabilities.

## 8. Performance Optimization

- **Caching:** Implement caching strategies for static content (using Redis, CDN).
- **Minification:** Minify CSS, JS, and HTML files.
- **Lazy Loading:** Implement lazy loading for images and videos to improve load times.

## 9. Testing Requirements

- **Unit Testing:** Test individual components and modules.
- **Integration Testing:** Ensure all components work together seamlessly.
- **User Acceptance Testing (UAT):** Conduct UAT to validate the website meets user requirements.
- **Performance Testing:** Load testing to ensure the website can handle high traffic.

## 10. Deployment

- **Staging Environment:** Setup a staging environment identical to production for final testing.
- **Production Deployment:** Detailed deployment plan with rollback strategy.
- **Monitoring:** Use monitoring tools (e.g., New Relic, Datadog) to track website performance.

## 11. Data Requirements

- **Data Models**:
  - **User**:
    {User ID: Unique identifier for each user.
    First Name: First name of the user
    Last Name: User's last name.
    Email: User's email address (must be unique).
    Password: Encrypted password for login.
    Phone Number: Contact number for the user.}
  - **Flight Data**:
    {Flight ID: Unique identifier for each flight.
    Flight Number: Airline-specific flight number.
    Departure Airport: Code and name of the departure airport.
    Destination Airport: Code and name of the arrival airport.
    Departure Date & Time: Date and time of flight departure.
    Arrival Date & Time: Date and time of flight arrival.
    Seat Availability: Number of available seats per class.}
  - **Booking Data**:
    {Booking ID: Unique identifier for each booking.
    User ID: Reference to the user making the booking.
    Flight ID: Reference to the flight being booked.
    Booking Date: Date and time when the booking was made.
    Seat Class: Class of seat booked.
    Total Cost: Total cost of the booking.}
  - **Payment Data**:
    {Payment ID: Unique identifier for each payment transaction.
    Booking ID: Reference to the associated booking.
    Payment Method: Method of payment (e.g., Credit Card, PayPal).
    Payment Date: Date and time of payment.
    Amount: Total amount paid.
    Payment Status: Status of the payment (e.g., Success, Failed).}
 - **Passenger**:
    {Passenger ID: Unique identifier for each payment transaction.
    Booking ID: Reference to the associated booking.
    First Name: First name of the passenger.
    Last Name: Last name of the passenger.
    Passport: If applicable.
    Nationality: Passenger nationality.
    Birth Date: Birth date of the passenger.
    Email: Email of the passenger.
    PHone  Number: Number of the passenger}
   - **Ticket**:
    {Ticket ID: Unique identifier for each payment transaction.
    Payment ID: Reference to the associated paymnet.
    Passenger ID: Unique identifier for passenger.
    Seat No: Passenger seat number.
    Class: Seat class.
    Price: Price of the ticket.}

- **Database Requirements**:
  - Use MongoDB for storing user, user data, flight data, booking data, payment data, passenger data, ticket data.
- **Data Storage and Retrieval**:
  - Users can retrieve their account and order information.
  - Implement verifications of users

## 12. External Interface Requirements

- **User Interface(UI)**:
  - Web Application: The primary interface for users to search for flights, make bookings, and manage their reservations.
  - Mobile Application: A responsive mobile application for users to perform all tasks - available on the web platform.
  - Admin Dashboard: An interface for administrators to manage flights, bookings, and users.
- **API Interface**:
  - Flight Search API: Allows external systems to search for available flights based on criteria like date, destination.
  - Booking API: Enables the creation, retrieval, update, and cancellation of bookings.
  - Payment Gateway Integration: Secure APIs to process payments via third-party payment processors (e.g., Stripe, PayPal).
  - User Management API: Manages user registration, login, and profile updates.

## 13. Maintenance and Support

- **Support Plan:** 24/7 support for critical issues.
- **Maintenance Schedule:** Regular updates, patches, and optimizations.
- **Documentation:** Comprehensive documentation for developers and users.

## 14. Conclusion

This document provides a detailed overview of the technical specifications required to develop and maintain the Qatar Airways website. Adherence to these specifications will ensure the website is robust, secure, and capable of providing an excellent user experience.
