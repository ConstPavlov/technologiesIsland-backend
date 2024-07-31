import nodeMailer from 'nodemailer'
class MailService {

  constructor() {
    this.transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST ,
      port: process.env.SMTP_PORT ,
      secure: false,
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }
  async sendActivationMail(to, link) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Активация аккаунта на ' + process.env.API_URL,
        text: '',
        html: 
            `
              <div>
                  <h1>Для активации аккаунта перейдите по ссылке</h1>
                  <a href="${link}">${link}</a>
              </div>
            `
      })
    } catch (error) {
      console.error(error, 'ошибка черт побери в мейлере')
    }
  }
}


export default new MailService()