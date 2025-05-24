import { createCipheriv, createDecipheriv, generateKeyPairSync, privateDecrypt, publicEncrypt, scryptSync } from "crypto";

const encoder = new TextEncoder();
const algorithm = 'aes-256-cbc';
const password = 'my secret key';
const key = scryptSync(password, 'salt', 32);
const iv = Buffer.alloc(16, 0);

export const encrypt = (plaintext: string) => {
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

export const decrypt = (encrypted: string) => {
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export const generateKeyPair = () => {
    return generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: password
        }
    })
}

export const encryptAsymmetric = (text: string, publicKey: string) => {
    return publicEncrypt(publicKey, Buffer.from(text, 'utf8')).toString('base64');
}

export const decryptAsymmetric = (encryptedText: string, privateKey: string) => {
    return privateDecrypt({
        key: privateKey,
        passphrase: password
    }, Buffer.from(encryptedText, 'base64')).toString('utf8');
}

export const sign = async (value: string, secret: string): Promise<string> => {
    let data = encoder.encode(value);
    let key = await createKey(secret, ["sign"]);
    let signature = await crypto.subtle.sign("HMAC", key, data);
    let hash = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(
        /=+$/,
        ""
    );

    return value + "." + hash;
};

export const unsign = async (
    cookie: string,
    secret: string
): Promise<string | false> => {
    let index = cookie.lastIndexOf(".");
    let value = cookie.slice(0, index);
    let hash = cookie.slice(index + 1);

    let data = encoder.encode(value);

    let key = await createKey(secret, ["verify"]);
    let signature = byteStringToUint8Array(atob(hash));
    let valid = await crypto.subtle.verify("HMAC", key, signature, data);

    return valid ? value : false;
};

const createKey = async (
    secret: string,
    usages: CryptoKey["usages"]
): Promise<CryptoKey> =>
    crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        usages
    );

function byteStringToUint8Array(byteString: string): Uint8Array {
    let array = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
        array[i] = byteString.charCodeAt(i);
    }

    return array;
}