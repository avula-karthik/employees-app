const Employee = require('../models').Employee;
const Department = require('../models').Department;
const { body, validationResult } = require('express-validator');

//Get all employees. get model and findAll and send response with status 200
//if failed to get employees then status 400 and send error
getAllEmployees = async (req, res) => {
    await Employee.findAll().then(
        (employeesArray) => {
            res.status(200).json({ data: employeesArray });
        },
        (error) => {
            res.status(400).json({ error: error });
        }
    );
};

//get id from req params. use this id to fetch the available records
//if employee exists then send 200 status
//if there is no employee with such id send 404 and not found
//if failed to fetch records then send 400 and error

getEmployeeById = async (req, res) => {
    let id = req.params.id;
    await Employee.findOne({ where: { id } }).then(
        (result) => {
            if (result == null) {
                res.status(404).json({ message: 'No such employee' });
            } else {
                res.status(200).json({ data: result });
            }
        },
        (error) => {
            res.status(400).json({ error });
        }
    );
};

//get id from req.params and using destroy to delete the record with such id.
//if the resultant result is 0 then there is no such user else the user record is deleted
//after deleting send 200 success code as response
//if error exists with 1292, user is trying to add a department that is not exists so we send 400 bad request

deleteEmployee = (req, res) => {
    Employee.destroy({ where: { id: req.params.id } }).then(
        (result) => {
            if (result == 0) {
                res.status(400).json({ message: 'No User with such id' });
            } else {
                res.status(200).json({ message: 'user deleted' });
            }
        },
        (error) => {
            if (error.parent.errno === 1292) {
                res.status(400).json({
                    message:
                        'Department adding failed. Choose available departments',
                });
            } else {
                res.status(500).json({ error: error });
            }
        }
    );
};

//check if there are any validation errors if errors exists send status 400 and errors
//first find any employee with such id if exists then use the new data getting from users and save to the database
//if user is trying to change department, we will check wheter we find any departments with user input else send 400 status with message no such department
//if there is no change in department, we will change data with new data and send 200 status
updateEmployeeData = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array() });
    } else {
        let updatedData = req.body;
        console.log(updatedData);
        console.log(updatedData.deptID);
        const checkIfAnyEmployeeWithSuchId = await Employee.findOne({
            where: { id: req.params.id },
        }).catch((error) => res.status(404).json({ error: 'No Such user' }));
        if (!checkIfAnyEmployeeWithSuchId) {
            res.json({
                message: 'No user exists with such ID. Please try later',
            });
        }
        try {
            if ('deptID' in updatedData) {
                const deptCheck = await Department.findOne({
                    where: { id: updatedData.deptID },
                });
                if (deptCheck) {
                    await Employee.update(updatedData, {
                        where: { id: req.params.id },
                    }).then(
                        res.status(200).json({
                            message: 'department found and details updated',
                        })
                    );
                } else {
                    res.status(400).json({ message: 'No such department' });
                }
            } else {
                await Employee.update(updatedData, {
                    where: { id: req.params.id },
                }).then(res.status(200).json({ message: 'Details updated' }));
            }
        } catch (error) {
            res.status(400).json({ status: error });
        }
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    deleteEmployee,
    updateEmployeeData,
};
