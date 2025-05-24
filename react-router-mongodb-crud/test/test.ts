import { BinaryLike, createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import { decrypt, decryptAsymmetric, encrypt, encryptAsymmetric, generateKeyPair, sign, unsign } from "./crypto";

const encryptSymmetric = (key: string, plaintext: string) => {
    // create a random initialization vector
    const iv = randomBytes(12).toString('base64');

    // create a cipher object
    const cipher = createCipheriv("aes-256-gcm", key, iv);

    // update the cipher object with the plaintext to encrypt
    let ciphertext = cipher.update(plaintext, 'utf8', 'base64');

    // finalize the encryption process 
    ciphertext += cipher.final('base64');

    // retrieve the authentication tag for the encryption
    const tag = cipher.getAuthTag();

    return { ciphertext, iv, tag };
}

const decryptSymmetric = (key: string, ciphertext: string, iv: string, tag: string) => {
    const decipher = createDecipheriv(
        "aes-256-gcm",
        Buffer.from(key, 'base64'),
        Buffer.from(iv, 'base64')
    );

    decipher.setAuthTag(Buffer.from(tag, 'base64'));

    let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
    plaintext += decipher.final('utf8');

    return plaintext;
}


(async function () {
    console.log("xxxxxxxxxxx");
    // const value = "Horas";
    // const secret = "123456";
    // const decoded = await sign(value, secret);
    // console.log(decoded);

    // const result = await unsign(decoded, secret);
    // console.log(result);

    let encrypted = encrypt("1234567890")
    console.log(encrypted);

    let decrypted = decrypt(encrypted);
    console.log(decrypted);

    for (let i = 1; i <= 10; i++) {
        const aaa = randomBytes(32);
        const randomString = aaa.toString("hex");
        console.log(`${i} : ${randomString}`);
    }

    const {privateKey, publicKey} = generateKeyPair();
    console.log(privateKey);
    console.log("----------------------------------------------------");
    console.log(publicKey);
    console.log("----------------------------------------------------");
    encrypted = encryptAsymmetric("1234567890 aaaaaaaaa bbbbbbbbbbbbb cccccccccccc ddddddddddddd", publicKey)
    console.log(encrypted);

    decrypted = decryptAsymmetric(encrypted, privateKey);
    console.log(decrypted);
})();