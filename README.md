# fictional-palm-tree
This is a simple project, used by learning purposes, intended to create a minimal authentication server which can be used to store the user data, create tokens and serve data from users associated with a given token.

Stack:
- Node.js web framework: **Restify**
- Authentication: **JWT**
- Database: **MongoDB**

## User Information
The server stores data from users using **MongoDB** and **mongoose**. the data required are **name**, **email**, **password**, **document number**, but more info can be sent to the server.

The password is not stored in the DB, and the package **password-hash** is used in order to generate secure hashes that the server keeps.

## Authentication
Once the user is authenticated, a **JWT** can be generated using the package **jsonwebtoken**. With this token the user would be able to get the user data and also be able to access other services via a authentication.

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/andrentaz/fictional-palm-tree/blob/master/LICENSE.md) file for details
