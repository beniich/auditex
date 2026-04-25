import { prisma } from '../../lib/prisma';
import fs from 'fs';
import path from 'path';

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  attachments?: {
    filename: string;
    content: string; // Base64
    contentType: string;
  }[];
}

export class CommunicationService {
  /**
   * Mock email sending service
   * In a real production app, this would use Nodemailer, SendGrid, or AWS SES.
   */
  static async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId: string }> {
    console.log(`[CommunicationService] Sending email to: ${options.to}`);
    console.log(`[CommunicationService] Subject: ${options.subject}`);
    
    if (options.attachments) {
      console.log(`[CommunicationService] Attachments: ${options.attachments.map(a => a.filename).join(', ')}`);
      // Simulate saving to a local "sent_emails" folder for audit purposes in dev mode
      const devEmailsDir = path.join(process.cwd(), 'audit_logs', 'sent_emails');
      if (!fs.existsSync(devEmailsDir)) {
        fs.mkdirSync(devEmailsDir, { recursive: true });
      }
      
      const fileName = `email_${Date.now()}_${options.to}.json`;
      fs.writeFileSync(path.join(devEmailsDir, fileName), JSON.stringify({
        ...options,
        timestamp: new Date().toISOString()
      }, null, 2));
    }

    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500));

    return {
      success: true,
      messageId: `msg_${Math.random().toString(36).substr(2, 9)}`
    };
  }
}
