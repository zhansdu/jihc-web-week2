## API Endpoints

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/users` | Get the list of all users | 200 |
| **POST** | `/register` | Register the new user | 201 / 400 |
| **POST** | `/login` | Enter again(authorization) | 200 / 401 |
| **PUT** | `/users/edit/:id` | Edit the personal data | 200 / 404 |
| **DELETE** | `/users/:id` | Delete the user | 200 / 404 |