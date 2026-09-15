package com.krishna.lostfoundportal.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendClaimApprovedEmail(
            String recipientEmail,
            String recipientName,
            String itemName
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(recipientEmail);

        message.setSubject(
                "Your FindLost claim has been approved"
        );

        message.setText(
                "Hi " + recipientName + ",\n\n"
                + "Good news! Your claim for \""
                + itemName
                + "\" has been approved on FindLost.\n\n"
                + "Please log in to your FindLost account "
                + "to view your claim details and arrange "
                + "the safe return of the item.\n\n"
                + "Thank you for using FindLost.\n\n"
                + "FindLost Team"
        );

        mailSender.send(message);
    }


    public void sendClaimRejectedEmail(
            String recipientEmail,
            String recipientName,
            String itemName
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(recipientEmail);

        message.setSubject(
                "Update on your FindLost claim"
        );

        message.setText(
                "Hi " + recipientName + ",\n\n"
                + "Your claim for \""
                + itemName
                + "\" was not approved on FindLost.\n\n"
                + "You can log in to your account to review "
                + "your claim details.\n\n"
                + "Thank you for using FindLost.\n\n"
                + "FindLost Team"
        );

        mailSender.send(message);
    }
}