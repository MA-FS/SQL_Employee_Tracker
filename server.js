// Require dependencies
const inquirer = require('inquirer')
const cTable = require('console.table')
const sql = require('./lib/queries')
const choices = require('./lib/choices')

// Add a new department
const newDept = async () => {  

    const department = await inquirer.prompt([
       {
         type: "input",
         name: "name",
         message: "What is the new Department name?",
         validate: (name) =>{
           if (name) {
             return true
           } else {
             console.log("! Please enter a Department name!")
             return false
           }
         },
      },
    ])
  
    await sql.addDept(department)
  
    chooseRequest()
}
  
// Add a new Employee
const newEmp = async () => {
  
    const roleArr = await choices.roleChoices()
  
    const mgmtArr = await choices.mgmtChoices()
  
    const emp = await inquirer.prompt([
        {
          type: "input",
          name: "first",
          message: "What is the new Employees First Name?",
          validate: (first) => {
            if (first && isNaN(first)) {
              return true
            } else {
              console.log("! Please enter a First Name!")
              return false
            }
          },
       },
       {
        type: "input",
        name: "last",
        message: "What is the new Employees Last Name?",
        validate: (last) => {
          if (last && isNaN(last)) {
            return true
          } else {
            console.log("! Please enter a Last Name!")
            return false
          }
        },
      },
      {
        type: "list",
        name: 'role_id',
        message: "What is the new Employees Role?",
        choices: roleArr,
        loop: false,
      },
      {
        type: "list",
        name: 'manager_id',
        message: "Who is the new Employees Manager?",
        choices: mgmtArr,
        loop: false,
      }
     ])
  
    await sql.addEmp(emp)
  
    chooseRequest()
}
  
// Add a new Role
const newRole = async () => {
  
    const choicesArr = await choices.deptChoices()
  
    const role = await inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the new Role?",
          validate: (title) => {
            if (title) {
              return true
            } else {
              console.log("! Please enter a Role Name!")
              return false
            }
          },
       },
       {
         type: "input",
         name: 'salary',
         message: "What is the Salary of the new Role?",
         validate: (salary) =>{
           if(salary && !isNaN(salary)) {
             return true
           } else {
             console.log("! Please enter a Role Salary")
           }
         }
       },
       {
        type: "list",
        name: 'department_id',
        message: "Which Department is the new Role associated with?",
        choices: choicesArr,
        loop: false,
      }
     ])
  
    await sql.addRole(role)
  
    chooseRequest()   
}
  
// Delete an Employee
const delEmp = async () => {
    const empArr = await choices.NonMgmtChoices()
  
    const emp = await inquirer.prompt([
      {
        type: "list",
        name: "emp_id",
        message: "Which Employee do you want to Delete?",
        choices: empArr,
        loop: false,
      }
     ])
  
    await sql.deleteEmp(emp)
  
    chooseRequest()
}
  
// Update an Employees role
const updateEmpRole = async () => {
  
    const roleArr = await choices.roleChoices()
  
    const empArr = await choices.empChoices()
  
    const emp = await inquirer.prompt([
      {
        type: "list",
        name: "emp_id",
        message: "Which Employee do you want to update?",
        choices: empArr,
        loop: false,
      },
      {
        type: "list",
        name: 'role_id',
        message: "What is the Employees new Role?",
        choices: roleArr,
        loop: false,
      }
     ])
  
    await sql.updateEmpRoleById(emp)
  
    chooseRequest()  
}
  
// Update an Employees Manager
const updateEmpManager = async () => {
  
    const empArr = await choices.NonMgmtChoices()
  
    const mgmtArr = await choices.mgmtChoices()
  
    const emp = await inquirer.prompt([
      {
        type: "list",
        name: "emp_id",
        message: "Which Employee do you want to update?",
        choices: empArr,
        loop: false,
      },
      {
        type: "list",
        name: 'manager_id',
        message: "Who is the Employees new Manager?",
        choices: mgmtArr,
        loop: false,
      }
     ])
  
    await sql.updateEmpManagerById(emp)
  
    chooseRequest()  
}
  
// View all Departments
const viewDepts = () => {
    sql.getDeptsView()
  
    .then(([rows]) => {
      console.log('\n')
      console.log(cTable.getTable(rows))
    })
  
    .then(()=> {
        chooseRequest()
    }) 
}
  
// View all Roles
const viewRoles = () => {
    sql.getRoles()
  
    .then(([rows]) => {
      console.log('\n')
      console.log(cTable.getTable(rows))
    })
  
    .then(()=> {
        chooseRequest()
    }) 
}
// View all Employees
  const viewEmps = () => {
    sql.getEmps()
  
    .then(([rows]) => {
      console.log('\n')
      console.log(cTable.getTable(rows))
    })
  
    .then(()=> {
        chooseRequest()
    }) 
}
  
