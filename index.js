const mysql = require('mysql');
const inquirer = require('inquirer');
const { restoreDefaultPrompts } = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user:'root',
    password: 'st182931',
    database: 'employeesDB'
});

const start = () => {
    console.clear();
    inquirer.prompt({
        name: 'mainMenu',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View all employees', 'View all departments', 'View all roles', 'Add employee', 'Add department', 'Add role', 'Update employee role', 'Exit'],
    }).then((answer) => {
        if(answer.mainMenu === 'View all employees') {
            viewEmployees();
        } else if (answer.mainMenu === 'View all departments') {
            viewDepartments();
        } else if (answer.mainMenu === 'View all roles') {
            viewRoles();
        } else if (answer.mainMenu === 'Add employee') {
            addEmployee();
        } else if (answer.mainMenu === 'Add department') {
            addDepartment();
        } else if (answer.mainMenu === 'Add role') {
            addRole();
        } else if (answer.mainMenu === 'Update employee role') {
            updateEmployee();
        } else {
            connection.end();
        }
    });
}

const viewEmployees = () => {
    console.clear();
    connection.query('SELECT employee.id, first_name, last_name, title, salary, name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;', (err,res) => {
        if(err) throw err;
        res.forEach(({id, first_name, last_name, title, salary, name}) => {
            console.log(`Employee #${id} | Name: ${first_name} ${last_name} | Department: ${name} | Role: ${title} | Salary: \$${salary}`);
        });
    });
    start();
}

const viewDepartments = () => {
    console.clear();
    connection.query('SELECT * FROM department', (err,res) => {
        if(err) throw err;
        res.forEach(({id, name}) => {
            console.log(`Department #${id} | Name: ${name}`);
        });
    });
    start();
}

const viewRoles = () => {
    console.clear();
    connection.query('SELECT role.id, title, salary, name FROM role INNER JOIN department ON role.department_id = department.id', (err,res) => {
        if(err) throw err;
        res.forEach(({id, title, salary, name}) => {
            console.log(`Role #${id} | Role: ${title} | Average Salary: ${salary} | Department: ${name}`);
        });
    });
    start();
}

const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Enter the employee\'s first name: '
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Enter the employee\'s last name: '
        },
    ]).then((answer) => {
        let employeeName = answer;
        connection.query('SELECT * FROM role;', (err,res) => {
            if(err) throw err;
            inquirer.prompt([
                {
                    name: 'roleSelect',
                    type: 'list',
                    message: 'Choose a role for ' + employeeName.firstName + " " + employeeName.lastName,
                    choices() {
                        const choiceArray = [];
                        res.forEach(({title}) => {
                            choiceArray.push(title);
                        })
                        return choiceArray;
                    }
                }
            ]).then((answer) => {
                let newID;
                //Finds id of selected role
                for(let n = 0; n < res.length; ++n) {
                    if(answer.roleSelect === res[n].title) {
                        newID = res[n].id;
                    }
                }
                connection.query('INSERT INTO employee SET ?',
                {
                    first_name: employeeName.firstName,
                    last_name: employeeName.lastName,
                    role_id: newID
                }, (err) => {
                    if(err) throw err;
                    console.log("Employee added successfully");
                });
            }).then(() => {
                start();
            });
        });
    });
}

const addDepartment = () => {
    inquirer.prompt([
        {
            name:'departmentName',
            type:'input',
            message:'Enter a name for the new department: '
        }
    ]).then((answer) => {
        connection.query('INSERT INTO department SET ?', 
        {
            name:answer.departmentName
        }, (err) => {
            if(err) throw err;
            console.log("Department added succesfully");
        });
    }).then(() => {
        start();
    });
}

const addRole = () => {
    inquirer.prompt([
        {
            name: 'titleName',
            type: 'input',
            message: 'Enter a name for the role: '
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter a salary for the role: '
        }
    ]).then((answer) => {
        let roleInfo = answer;
        connection.query('SELECT * FROM department', (err, res) => {
            if(err) throw err;
            inquirer.prompt([
                {
                    name: 'departmentChoice',
                    type: 'list',
                    message: 'Choose a department for the role: ',
                    choices() {
                        const choiceArray = [];
                        res.forEach(({name}) => {
                            choiceArray.push(name);
                        })
                        return choiceArray;
                    }
                }
            ]).then((answer) => {
                let newID;
                //Finds ID of selected department
                for(let n = 0; n < res.length; ++n) {
                    if(answer.departmentChoice === res[n].name) {
                        newID = res[n].id;
                    }
                }

                connection.query('INSERT INTO role SET ?', 
                {
                    title: roleInfo.titleName,
                    salary: (parseFloat(roleInfo.salary).toFixed(2)),
                    department_id: newID
                }, (err) => {
                    if(err) throw err;
                    console.log("Role added successfully");
                });
            }).then(() => {
                start();
            });
        });
    });
}

const removeEmployee = () => {

}

const updateEmployee = () => {
    connection.query('SELECT employee.id, first_name, last_name, title FROM employee INNER JOIN role ON employee.role_id = role.id;', (err,res) => {
        if(err) throw err;
        inquirer.prompt([
            {
                name: 'employeeSelect',
                type: 'list',
                message: 'Choose an employee to update.',
                choices() {
                    const choiceArray = [];
                    res.forEach(({first_name, last_name}) => {
                        choiceArray.push(first_name + " " + last_name);
                    });
                    return choiceArray;
                }
            }
        ]).then((answer) => {
            let answerSave = answer;
            let employeeList = res;
            connection.query('SELECT * FROM role;', (err,results) => {
                if(err) throw err;
                inquirer.prompt([
                    {
                        name: 'roleUpdate',
                        type: 'list',
                        message: 'Choose a new role for ' + answer.employeeSelect,
                        choices() {
                            const choiceArray = [];
                            results.forEach(({title}) => {
                                choiceArray.push(title);
                            })
                            return choiceArray;
                        }
                    }
                ]).then((answer) => {
                    let newID;
                    let employeeID;
                    let roleList = results;
                    let employeeName = answerSave.employeeSelect.split(" ");

                    // Finds ID for new selected Role for employee
                    for(let n = 0; n < roleList.length; ++n) {
                        if(answer.roleUpdate === roleList[n].title) {
                            newID = roleList[n].id;
                        }
                    }

                    //Finds selected employee's ID
                    for(let n = 0; n < employeeList.length; ++n) {
                        if(employeeName[0] === employeeList[n].first_name && employeeName[1] === employeeList[n].last_name) {
                            employeeID = employeeList[n].id;
                        }
                    }

                    connection.query('UPDATE employee SET ? WHERE ?', [
                        {
                            role_id: newID
                        },
                        {
                            id: employeeID
                        }
                    ]);

                    start();
                });
            });
        });
    });
}

connection.connect((err) => {
    if(err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
})