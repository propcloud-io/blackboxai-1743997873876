import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key from environment
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendExportNotificationEmail(email, notification) {
  const msg = {
    to: email,
    from: 'notifications@propcloud.com',
    subject: `Your ${notification.export_type.toUpperCase()} export is ready`,
    text: `Your data export is ready for download: ${notification.download_link}`,
    html: `
      <div>
        <h2>Your PropCloud Export is Ready</h2>
        <p>
          Your ${notification.export_type.toUpperCase()} export containing 
          ${notification.record_count} records is ready for download.
        </p>
        <a href="${notification.download_link}" 
           style="display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 4px;">
          Download Export
        </a>
        <p style="margin-top: 20px;">
          This link will expire in 24 hours.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
}