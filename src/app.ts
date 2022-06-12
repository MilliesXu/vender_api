import 'dotenv/config'

import { connectDB } from "./utils/connect";
import { createServer } from "./utils/server";
import { log } from './utils/logger';

import './utils/mailer'

const PORT = process.env.PORT as string
const app = createServer()

app.listen(PORT, () => {
  log.info(`Server start on port ${PORT}`)
  connectDB()
})
