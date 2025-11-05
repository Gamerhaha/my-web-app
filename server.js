const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CI/CD Pipeline Dashboard</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 50px;
          max-width: 600px;
          width: 100%;
          animation: slideIn 0.6s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .logo svg {
          width: 45px;
          height: 45px;
          fill: white;
        }

        h1 {
          color: #2d3748;
          font-size: 2.5em;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .subtitle {
          color: #718096;
          font-size: 1.1em;
        }

        .info-card {
          background: linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%);
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 20px;
          border-left: 5px solid #667eea;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .info-card:hover {
          transform: translateX(5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .info-label {
          color: #718096;
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .info-value {
          color: #2d3748;
          font-size: 1.3em;
          font-weight: 600;
          word-break: break-all;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          margin-top: 20px;
          box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);
        }

        .status-dot {
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          animation: blink 1.5s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
        }

        .health-link {
          display: inline-block;
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .health-link:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }

        @media (max-width: 600px) {
          .container {
            padding: 30px;
          }

          h1 {
            font-size: 2em;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h1>CI/CD Pipeline</h1>
          <p class="subtitle">yayy!the Deployment is Successful</p>
        </div>

        <div class="info-card">
          <div class="info-label">Message</div>
          <div class="info-value">Hello from Sugin  IOT! 🚀</div>
        </div>

        <div class="info-card">
          <div class="info-label">Version</div>
          <div class="info-value">1.0.0</div>
        </div>

        <div class="info-card">
          <div class="info-label">Timestamp</div>
          <div class="info-value">${new Date().toISOString()}</div>
        </div>

        <div style="text-align: center;">
          <span class="status-badge">
            <span class="status-dot"></span>
            System Online
          </span>
        </div>

        <div class="footer">
          <a href="/health" class="health-link">Check Health Status →</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Health Check - CI/CD Pipeline for devops</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 50px;
          max-width: 500px;
          width: 100%;
          text-align: center;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .checkmark-circle {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          border-radius: 50%;
          margin: 0 auto 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 40px rgba(72, 187, 120, 0.4);
          animation: scaleIn 0.6s ease-out 0.2s both;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .checkmark {
          width: 60px;
          height: 60px;
          stroke: white;
          stroke-width: 4;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .checkmark-path {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw 0.8s ease-out 0.4s forwards;
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        h1 {
          color: #2d3748;
          font-size: 2.5em;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .status-text {
          color: #48bb78;
          font-size: 1.5em;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .details {
          background: linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%);
          border-radius: 15px;
          padding: 25px;
          margin: 30px 0;
          text-align: left;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: #718096;
          font-weight: 600;
        }

        .detail-value {
          color: #2d3748;
          font-weight: 600;
        }

        .back-link {
          display: inline-block;
          color: #48bb78;
          text-decoration: none;
          font-weight: 600;
          padding: 12px 30px;
          border: 2px solid #48bb78;
          border-radius: 8px;
          transition: all 0.3s ease;
          margin-top: 20px;
        }

        .back-link:hover {
          background: #48bb78;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(72, 187, 120, 0.3);
        }

        @media (max-width: 600px) {
          .container {
            padding: 30px;
          }

          h1 {
            font-size: 2em;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="checkmark-circle">
          <svg class="checkmark" viewBox="0 0 52 52">
            <path class="checkmark-path" d="M14 27l8 8 16-16"/>
          </svg>
        </div>

        <h1>Health Check</h1>
        <div class="status-text">All Systems Operational</div>

        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value">✓ Healthy</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Uptime!!!!</span>
            <span class="detail-value">${Math.floor(process.uptime())} seconds</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Memory Usage</span>
            <span class="detail-value">${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Node Version</span>
            <span class="detail-value">${process.version}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Last Checked</span>
            <span class="detail-value">${new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <a href="/" class="back-link">← Back to Home</a>
      </div>
    </body>
    </html>
  `);
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;