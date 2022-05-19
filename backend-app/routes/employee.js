var express = require('express');
const Employee = require('../models').Employee;
const Department = require('../models').Department;
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');

var multer = require('multer');
var cors = require('cors');
var authenticationMiddleware = require('../middlewares/authentication');

let uniqueName = null;
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        uniqueName = Date.now() + '_' + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fieldNameSize: 10000, fileSize: 10240000 },
    fileFilter: (req, file, cb) => {
        console.log('File Filter Running');
        if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg, .jpeg are allowed'));
        }
    },
});

var router = express.Router();
router.use(bodyParser.json());

router.use(cors());

const {
    getAllEmployees,
    deleteEmployee,
    getEmployeeById,
    updateEmployeeData,
} = require('../controller/employeecontroller');

router.get('/', authenticationMiddleware, getAllEmployees);
router.delete('/:id', authenticationMiddleware, deleteEmployee);
router.get('/:id', authenticationMiddleware, getEmployeeById);
router.put(
    '/:id',
    authenticationMiddleware,
    [
        body('email').trim().isEmail().withMessage('Not a valid email'),
        body('name')
            .trim()
            .isLength({ min: 2 })
            .withMessage('Not a valid Name'),
    ],
    updateEmployeeData
);
module.exports = router;

router.post(
    '/',
    authenticationMiddleware,
    upload.single('imageurl'),
    async (req, res) => {
        const errors = validationResult(req);
        console.log(req.body.email);
        console.log(errors);

        let { name, email, deptID, role, isActive } = req.body;
        const deptCheck = await Department.findOne({
            where: { id: deptID },
        }).catch((error) => res.json(error));
        if (deptCheck) {
            const employeeCheck = await Employee.findOne({
                where: { email },
            }).catch((error) =>
                res.status(404).json({ message: 'No such user' })
            );
            if (employeeCheck) {
                res.status(409).json({
                    message: 'Conflict-Employee already exists with this email',
                });
            } else {
                let newEmployee = new Employee({
                    name,
                    email,
                    deptID,
                    imageurl: `/uploads/${uniqueName}`,
                    role,
                    isActive,
                });
                newEmployee
                    .save()
                    .then(res.status(200).json({ mesage: 'Employee added' }));
            }
        } else {
            res.status(404).json('No such department');
        }
    }
);
