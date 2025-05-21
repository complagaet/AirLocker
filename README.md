# AirLocker

![Screenshot](https://raw.githubusercontent.com/complagaet/AirLocker/refs/heads/main/Images/1.png)

## Launch

Clone repository and install dependencies
```bash
git clone https://github.com/complagaet/AirLocker.git
cd AirLocker

yarn install
```

Place the .env file in AirLocker/Backend or configure the environment variables another way
```dotenv
PORT=3000              # Port for the backend server
DB_URL=mongodb://...   # Your database connection string
JWT_SECRET=yourSecret  # Secret key for JWT signing
JWT_LIFETIME=1d        # Token expiration (e.g., '1d' for 1 day)
```

Run in Dev Mode:
```bash
yarn dev
```

To build the project and start the production server:
```bash
yarn build # Builds the project for production.
yarn start # Starts the production server after build.
```

## Arduino

The remote-controlled physical lock is implemented using Arduino. This project is part of my exploration of various technologies, so the communication between the client and the Arduino is not secured. A simple one-letter command is used to open or close the lock.

The Arduino sketch can be found in the `AirLocker/AirLockerArduino` directory. By default, a baud rate of `9600` is used for serial communication.

Overall, there is plenty of room for improvement — the Arduino could be replaced with another device, or a lightweight client could be developed to communicate with the API independently.

## Python Client

The user interface is based on one of my previous projects — [ElectroDraw](https://github.com/complagaet/ElectroDraw).
Funny enough, this turned out to be an electronic lock powered by PyGame 😄

The client uses the PySerial library to communicate with the Arduino. When you first launch the app, it automatically creates a `settings.json` file, which stores the user token, selected lock, and serial port.
To reset the client settings, simply delete this file.

To connect the client to your own server, change the API address in `AirLocker/AirLockerPy/script/config_loader.py`, in the `DEFAULT_SETTINGS` dictionary:

```python
DEFAULT_SETTINGS = {
    "api": "https://airlocker.onrender.com/api",  # e.g. http://localhost:3000/api
    "token": "",
    "username": "",
    "email": "",
    "lockers": [],
    "lockerId": "",
    "port": ""
}
```

The program uses the requests library to interact with the API. Since it's a synchronous library, the UI becomes unresponsive during network calls. I’ve tried to display a loading message before each request to inform the user.