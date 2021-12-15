# TS-Console-Employee-Manager

This project is an employee managing system that uses the mySQL workbench to handle an sql schema containing a database of information regarding employees, roles, and departments.

The application is run through console. First, the user must turn the file "schema.sql" into an sql database using MySQL Workbench. Make sure the localhost connection on the MySQL Workbench matches this application's server connection. The user may then seed the database by running "seeds.sql," if they desire. Then, on a console, the user must run "npm start." The application will then prompt the user to view the current (optionally prebuilt by seeds) database, and make any necessary additions by adding a new employee, department, or role.