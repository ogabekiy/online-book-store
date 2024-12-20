export default function notFoundRoutes(req, res) {
  res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Page Not Found</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
          }
          .error {
            font-size: 10rem;
            font-weight: bold;
            color: #ff6b6b;
          }
          .message {
            font-size: 2rem;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error">404</div>
          <div class="message">Page Not Found</div>
        </div>
      </body>
      </html>
    `);
}
