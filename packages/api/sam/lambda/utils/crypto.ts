import crypto from 'crypto';

const { EncryptionKeyParameter, EncryptionInitializationVectorParameter } = process.env;

const algorithm = 'aes-256-cbc'; // Algorithm to use for encryption
const keyParameter = EncryptionKeyParameter as string; // Encryption key
const ivParameter = EncryptionInitializationVectorParameter as string; // Initialization vector

export const encrypt = (plaintext: string) => {
    // Get key and iv in bytes
    const key = Buffer.from(keyParameter, 'base64');
    const iv = Buffer.from(ivParameter, 'base64');

    // Create a Cipher object for encryption using the specified algorithm, key, and IV
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
};

export const decrypt = (encrypted: string) => {
    // Get key and iv in bytes
    const key = Buffer.from(keyParameter, 'base64');
    const iv = Buffer.from(ivParameter, 'base64');

    // Create a Decipher object for decryption using the same algorithm, key, and IV
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};
