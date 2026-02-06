const adminAuth = (req, res, next) => {
  const token = "xyz";
  if (token === "xyz") {
    console.log("Admin Auth sucessful");

    next();
  } else {
    res.status(401).send("Invalid Token");
  }
};

const userAuth = (req, res, next) => {
  const token = "abc";
  if (token === "abc") {
    console.log("User Auth sucessful");
    next();
  } else {
    res.send("Invalid Token");
  }
};

module.exports = { adminAuth, userAuth };
