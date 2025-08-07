import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

admin.initializeApp();

interface Invitation {
  email: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "test@gmail.com",
    pass: "mypassword",
  },
});

transporter.verify((error, success) => {
  if (error) {
    functions.logger.error("Nodemailer configuration error:", error);
  } else {
    functions.logger.info("Nodemailer configured successfully");
  }
});

export const handleEventInvitation = onDocumentCreated(
  {
    document: "events/{eventId}/invitations/{invitationId}",
    timeoutSeconds: 120,
  },
  async (event) => {
    const { eventId } = event.params;
    const invitationData = event.data?.data() as Invitation | { email: string };
const email = invitationData?.email || (invitationData as any)?.email;

    if (!email) {
      functions.logger.error("No email found in invitation", { eventId });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      functions.logger.error("Invalid email format", { email, eventId });
      return;
    }

    try {
      const eventDoc = await admin.firestore().collection("events").doc(eventId).get();
      if (!eventDoc.exists) {
        functions.logger.error("Event not found", { eventId });
        return;
      }
      const eventData = eventDoc.data();
      const eventTitle = eventData?.title || "an event";

      try {
        const user = await admin.auth().getUserByEmail(email);

        const mailOptions = {
          from: `"Event Mate" <${"test@gmail.com"}>`,
          to: email,
          subject: `You're invited to ${eventTitle}!`,
          html: `
            <p>Hi ${user.displayName || "there"},</p>
            <p>You've been invited to ${eventTitle}!</p>
            <p>Check your dashboard at <a href="https://yourapp.com/events/${eventId}">yourapp.com</a> for details.</p>
          `,
        };

        const result = await transporter.sendMail(mailOptions);
        functions.logger.info("Confirmation email sent", { email, eventId, messageId: result.messageId });

      } catch (error: any) {
        if (error.code === "auth/user-not-found") {
          const mailOptions = {
            from: `"Event App" <${functions.config().gmail.email}>`,
            to: email,
            subject: `Join ${eventTitle} on Our Platform!`,
            html: `
              <p>Hi there,</p>
              <p>You've been invited to ${eventTitle}!</p>
              <p>Please register at <a href="https://eventmate.com/signup?invite=${eventId}">this link</a> to join the event.</p>
            `,
          };

          const result = await transporter.sendMail(mailOptions);
          functions.logger.info("Registration invite sent", { email, eventId, messageId: result.messageId });
        } else {
          functions.logger.error("Error processing invitation", { email, eventId, error: error.message, stack: error.stack });
          return;
        }
      }
    } catch (error: any) {
      functions.logger.error("Unexpected error in handleEventInvitation", {
        email,
        eventId,
        error: error.message,
        stack: error.stack,
      });
    }
  }
);
