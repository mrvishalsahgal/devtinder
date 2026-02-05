const express = require("express");
const app = express();

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

// app.get("/test", (req, res) => {
//   res.send("Testing the route");
// });

app.use(
  "/user",
  (req, res, next) => {
    console.log("Route handler 1");
    next();
  },
  (req, res) => {
    console.log("Route handler 2");
    res.send("User Data 2");
  },
  (req, res) => {
    console.log("Route handler 3");
    res.send("User Data 3");
  },
);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
