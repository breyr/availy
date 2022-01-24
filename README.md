# Availy
Project repository for Availy web app. Light LegWorQ. Powered by JavaScript, MySQL Database, and Oracle Cloud.

## Documentation

### NodeJS and Express
Server is configured using NodeJS and npm package Express.js. Server host on port 80 and internal TCP port '0.0.0.0' for MySQL connection.

### MySQL Database
Credentials to the MySQL Database is pulled from a dotenv file stored locally serverside for database security. MySQL database is hosted on a separate Oracle Cloud virtual machine with only specific ports open for MySQL Workbench and NodeJs Oracle Cloud virtual machine access. The main MySQL database is formally named availydb and contains one table named userinfo. This table contains all information about users including, username, email, password, employer, cookie, and dates. The PK is AI and is in the ID index. Username and email must be UN and NN to be a valid query, and password must be NN, which is previously checked on HTML for double error protection.

### Cookie Authentication
The start infrastructure is based on cookie updating and assigning. When a user is detected in the start screen without a cookie they must login or create an account. Whereas if the user has previously logged in in the past week they are permitted to bypass the start screen automatically and are redirected to the home page. When users create an account they are assigned a cookie with the current time and date following after their username. When users login their cookie is updated with the current time and date. When users are detected in dashboard without a cookie they are redirected automatically to the start page.