// View all Departments and their Budget 
const viewBudgets = async () => {
  
    sql.getBudgetByDept()
  
    .then(([rows]) => {
      console.log('\n')
      console.log(cTable.getTable(rows))
    })
  
    .then(()=> {
        chooseRequest()
    }) 
}
  
// View all Employees in a specific Department
const viewEmpByDept = async () => {
  
    const deptArr = await choices.deptChoices()
  
    inquirer.prompt([
      {
        type: "list",
        name: "dept_id",
        message: "Which Department do you want to view Employees for?",
        choices: deptArr,
        loop: false
      }
     ])
  
    .then((data) => {
      sql.getEmpByDeptId(data)
        .then(([rows]) =>{
          console.log('\n')
          console.log(cTable.getTable(rows))
          chooseRequest()
        })
    }) 
}
  
// View all Employees who report to a specific Manager
const viewEmpByMgr = async () => {
  
    const mgmtArr = await choices.mgmtChoices()
  
    inquirer.prompt([
      {
        type: "list",
        name: "manager_id",
        message: "Which Manager do you want to view Employees for?",
        choices: mgmtArr,
        loop: false
      }
     ])
  
    .then((data) => {
      sql.getEmpByMgrId(data)
        .then(([rows]) =>{
          console.log('\n')
          console.log(cTable.getTable(rows))
          chooseRequest()
        })
    }) 
}
  
// Main menu options function
const chooseRequest = () => {

    inquirer.prompt([
        {
          type: 'list',
          name: 'request',
          message: 'What would you like to do?',
          choices: ['View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add a Department', 
                    'Add a Role',
                    'Add an Employee',
                    'Update Employees Role',
                    // Bonuses
                    'Update Employees Manager',
                    'View Employees by Manager',
                    'View Employees by Department',
                    //TODO
                    //Delete Departments
                    //Delete Roles
                    'Delete an Employee', 
                    'View Department Budget'                 
                   ],
          loop: false,
        },
    ])
  
    .then((data) => {
        const {request} = data
        console.log(request)

      switch (request) {
          case 'Add a Department':
            newDept()
            break
          case 'Add a Role':
            newRole()
            break
          case 'Add an Employee':
            newEmp()
            break
          case 'Delete an Employee':
            delEmp()
            break
          case 'Update Employees Role':
            updateEmpRole()
            break
          case 'Update Employees Manager':
            updateEmpManager()
            break
          case 'View All Departments':
            viewDepts()
            break
          case 'View All Employees':
            viewEmps()
            break
          case 'View All Roles':
            viewRoles()
            break         
          case 'View Department Budget':
            viewBudgets()
            break
          case 'View Employees by Department':
            viewEmpByDept()
            break
          case 'View Employees by Manager':
            viewEmpByMgr()
            break                
      
          default:
              break
      }
    })
}

const welcomeBanner = () => {
    console.log(`
    ██████████                           ████                                       
    ░░███░░░░░█                          ░░███                                       
     ░███  █ ░  █████████████   ████████  ░███   ██████  █████ ████  ██████   ██████ 
     ░██████   ░░███░░███░░███ ░░███░░███ ░███  ███░░███░░███ ░███  ███░░███ ███░░███
     ░███░░█    ░███ ░███ ░███  ░███ ░███ ░███ ░███ ░███ ░███ ░███ ░███████ ░███████ 
     ░███ ░   █ ░███ ░███ ░███  ░███ ░███ ░███ ░███ ░███ ░███ ░███ ░███░░░  ░███░░░  
     ██████████ █████░███ █████ ░███████  █████░░██████  ░░███████ ░░██████ ░░██████ 
    ░░░░░░░░░░ ░░░░░ ░░░ ░░░░░  ░███░░░  ░░░░░  ░░░░░░    ░░░░░███  ░░░░░░   ░░░░░░  
                                ░███                      ███ ░███                   
                                █████                    ░░██████                    
                               ░░░░░                      ░░░░░░                     
     ██████   ██████                                                                 
    ░░██████ ██████                                                                  
     ░███░█████░███   ██████   ████████    ██████    ███████  ██████  ████████       
     ░███░░███ ░███  ░░░░░███ ░░███░░███  ░░░░░███  ███░░███ ███░░███░░███░░███      
     ░███ ░░░  ░███   ███████  ░███ ░███   ███████ ░███ ░███░███████  ░███ ░░░       
     ░███      ░███  ███░░███  ░███ ░███  ███░░███ ░███ ░███░███░░░   ░███           
     █████     █████░░████████ ████ █████░░████████░░███████░░██████  █████          
    ░░░░░     ░░░░░  ░░░░░░░░ ░░░░ ░░░░░  ░░░░░░░░  ░░░░░███ ░░░░░░  ░░░░░           
                                                    ███ ░███                         
                                                   ░░██████                          
                                                    ░░░░░░                           `)
}

welcomeBanner()
chooseRequest()