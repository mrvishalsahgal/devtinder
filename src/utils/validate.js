const bcrypt = require("bcrypt");
const validator = require("validator");

const validatorSignup = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Invalid password");
  }
};

const profileValidate = (req) => {
  const isAllowedFields = [
    "firstName",
    "lastName",
    "email",
    "age",
    "gender",
    "role",
    "skills",
  ];
  const isAllowedField = Object.keys(req.body).every((field) =>
    isAllowedFields.includes(field),
  );
  return isAllowedField;
};

module.exports = {
  validatorSignup,
  profileValidate,
};
