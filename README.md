# Midlands State University Parking Management System (MsuPMS)

[![Angular](https://img.shields.io/badge/Angular-11.1.4-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.17.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.7.1-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)

An interactive spatial Parking Management System developed for **Midlands State University (MSU)**. This application provides real-time geospatial visualization, monitoring, and booking of campus parking slots utilizing interactive maps powered by Leaflet and spatial database capabilities powered by PostgreSQL/PostGIS.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture & System Overview](#-architecture--system-overview)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started & Installation](#-getting-started--installation)
  - [1. Repository Setup](#1-repository-setup)
  - [2. Database Configuration](#2-database-configuration)
  - [3. Backend Server Setup](#3-backend-server-setup)
  - [4. Frontend Application Setup](#4-frontend-application-setup)
- [API Endpoints](#-api-endpoints)
- [Screenshots & UI Placeholders](#-screenshots--ui-placeholders)
- [Development Commands](#-development-commands)
- [License](#-license)

---

## 📑 Overview

The **Midlands State University Parking Management System (MsuPMS)** streamlines campus parking operations for students, staff, regular users, and campus administrators. By combining Geographic Information System (GIS) mapping capabilities with a RESTful API backend and a responsive Angular frontend, MsuPMS enables users to easily locate available parking spaces, view campus buildings/roads, and reserve parking slots dynamically.

---

## ✨ Key Features

- **Interactive Campus Map**: Visualizes campus spatial features including parking zones, campus buildings, and road networks using Leaflet.
- **Real-Time Parking Slot Status**: View live availability of parking slots with status indicators (e.g., Available, Occupied, Reserved).
- **Slot Reservation & Booking**: Allows registered users to search and book parking slots interactively.
- **Administrative Dashboard**: Enables campus administrators to manage parking slot availability, update slot statuses individually or in bulk, and monitor usage.
- **Spatial Data Integration**: Native GeoJSON spatial data rendering for campus geographic features stored in PostGIS.
- **User Management**: Role-based access and views tailored for regular users and administrators.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: [Angular 11](https://angular.io/)
- **Mapping Library**: [Leaflet](https://leafletjs.com/) (`@types/leaflet`)
- **Language**: TypeScript, HTML5, CSS3
- **Styling & Components**: Angular Material / Custom CSS

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database Driver**: `pg` (node-postgres)
- **Configuration Parser**: `parse-ini`

### Database
- **Database Management System**: [PostgreSQL](https://www.postgresql.org/) with **PostGIS** extension enabled for spatial querying (`ST_AsGeoJSON`).

---

## 🏗 Architecture & System Overview

```
+-------------------------------------------------------+
|                   Angular Frontend                    |
|        (Interactive Leaflet Map & User Views)         |
+---------------------------+---------------------------+
                            |
                     HTTP / REST API
                            |
+---------------------------v---------------------------+
|                   Express Node Server                 |
|             (Port 5000 - server/index.js)             |
+---------------------------+---------------------------+
                            |
                   Postgres Connection
                            |
+---------------------------v---------------------------+
|                 PostgreSQL + PostGIS                  |
|    (Tables: parkingslots, msu_buildings, msu_roads)   |
+-------------------------------------------------------+
```

---

## 📁 Project Structure

```
msu-pms/
├── e2e/                     # End-to-end tests (Protractor)
├── server/                  # Node.js Express backend server
│   ├── config/
│   │   └── config.ini       # PostgreSQL connection configuration
│   ├── index.js             # Express server entry point & route definitions
│   ├── queries.js           # PostgreSQL database query handlers & GeoJSON queries
│   └── package.json         # Backend dependencies
├── src/                     # Angular frontend application
│   ├── app/
│   │   ├── administration/  # Admin management modules & views
│   │   ├── findparkingspace/# Parking search and interactive map component
│   │   ├── home/            # Home landing page
│   │   ├── login/           # User authentication & login view
│   │   ├── regularuser/     # Regular user dashboard
│   │   ├── app-routing.module.ts
│   │   ├── app.module.ts
│   │   ├── data.service.ts  # Service handling HTTP communication with backend API
│   │   └── parking-slots.service.ts
│   ├── assets/              # Static assets (images, icons, GeoJSON files)
│   ├── environments/        # Environment configurations
│   ├── index.html           # Main HTML file
│   └── styles.css           # Global stylesheet
├── angular.json             # Angular CLI configuration
├── package.json             # Frontend dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

---

## 📋 Prerequisites

Ensure you have the following installed on your system before proceeding:

- **Node.js**: `v14.x` or higher
- **npm**: `v6.x` or higher
- **Angular CLI**: `v11.1.4` (`npm install -g @angular/cli@11.1.4`)
- **PostgreSQL**: `v12.x` or higher with **PostGIS extension** installed

---

## 🚀 Getting Started & Installation

### 1. Repository Setup

Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/msu-pms.git
cd msu-pms
```

---

### 2. Database Configuration

1. Create a PostgreSQL database (e.g., `msu_pms_db`).
2. Enable the PostGIS extension on your database:
   ```sql
   CREATE EXTENSION postgis;
   ```
3. Create the required tables (`users`, `parkingslots`, `msu_buildings`, `msu_roads`) with geometry columns for spatial features.
4. Configure database credentials in `server/config/config.ini`:

   ```ini
   user = your_db_user
   host = localhost
   database = msu_pms_db
   password = your_db_password
   port = 5432
   ```

---

### 3. Backend Server Setup

Navigate to the `server/` directory, install dependencies, and launch the Node Express API server:

```bash
cd server
npm install
node index.js
```

The server will run on **`http://localhost:5000`**.

---

### 4. Frontend Application Setup

In a new terminal window, navigate back to the root directory, install dependencies, and start the Angular development server:

```bash
# Return to repository root
cd ..

# Install dependencies
npm install

# Start Angular development server
npm start
# or
ng serve
```

Open your browser and navigate to **`http://localhost:4200/`**. The application will automatically reload if you modify any source files.

---

## 🔌 API Endpoints

The backend Express server exposes the following RESTful API endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status health check |
| `GET` | `/slots` | Retrieves all parking slots as GeoJSON Feature objects |
| `POST` | `/bookSlot` | Books a specific parking slot (`id`, `status`) |
| `POST` | `/updateslot` | Updates the status of a specific parking slot (`id`, `status`) |
| `POST` | `/updateall` | Updates the status of all parking slots in bulk (`status`) |
| `GET` | `/users/:email` | Fetches user details by email address |
| `GET` | `/buildings` | Retrieves campus buildings as GeoJSON Feature objects |
| `GET` | `/roads` | Retrieves campus road network as GeoJSON Feature objects |

---

## 🖼 Screenshots & UI Placeholders

| Interactive Map & Parking Slots | User Booking Interface |
| :---: | :---: |
| ![Interactive Map Placeholder](https://via.placeholder.com/600x350?text=MSU+Parking+Map+View) | ![Booking Interface Placeholder](https://via.placeholder.com/600x350?text=Slot+Booking+Interface) |

| Admin Dashboard | User Login |
| :---: | :---: |
| ![Admin Dashboard Placeholder](https://via.placeholder.com/600x350?text=Admin+Slot+Management) | ![Login Screen Placeholder](https://via.placeholder.com/600x350?text=User+Login) |

---

## 💻 Development Commands

| Task | Command |
| :--- | :--- |
| Run Dev Server | `ng serve` or `npm start` |
| Build for Production | `ng build --prod` |
| Run Unit Tests | `ng test` |
| Run Linter | `ng lint` |
| Run E2E Tests | `ng e2e` |

---

## 📄 License

This project is developed for **Midlands State University**. All rights reserved.
