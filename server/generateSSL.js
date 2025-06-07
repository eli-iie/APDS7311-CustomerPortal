const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Ensure ssl directory exists
const sslDir = path.join(__dirname, 'ssl');
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir);
}

console.log('🔐 Generating SSL certificate and private key...');

// Install selfsigned package first if not available
try {
  require('selfsigned');
} catch (error) {
  console.log('Installing selfsigned package...');
  require('child_process').execSync('npm install selfsigned', { stdio: 'inherit' });
}

const selfsigned = require('selfsigned');

// Generate self-signed certificate
const attrs = [
  { name: 'commonName', value: 'localhost' },
  { name: 'countryName', value: 'US' },
  { shortName: 'ST', value: 'CA' },
  { name: 'localityName', value: 'San Francisco' },
  { name: 'organizationName', value: 'Customer Portal' },
  { shortName: 'OU', value: 'IT Department' }
];

const pems = selfsigned.generate(attrs, {
  keySize: 2048,
  days: 365,
  algorithm: 'sha256',
  extensions: [
    {
      name: 'basicConstraints',
      cA: true
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      timeStamping: true
    },
    {
      name: 'subjectAltName',
      altNames: [
        {
          type: 2, // DNS
          value: 'localhost'
        },
        {
          type: 7, // IP
          ip: '127.0.0.1'
        }
      ]
    }
  ]
});

// Write certificate and key files
const certPath = path.join(sslDir, 'server.crt');
const keyPath = path.join(sslDir, 'server.key');

fs.writeFileSync(certPath, pems.cert);
fs.writeFileSync(keyPath, pems.private);

console.log('✅ SSL Certificate generated:', certPath);
console.log('✅ Private Key generated:', keyPath);
console.log('🎉 SSL certificates are ready for use!');
console.log('📝 Note: These are self-signed certificates for development use.');
console.log('   For production, use certificates from a trusted Certificate Authority.');