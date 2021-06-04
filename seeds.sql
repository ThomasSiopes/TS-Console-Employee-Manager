USE employeesDB;

INSERT INTO department (name) VALUES ("Produce");
INSERT INTO department (name) VALUES ("Checkout");
INSERT INTO department (name) VALUES ("Dairy");

INSERT INTO role (title, salary, department_id) VALUES ("Sales Floor", 12.50, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Sales Worker", 12.50, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Cashier", 13.50, 2);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("Tom", "S", 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Josh", "P", 3);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Alex", "V", 2);

SELECT employee.id, first_name, last_name, title, salary FROM employee INNER JOIN role ON employee.role_id = role.id;
SELECT employee.id, first_name, last_name, title, salary, name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;