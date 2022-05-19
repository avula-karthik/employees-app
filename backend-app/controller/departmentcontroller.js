const Department = require('../models').Department;

//get all departments and display to users after authentication
//status 200 by sending all available departments
//500 if server fails to fetch records
const getAllDepartments = (req, res) => {
    Department.findAll().then(
        (department_list) => {
            res.status(200).json(department_list);
        },
        (error) => {
            res.status(500).json(error);
        }
    );
};

//add departments with name.
//check if department already exists - send 409 conflict error
//if no such department then add department with user input name and set status 200
const addDepartment = async (req, res) => {
    const checkDepartment = await Department.findOne({
        where: { dept_name: req.body.dept_name },
    }).catch((err) => {
        console.log('Error', err);
    });
    if (checkDepartment) {
        return res.status(409).json({ message: 'Department already exists' });
    }
    const newDepartment = new Department({ dept_name: req.body.dept_name });
    await newDepartment
        .save()
        .then(res.json({ msg: 'department added' }).status(200));
};
module.exports = { getAllDepartments, addDepartment };
