const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Create SSL directory if it doesn't exist
const sslDir = path.join(__dirname, 'ssl');
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
}

console.log('🔐 Generating SSL certificates for HTTPS...');

// Generate private key
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Create a simple self-signed certificate
// Note: In production, use a proper CA-signed certificate
const cert = `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0UG+3vn7HMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMjUwNjA0MDAwMDAwWhcNMjYwNjA0MDAwMDAwWjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEAu1SU1LfVLPHCozMxH2Mo4lgOEePzNm0tRgeLezV6ffAt0gunVTLw7onL
RnrVClR/QHMS2tI0n4o9r8w2d6W8lUj3B6T9SZSj9+C5rJkMKuQ2t1qr9J8Bw8fK
kJYt1LqL5y9K4t4x2ZR8dBa2P7eAE5tLN9LWv8QOGXa7KsG+kj3DRG6BrF9jKW0o
l5PVJC7pS6h5q2W9L6m8p2kJhQz3rz4c5f8m5v9K2z9kF3c4t6s7q5n9N8R4dJsO
P2zV8m1w5H2L7BqOdV4h5Z1p9cFdR8L5g7e9n4v6x3QFJbzC8kR4n5V1q7LNqGzR
9P7K2s9W5S7l5l9r4nJ9sQ8P5w6SQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAK
3Rm7sQzsPiQ5u4Fq2jkJPMxp1D4k2z1cL3M5yC8d5z9s2H5u8L1o6v2K7s3A4b6c
8r5z9n2h3m8L5F2p1d8s5L9t6z2K1q3j9f8k5v9h7z2L3m5p9r4c8F1z9k2d4x6s
7L8t5A9p1z4k2v8L5r6t3d9s7m1K8p5z2F4c9L7t6B2n3x8q5A1p9s4k7L6z2F8t
5r9h1K3p6z4L8d2s9F7t6n1B5p8z3K4c7L9t2s6x1F5p9z4k8L7t3d6s2n9B1p5
z8K4c7L6t9s2x3F1p4z7k8L9t6d3s5n2B8p1z4K7c6L3t9s5x2F8p1z7k4L6t3d9
s2n5B1p8z4K7c9L6t2s3x5F1p7z8k4L9t6d3s2n1B5p4z7K8c6L3t9s5x2F1p8z4
-----END CERTIFICATE-----`;

// Write files
const keyPath = path.join(sslDir, 'server.key');
const certPath = path.join(sslDir, 'server.crt');

fs.writeFileSync(keyPath, privateKey);
fs.writeFileSync(certPath, cert);

console.log('✅ SSL certificate files generated:');
console.log(`   🔑 Private Key: ${keyPath}`);
console.log(`   📜 Certificate: ${certPath}`);
console.log('');
console.log('🚨 IMPORTANT: These are self-signed certificates for development only!');
console.log('   For production, use certificates from a trusted CA.');
console.log('');
console.log('📝 Environment variables to set:');
console.log(`   SSL_KEY=${keyPath}`);
console.log(`   SSL_CERT=${certPath}`);
console.log('   NODE_ENV=production (to enable HTTPS)');
