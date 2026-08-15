export const printQrCodeHTML = (logo, imgData) => {
  return `
    <html>
    <head>
      <title>Print QR Code</title>
      <style>
        body {
          display: flex;
          flex-direction: column;
          justify-content: center; 
          align-items: center;
          height: 100vh; 
          margin: 0;
        }
        .logo {
          width: 100px;
          margin-bottom: 20px;
        }
        .qrcode {
          margin-top: 20px; 
        }
      </style>
    </head>
    <body>
      <img className="logo" src="${logo}" alt="Logo" />
      <img className="qrcode" src="${imgData}"/>
    </body>
  </html>`;
};
