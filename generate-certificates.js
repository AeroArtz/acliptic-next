const mkcert = require('mkcert');
const fs = require('fs');
const path = require('path');

async function generateCertificates() {
  try {
    // Create certificates directory if it doesn't exist
    const certDir = path.join(process.cwd(), 'certificates');
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir);
    }

    // Initialize mkcert
    const ca = await mkcert.createCA({
      organization: 'Side Effect Dev CA',
      countryCode: 'US',
      state: 'California',
      locality: 'San Francisco',
      validity: 365 // Add this line - validity in days
    });

    if (!ca || !ca.cert || !ca.key) {
      throw new Error('Failed to create CA certificates');
    }

    console.log('CA certificates created successfully');

    // Create Certificate with proper error handling
    const cert = await mkcert.createCert({
      domains: ['127.0.0.1', 'localhost', '::1'],
      validity: 365, // Add this line - validity in days
      ca: {  // Change this to match the expected format
        key: ca.key,
        cert: ca.cert
      }
    });

    if (!cert || !cert.cert || !cert.key) {
      throw new Error('Failed to create server certificates');
    }

    console.log('Server certificates created successfully');

    // Write files with error handling
    try {
      fs.writeFileSync(path.join(certDir, 'ca.crt'), ca.cert);
      fs.writeFileSync(path.join(certDir, 'ca.key'), ca.key);
      fs.writeFileSync(path.join(certDir, 'cert.pem'), cert.cert);
      fs.writeFileSync(path.join(certDir, 'key.pem'), cert.key);
      console.log('Certificates written successfully to ./certificates/');
    } catch (writeError) {
      throw new Error(`Failed to write certificates: ${writeError.message}`);
    }

  } catch (err) {
    console.error('Error generating certificates:', err);
    process.exit(1);
  }
}

// Proper async execution
generateCertificates().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});