import fs from "fs";
import path from "path";

function getEmailContent(
  emailType: "transactional" | "marketing",
  htmlBody: string
) {
  // Import and convert the email header image to base64
  const imagePath = path.join(process.cwd(), "public", "email-header.png");
  const imageBuffer = fs.readFileSync(imagePath);
  const emailHeaderBase64 = imageBuffer.toString("base64");

  const unsubscribeLink =
    emailType === "marketing"
      ? '<p style="text-align: center; margin-top: 30px; font-size: 12px; color: #666666;"><a href="{{ unsubscribe }}" style="color: #666666; text-decoration: underline;">Unsubscribe</a></p>'
      : "";

  const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header-image {
            width: 100%;
            height: auto;
            display: block;
        }
        .content {
            padding: 30px;
            line-height: 1.6;
            color: #333333;
        }
        .unsubscribe {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666666;
        }
        .unsubscribe a {
            color: #666666;
            text-decoration: underline;
        }
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .content {
                padding: 20px !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <img src="data:image/png;base64,${emailHeaderBase64}" alt="Email Header" class="header-image" />
        <div class="content">
            ${htmlBody}
        </div>
        ${unsubscribeLink}
    </div>
</body>
</html>`;

  return emailHTML;
}

export default getEmailContent;
