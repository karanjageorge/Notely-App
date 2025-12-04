import express from "express";

import { register } from "./controllers/Auth.ts";

import { checkDetails } from "./Middlewares/checkDetails.ts";
import { checkUsernameAndEmail } from "./Middlewares/checkUserNameAndEmai.ts";
import { checkPassword } from "./Middlewares/checkPasswordStrength.ts";

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies such as the req.body

app.get("/", (req, res) => {
  res.status(200).send("Hello, Notely!");
});
app.post(
  `/auth/register`,
  checkDetails,
  checkUsernameAndEmail,
  checkPassword,
  register,
);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
