import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly appUrl: string;
  private readonly resendApiKey: string;
  private readonly gmailUser: string;
  private readonly gmailPass: string;

  constructor(private configService: ConfigService) {
    this.appUrl       = this.configService.get<string>('APP_URL') ?? 'http://localhost:5173';
    this.resendApiKey = this.configService.get<string>('RESEND_API_KEY') ?? '';
    this.gmailUser    = this.configService.get<string>('GMAIL_USER') ?? '';
    this.gmailPass    = this.configService.get<string>('GMAIL_APP_PASSWORD') ?? '';

    if (this.resendApiKey) {
      console.log('✅ Email service: Resend API ready');
    } else if (this.gmailUser && this.gmailPass) {
      console.log('✅ Email service: Gmail SMTP ready');
    } else {
      console.warn('⚠️ No email service configured — emails will only be logged');
    }
  }

  async sendVerificationEmail(email: string, fullName: string, token: string): Promise<void> {
    const link = `${this.appUrl}/verify-email?token=${token}`;
    console.log(`[DEV] Verification link for ${email}:`, link);
    await this.send({
      to: email,
      subject: 'Verify your HireWise email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #0e7490;">Welcome to HireWise 👋</h2>
          <p>Hi <strong>${fullName}</strong>,</p>
          <p>Please verify your email address to get started.</p>
          <a href="${link}" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #06b6d4; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Verify Email
          </a>
          <p style="color: #6b7280; font-size: 13px;">This link expires in 24 hours.</p>
          <p style="color: #9ca3af; font-size: 12px;">HireWise · AI-powered CV Analysis</p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, fullName: string, token: string): Promise<void> {
    const link = `${this.appUrl}/reset-password?token=${token}`;
    console.log(`[DEV] Password reset link for ${email}:`, link);
    await this.send({
      to: email,
      subject: 'Reset your HireWise password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #0e7490;">Reset Password</h2>
          <p>Hi <strong>${fullName}</strong>,</p>
          <p>We received a request to reset your password.</p>
          <a href="${link}" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #06b6d4; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Reset Password
          </a>
          <p style="color: #6b7280; font-size: 13px;">This link expires in 1 hour.</p>
          <p style="color: #9ca3af; font-size: 12px;">HireWise · AI-powered CV Analysis</p>
        </div>
      `,
    });
  }

  // ─── Tự động chọn Resend hoặc Gmail SMTP ─────────────────────
  private async send(options: { to: string; subject: string; html: string }): Promise<void> {
    // Ưu tiên Resend (hoạt động trên Railway)
    if (this.resendApiKey) {
      await this.sendViaResend(options);
      return;
    }
    // Fallback Gmail SMTP (chỉ hoạt động local)
    if (this.gmailUser && this.gmailPass) {
      await this.sendViaGmail(options);
      return;
    }
    console.warn('No email transport configured — skipping send');
  }

  private async sendViaResend(options: { to: string; subject: string; html: string }): Promise<void> {
    const fromEmail = this.configService.get<string>('EMAIL_FROM') ?? 'onboarding@resend.dev';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Resend error:', err);
    } else {
      console.log(`✅ Email sent via Resend to ${options.to}`);
    }
  }

  private async sendViaGmail(options: { to: string; subject: string; html: string }): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: this.gmailUser, pass: this.gmailPass },
    });
    try {
      await transporter.sendMail({
        from: `"HireWise" <${this.gmailUser}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log(`✅ Email sent via Gmail to ${options.to}`);
    } catch (err) {
      console.error('Gmail SMTP error:', err);
    }
  }
}