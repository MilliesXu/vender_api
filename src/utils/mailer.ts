import nodemailer, { SendMailOptions } from 'nodemailer'

import { MyError } from '../middlewares/errorHandler'
import { log } from './logger'

const smtp = {
  user: process.env.SMTP_USER as string,
  pass: process.env.SMTP_PASS as string,
  host: process.env.SMTP_HOST as string,
  port: parseInt(process.env.SMTP_PORT as string),
  secure: process.env.SMTP_SECURE as string === 'true'
}

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: {
    user: smtp.user,
    pass: smtp.pass
  }
})

const sendMail = async (payload: SendMailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(payload, (err, info) => {
      if (err) {
        reject(new MyError('Failed to send email', 500))
      }

      resolve(log.info(`Preview url: ${nodemailer.getTestMessageUrl(info)}`))
    })
  })
}

export default sendMail
