const db =require('../db/connection')

// Create Query class to construct SQL queries

class Query {
    constructor(db) {
        this.db = db
    }
    // Add a new department
    addDept(data) {
        const values = [data.name]
        return this.db
          .promise()
          .query(`INSERT INTO department (name) VALUES(?)`, values )
    }
    // Add a new Role
    addRole(data) {
        const values = [data.title, data.salary, data.department_id]
        return this.db
          .promise()
          .query(`INSERT INTO role (title, salary, department_id) VALUES(?,?,?)`, values )
    }
    // Add a new Employee
    addEmp(data) {
        const values = [data.first, data.last, data.role_id, data.manager_id]
        return this.db
          .promise()
          .query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`, values )
    }
    // Delete an existing Department
    deleteDept(data) {
        const values = [data.dept_id]
        return this.db
            .promise()
            .query(`DELETE FROM department WHERE id = ?`, values )
    }
    // Delete an existing Role
    deleteRole(data) {
        const values = [data.role_id]
        return this.db
            .promise()
            .query(`DELETE FROM role WHERE id = ?`, values )
    }
    // Delete an existing Employee
    deleteEmp(data) {
        const values = [data.emp_id]
        return this.db
          .promise()
          .query(`DELETE FROM employee WHERE id = ?`, values )
    }
    // Update an existing Employee by their respective id
    updateEmpRoleById(data) {
        const values = [data.role_id, data.emp_id]
        return this.db
          .promise()
          .query(`UPDATE employee SET role_id = ? WHERE id = ?`, values )
    }
    // Update an existing Employee via their Manager id
    updateEmpManagerById(data) {
        const values = [data.manager_id, data.emp_id]
        return this.db
          .promise()
          .query(`UPDATE employee SET manager_id = ? WHERE id = ?`, values )
    }
    // Retrieve all Departments
    getDepts() {
        return this.db
          .promise()
        //   .query(`SELECT d.id AS ID, d.name AS Departments FROM department d`)
            .query(`SELECT * FROM department`)
    }

    // View all Departments
    getDeptsView() {
        return this.db
            .promise()
            .query(`SELECT d.id AS ID, d.name AS Departments FROM department d`)
    }

    // View Employees by Departments
    getEmpByDeptId(data) {
        const values = [data.dept_id]
        return this.db
          .promise()
          .query(
            `SELECT e.first_name AS "First Name" , e.last_name AS "Last Name", d.name AS Department 
            FROM employee e 
            INNER JOIN role r ON e.role_id = r.id 
            INNER JOIN department d ON r.department_id = d.id 
            WHERE d.id = ?`, values )
    }
    // View Employees by Manager
    getEmpByMgrId(data) {
        const values = [data.manager_id]
        return this.db
          .promise()
          .query(
            `SELECT e.first_name AS "First Name" , e.last_name AS "Last Name", 
            CONCAT(mgmt.first_name, ' ', mgmt.last_name) AS Manager FROM employee e 
            INNER JOIN employee mgmt ON e.manager_id = mgmt.id 
            WHERE e.manager_id = ?`, values )
    }
    // View budget of each department
    getBudgetByDept() {
        return this.db
          .promise()
          .query(
            `SELECT d.name AS Department, SUM(r.salary) AS Budget FROM role r 
            INNER JOIN department d ON r.department_id = d.id GROUP BY name`)
    }
    // View Roles
    getRoles() {
        return this.db
          .promise()
          .query(
            `SELECT r.title AS Title, r.id AS ID, r.salary AS Salary, d.name AS Department FROM role r 
            LEFT JOIN department d ON r.department_id = d.id 
            ORDER BY Department, r.id ASC`);
    }
    // View Role types
    getRoleIds(){
        return this.db
          .promise()
          .query(`SELECT * FROM role`)
    } 
    // View Employees & Details
    getEmps() {
        return this.db
          .promise()
          .query(
            `SELECT e.id as 'Employee_ID', e.first_name AS 'First_Name', e.last_name AS 'Last_Name',
            department.name AS Department, role.salary AS Salary, role.title AS Role,
            CONCAT(mgmt.first_name,' ',mgmt.last_name) as Manager
            FROM employee e LEFT JOIN employee mgmt ON e.manager_id = mgmt.id 
            INNER JOIN role ON e.role_id = role.id LEFT JOIN department 
            ON role.department_id = department.id ORDER BY e.id;`)
    }
    // View Employees
    getEmpRaw() {
        return this.db
        .promise()
        .query(`SELECT e.id, e.first_name, e.last_name FROM employee e`)
    }
    // View all Employees except Managers
    getNonManagers(){
        return this.db
        .promise()
        .query(
            `SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employee 
            WHERE manager_id IS NOT NULL`)
    }
    // View only Managers
    getManagers() {
        return this.db
          .promise()
          .query(
            `SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employee 
            WHERE manager_id IS NULL`)
    }
}

module.exports = new Query(db)