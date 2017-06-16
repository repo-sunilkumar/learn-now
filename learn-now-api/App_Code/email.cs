using System;
using System.Net.Mail;
using System.IO;
using System.Web;

/// <summary>
/// Summary description for email
/// </summary>
public class email
{
    public email()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    public static string SendEmail2(string _Subject, string EmailFrom, string EmailTo, string Password, string Body,Stream stream)
    {
        SmtpClient client = new SmtpClient();

        client.DeliveryMethod = SmtpDeliveryMethod.Network;
        client.EnableSsl = true;
        client.Host = "smtp.gmail.com";
        client.Port = 587;

        // setup Smtp authentication
        System.Net.NetworkCredential credentials = new System.Net.NetworkCredential(EmailFrom,Password);

        client.UseDefaultCredentials = false;
        client.Credentials = credentials;

        MailMessage msg = new MailMessage(EmailFrom, EmailTo)
        {
            Subject = _Subject,
            IsBodyHtml = true,
            Body = string.Format("<html><head></head><body>" + Body + "</body>")
        };
                
        Attachment at=new Attachment(stream,"PDFInvoice.pdf");
        msg.Attachments.Add(at);
        
        try
        {
            client.Send(msg);
            return "Your message has been successfully sent.";
        }
        catch (Exception ex)
        {
            Cmn.LogError(ex, "Email_Forgotmail()");
            return "Error occured while sending your message." + ex.Message;
        }        
    }

    public static string SendEmail(string Subject,string EmailTo,string Body)
    {
        string Data = "Sunil Kumar,skumar.mca2010@gmail.com,nehasunilrajput";
		//string Data = "Sunil Kumar,services@infonexus.in,VolmGnG5";
        string[] Fields = Data.Split(',');

        SmtpClient client = new SmtpClient();

        client.DeliveryMethod = SmtpDeliveryMethod.Network;
       client.EnableSsl = true;
        client.Host = "smtp.gmail.com";
	//	client.Host = "us2.smtp.mailhostbox.com";

        client.Port = 587;
		
        // setup Smtp authentication
        System.Net.NetworkCredential credentials = new System.Net.NetworkCredential("skumar.mca2010@gmail.com","nehasunilrajput");

        client.UseDefaultCredentials = false;
        client.Credentials = credentials;

        MailMessage msg = new MailMessage();
        msg.From = new MailAddress(Fields[1]);
        msg.Bcc.Add(new MailAddress(EmailTo));
        msg.To.Add(new MailAddress(Fields[1]));
        
        msg.Subject = Subject ;
        msg.IsBodyHtml = true;
        msg.Body = "<html><head></head><body>" + Body + "</body>";

        try
        {
            client.Send(msg);
            return "Your message has been successfully sent.";
        }
        catch (Exception ex)
        {
            Cmn.LogError(ex, "Email_Forgotmail()");
            return "Error occured while sending your message." + ex.Message;
        }
    }   
}
