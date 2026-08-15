export const MailHTMLTemplate = (mainContent) => {
  return `
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" 
      rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" 
      crossorigin="anonymous">
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
       crossorigin="anonymous"></script>
      <title></title>
  </head>
    <body>
      ${mainContent}
     <footer style="font-size: 10px; margin-top: 5% ;">
      <div style="background-color: #62bad9;padding-top:20px; padding-bottom: 20px;">
        <div style="color: white; text-align:center; font-size: 12px;">
            <p color="white">
                <h2>57 Boulevard Demorieux<br></h2>
                <h2>72000, Le Mans<br></h2>
                <h2>Tél : +33 2 43 47 39 92<br></h2>
                <h2 style="color: white; text-decoration: none;">Email : contact@mindful-house.fr</h2>
            </p>
        </div>
      </div>
    </footer>
    </body>
  </html>
    `;
};
