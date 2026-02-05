const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middleware/auth");

// app.get("/user/:id/:name/:age", (req, res) => {
//   console.log(req.params);
//   res.send({ firstName: "Vishal", lastName: "Sahgal", age: 22 });
// });

// app.post("/user", (res, req) => {
//   req.send("User Data Changed");
// });

// app.put("/user", (res, req) => {
//   req.send("User Data Updated");
// });

// app.delete("/user", (res, req) => {
//   req.send("User Data Deleted");
// });

app.get("/test", (req, res, next) => {
  try {
    console.log("Test Route");
    next();
    throw new Error("Something went wrong");
  } catch (error) {
    next(error);
    res.send("Testing the route");
  }
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong global");
  }
});

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("Admin Data");
});
app.get("/admin/getSpecificData", (req, res) => {
  res.send("Admin Specific Data");
});

app.get("/user/login", (req, res) => {
  res.send("User Login");
});

app.get("/user/getAllData", userAuth, (req, res) => {
  res.send("User Data");
});

// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("Route handler 1");
//     next();
//   },
//   (req, res) => {
//     console.log("Route handler 2");
//     res.send("User Data 2");
//   },
//   (req, res) => {
//     console.log("Route handler 3");
//     res.send("User Data 3");
//   },
// );

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
