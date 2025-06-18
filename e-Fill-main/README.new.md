# e-Fill - EV Charging Station Management System

<b>e-Fill</b> is a web app to find & locate the nearest EV Charging stations for registered users and also they can view the slots availability. It also helps the charging station owners to manage the status (like slots vacancy) of their bunk through online.

## Project Architecture

<div align="center">
    <img src="https://drive.google.com/uc?export=view&id=15mVJgcjVe35UAr01OC_Zo-gp59NJOAG1" alt="flow chart represents project architecture">
</div>

## Features

### For EV Drivers
- Search for nearby charging stations
- View real-time slot availability
- Book charging slots in advance
- View charging station details and directions
- User profile management
- Charging history tracking

### For Station Administrators (Bunk Managers)
- Manage charging station details (ADD/UPDATE/DELETE)
- Monitor charging slots in real-time
- View booking history and analytics
- Update slot availability
- Special admin interface for CRUD operations

## Technology Stack

* Firebase (Backend & Hosting)
* JavaScript (ES6+)
* HTML5
* CSS3
* jQuery
* Jest (Testing)
* ESLint & Prettier (Code Quality)
* Custom Logging Solution

## Project Structure

```
e-Fill/
├── Assets/            # Static assets
│   ├── CSS/          # Stylesheets
│   ├── JavaScript/   # Client-side scripts
│   │   ├── common/   # Shared utilities
│   │   ├── fireBase/ # Firebase integration
│   │   └── tests/    # Test suites
│   ├── Images/       # Image assets
│   └── Fonts/        # Custom fonts
├── common/           # Reusable components
└── tests/           # Test suites
```

## Getting Started

### Prerequisites

* Node.js and npm
* Firebase CLI
  ```powershell
  npm install -g firebase-tools
  ```

### Installation

1. Fork [this](https://github.com/yourusername/e-Fill) repository
2. Clone your forked copy:
   ```powershell
   git clone https://github.com/<your-username>/e-Fill.git
   cd e-Fill
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Replace Firebase configuration in `./Assets/JavaScript/fireBase/app.js`:
   ```js
   const firebaseConfig = {
        apiKey: "<api-key>",
        authDomain: "<app-name>.firebaseapp.com",
        databaseURL: "https://<app-name>-default-rtdb.firebaseio.com",
        projectId: "<your-project-id>",
        storageBucket: "<app-name>.appspot.com",
        messagingSenderId: "<your-own>",
        appId: "<your-own>"
    }
   ```

### Development

- Start local server: `npm start`
- Run tests: `npm test`
- Lint code: `npm run lint`
- Format code: `npm run format`
- Deploy: `npm run deploy`

## Firebase Database Structure

### Users Collection
```json
{
    "users": {
        "uid1": {
            "email": "user@example.com",
            "isAdmin": false,
            "name": "User Name"
        },
        "uid2": {
            "email": "admin@example.com",
            "isAdmin": true,
            "name": "Admin Name"
        }
    }
}
```

### Bunks Collection
```json
{
    "bunks": {
        "bunkId1": {
            "address": "123 Main St",
            "city": "Example City",
            "country": "Example Country",
            "createdOn": "2023-01-26T08:16:39.402Z",
            "email": "contact@bunk.com",
            "freeslots": 14,
            "imageUrl": "images/01",
            "modifiedOn": "2023-01-26T08:16:39.402Z",
            "name": "Bunk Name",
            "number": "1234567890",
            "ownerId": "uid2",
            "slots": 20
        }
    }
}
```

## Code Quality & Testing

- ESLint for code linting
- Prettier for code formatting
- Jest for unit testing
- Custom logging implementation
- Comprehensive error handling

## Security Features

- Firebase Authentication
- Protected admin routes
- Environment variables
- Input validation
- XSS protection

## Screenshots

<div align="center">
    <img src="https://drive.google.com/uc?export=view&id=1hTVbUMyp6gazOQHfmU3Xbsg2Mk_LUy0T" alt="viewing bunk details from locate charger page" width=300 height=500>
    <span>&emsp;&emsp;</span>
    <img src="https://drive.google.com/uc?export=view&id=1DbA1qDdYxhTV87BwbEGro6YN1G3a2PK3" alt="preview of building services page" width=300 height=500>
    <br><br>
    <img src="https://drive.google.com/uc?export=view&id=1hSDNY-p-XyouxhX17x15GZEyk8HMLy8u" alt="preview of add bunk page" width=300 height=400>
</div>

## Live Demo

Check out the live project at [e-fill-by-kumara.web.app](https://e-fill-by-kumara.web.app/)!

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes with proper commit messages
4. Push to your branch
5. Create a Pull Request

## License

This project is licensed under the [MIT License](LICENSE.md).
