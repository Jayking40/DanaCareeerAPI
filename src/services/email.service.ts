import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendJobApplicationEmail(
    recipientEmail: string,
    firstName: string,
    lastName: string,
    jobTitle: string,
    resumeUrl: string,
    coverUrl: string
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `Application Received for ${jobTitle}`,
      html: this.generateJobApplicationTemplate(
        firstName,
        lastName,
        jobTitle,
        resumeUrl,
        coverUrl
      ),
    };

    await this.transporter.sendMail(mailOptions);
  }

  private generateJobApplicationTemplate(
    firstName: string,
    lastName: string,
    jobTitle: string,
    resumeUrl: string,
    coverUrl: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            line-height: 1.6;
          }
          .container {
            width: 90%;
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
          }
          .header h1 {
            margin: 0;
            color: #007bff;
          }
          .content {
            margin-top: 20px;
          }
          .content p {
            margin: 10px 0;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 5px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          }
          .button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Job Application Received</h1>
          </div>
          <div class="content">
            <p>Dear ${firstName} ${lastName},</p>
            <p>Thank you for applying for the <strong>${jobTitle}</strong> position. We have successfully received your application.</p>
            <p>You can review your submitted documents using the links below:</p>
            <a href="${resumeUrl}" class="button">View Resume</a>
            <a href="${coverUrl}" class="button">View Cover Letter</a>
            <p>We will review your application and get back to you shortly.</p>
            <p>Best regards,</p>
            <p><strong>The Hiring Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
