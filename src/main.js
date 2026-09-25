import express from 'express'
import { authenticationController, messageController, userController } from './modules/index.js'
import { globalErrorHandling } from './middleware/index.js'
import { bootstrap } from './DB/connection.db.js'
import { PORT } from './config.js'
import cors from 'cors'
const app = express()

bootstrap(app , PORT);

app.use(cors() , express.json())

app.all("/", (req, res) => res.status(200).send({ message: "Welcome to BE API 🌸" }))

app.use("/auth", authenticationController)
app.use("/user", userController)
app.use("/message", messageController)

app.all("{/*dummy}", (req, res) => res.status(404).send({ message: "Invalid application routing" }))

app.use(globalErrorHandling)
