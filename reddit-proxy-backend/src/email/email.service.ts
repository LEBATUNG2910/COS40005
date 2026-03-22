import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly appUrl: string;
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    this.appUrl = this.configService.get<string>('APP_URL') ?? 'http://localhost:5173';
    this.initTransporter();
  }

  private initTransporter() {
    const gmailUser = this.configService.get<string>('GMAIL_USER');
    const gmailPass = this.configService.get<string>('GMAIL_APP_PASSWORD');

    if (gmailUser && gmailPass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass },
      });
      console.log('✅ Email service: Gmail SMTP ready');
    } else {
      console.warn('⚠️ GMAIL_USER or GMAIL_APP_PASSWORD not set — emails will only be logged');
    }
  }

  // ─── Gửi email verify khi đăng ký ────────────────────────────
  async sendVerificationEmail(email: string, fullName: string, token: string): Promise<void> {
    const link = `${this.appUrl}/verify-email?token=${token}`;
    console.log(`[DEV] Verification link for ${email}:`, link);
    await this.send({
      to: email,
      subject: 'Verify your HireWise email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #0e7490; margin-bottom: 8px;">Welcome to HireWise 👋</h2>
          <p style="color: #374151;">Hi <strong>${fullName}</strong>,</p>
          <p style="color: #374151;">Please verify your email address to get started.</p>
          <a href="${link}" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #06b6d4; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Verify Email
          </a>
          <p style="color: #6b7280; font-size: 13px;">This link expires in 24 hours.</p>
          <p style="color: #9ca3af; font-size: 12px;">HireWise · AI-powered CV Analysis</p>
        </div>
      `,
    });
  }

  // ─── Gửi email reset password ─────────────────────────────────
  async sendPasswordResetEmail(email: string, fullName: string, token: string): Promise<void> {
    const link = `${this.appUrl}/reset-password?token=${token}`;
    console.log(`[DEV] Password reset link for ${email}:`, link);
    await this.send({
      to: email,
      subject: 'Reset your HireWise password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #0e7490; margin-bottom: 8px;">Reset Password</h2>
          <p style="color: #374151;">Hi <strong>${fullName}</strong>,</p>
          <p style="color: #374151;">We received a request to reset your password.</p>
          <a href="${link}" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #06b6d4; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Reset Password
          </a>
          <p style="color: #6b7280; font-size: 13px;">This link expires in 1 hour.</p>
          <p style="color: #9ca3af; font-size: 12px;">HireWise · AI-powered CV Analysis</p>
        </div>
      `,
    });
  }

  // ─── Core send via Gmail SMTP ─────────────────────────────────
  private async send(options: { to: string; subject: string; html: string }): Promise<void> {
    if (!this.transporter) {
      console.warn('Email not sent — no transporter configured');
      return;
    }

    const gmailUser = this.configService.get<string>('GMAIL_USER');
    try {
      await this.transporter.sendMail({
        from: `"HireWise" <${gmailUser}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log(`✅ Email sent to ${options.to}`);
    } catch (err) {
      console.error('Failed to send email:', err);
      // Không throw — không block flow chính
    }
  }
}