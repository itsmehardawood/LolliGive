import CryptoJS from "crypto-js";

/**
 * Decrypt AES-128-CBC encrypted base64 string with embedded IV.
 *
 * @param {string} encryptedData - base64 string containing IV + encrypted content
 * @param {string} encryptionKey - the encryption key (padded or trimmed to 16 bytes)
 * @returns {object} - Decrypted JSON object
 */
export function decryptWithAES128(encryptedData, encryptionKey) {
    try {
        if (!encryptedData || !encryptionKey) {
            throw new Error("Missing parameters");
        }

        // Decode base64
        const rawData = CryptoJS.enc.Base64.parse(encryptedData);

        // Extract IV (first 16 bytes) and encrypted content
        const iv = CryptoJS.lib.WordArray.create(rawData.words.slice(0, 4)); // 16 bytes = 4 words
        const ciphertext = CryptoJS.lib.WordArray.create(rawData.words.slice(4));

        // Prepare 16-byte key (pad with nulls if needed)
        let keyBytes = CryptoJS.enc.Utf8.parse(encryptionKey);
        if (keyBytes.sigBytes < 16) {
            keyBytes = CryptoJS.enc.Utf8.parse(
                encryptionKey.padEnd(16, '\0').substring(0, 16)
            );
        } else {
            keyBytes = CryptoJS.lib.WordArray.create(keyBytes.words.slice(0, 4)); // 16 bytes
        }

        // Decrypt
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: ciphertext },
            keyBytes,
            { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );

        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedText);
    } catch (error) {
        console.error("AES-128 Decryption failed:", error.message);
        throw new Error("Decryption failed");
    }
}