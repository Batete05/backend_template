const router = require("express").Router();
const { json } = require("sequelize");
const { verifyToken } = require("../../../middlewares/verifyToken");
const { Employee } = require("../../../models/employees");
const { validateEmployee } = require("../../validators/employeeValidation");
require("dotenv").config();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { error } = validateEmployee(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingEmployee = await Employee.findOne({
      where: { email: req.body.email },
    });

    const existingEmployeeByNationalId = await Employee.findOne({
      where: { nationalId: req.body.nationalId },
    });

    const existingEmployeeByPhone = await Employee.findOne({
      where: { phone: req.body.phone },
    });
    const existingEmployeeBySerialNumber = await Employee.findOne({
      where: { serialNumber: req.body.serialNumber },
    });

    if (existingEmployeeBySerialNumber) {
      return res.status(400).json({
        message: "That employee with that serial number already exists",
      });
    }

    if (existingEmployee) {
      return res.status(400).json({
        message: "That employee with that email already exist in our system",
      });
    }
    if (existingEmployeeByNationalId) {
      return res
        .status(400)
        .json({ message: "That employee with that national Id already exist" });
    }
    if (existingEmployeeByPhone) {
      return res.status(400).json({
        message: "That employee with that phone number already exist",
      });
    }

    const employee = await Employee.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      nationalId: req.body.nationalId,
      department: req.body.department,
      position: req.body.position,
      laptopManufacture: req.body.laptopManufacture,
      model: req.body.model,
      serialNumber: req.body.serialNumber,
      isVerified: true,
    });

    return res.status(200).json({ message: "Success Employee added" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const findEmployee = await Employee.findAll();
    if (!findEmployee) {
      return res.status(400).jaon({ message: "Can't get any employee" });
    }
    return res.status(200).json({ message: findEmployee });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put("/update/:id",verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    const [updatedRowsCount] = await Employee.update(updatedData, {
      where: { id: userId },
    });

    if (updatedRowsCount === 0) {
      return res
        .status(404)
        .json({ message: "Employee not found or no changes made" });
    }

    // Fetch the updated employee data
    const updatedEmployee = await Employee.findByPk(userId);

    return res.status(200).json(updatedEmployee);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete('/delete/:id',verifyToken, async (req, res) => {
  try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }
      await employee.destroy();
      res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Failed to delete employee Error: '+err.message });
  }
});

// READ all employees with pagination
router.get('/pagination', verifyToken, async (req, res) => {
  try {
      // Read query parameters for pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const offset = (page - 1) * limit;

      const { count, rows: employees } = await Employee.findAndCountAll({
          offset,
          limit,
          order: [
              ['id', 'DESC'],
              ['createdAt', 'DESC']
          ],
      });
      // http://localhost:5000/v1/employee?page=2&limit=2
      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
          employees,
          pagination: {
              totalItems: count,
              totalPages,
              currentPage: page,
              perPage: limit,
          }
      });
  } catch (err) {
      res.status(500).json({ message: 'Failed to fetch employees', error: err.message });
  }
});

module.exports = router;
