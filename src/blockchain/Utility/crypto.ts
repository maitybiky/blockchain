export async function generateKeyPair(): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  try {
    // Generate an RSA key pair
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]), // 65537
        hash: { name: "SHA-256" },
      },
      true, // Extractable (we can export the private key)
      ["sign", "verify"]
    );

    // Export both keys to base64 strings (instead of PEM format)
    const privateKey = await exportKeyToBase64(keyPair.privateKey, "pkcs8");
    const publicKey = await exportKeyToBase64(keyPair.publicKey, "spki");

    return { privateKey, publicKey };
  } catch (error) {
    console.error("Error generating key pair:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

async function exportKeyToBase64(
  key: CryptoKey,
  format: string
): Promise<string> {
  try {
    // Export the key to an ArrayBuffer
    const exported: ArrayBuffer = await window.crypto.subtle.exportKey(
      format,
      key
    );

    // Convert the ArrayBuffer to a base64 string
    const exportedBase64 = btoa(
      String.fromCharCode(...new Uint8Array(exported))
    );

    return exportedBase64; // Return the base64 string without headers
  } catch (error) {
    console.error("Error exporting key to base64:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

async function importPrivateKey(base64: string): Promise<CryptoKey> {
  try {
    const binaryDerString = atob(base64); // Decode base64 to binary string
    const binaryDer = new Uint8Array(binaryDerString.length);

    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    return window.crypto.subtle.importKey(
      "pkcs8", // Make sure to use pkcs8 for private key
      binaryDer,
      {
        name: "RSA-PSS",
        hash: { name: "SHA-256" },
      },
      false,
      ["sign"]
    );
  } catch (error) {
    console.error("Error importing private key:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  return btoa(
    Array.from(uint8Array)
      .map((byte) => String.fromCharCode(byte))
      .join("")
  );
}

export async function signData(
  privateKeyBase64: string,
  data: string
): Promise<string> { // Return Base64 string instead of Uint8Array
  try {
    const privateKey = await importPrivateKey(privateKeyBase64);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const signature = await window.crypto.subtle.sign(
      { name: "RSA-PSS", saltLength: 32 },
      privateKey,
      dataBuffer
    );
console.log('mmmm1111:>> ', new Uint8Array(signature));
    return uint8ArrayToBase64(new Uint8Array(signature)); // Convert to Base64
  } catch (error) {
    console.error("Error signing data:", error);
    throw error;
  }
}
function base64ToUint8Array(base64: string): Uint8Array {
  return new Uint8Array(
    atob(base64)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
}

export async function verifySignature(
  publicKeyBase64: string,
  data: string,
  signatureBase64: string // Accept Base64 string
): Promise<boolean> {
  try {
    const publicKey = await importPublicKey(publicKeyBase64);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const signature = base64ToUint8Array(signatureBase64); // Convert Base64 to Uint8Array
    console.log('mmmm222:>> ', signature);
    console.log('publickey :>> ', publicKeyBase64);
    const isValid = await window.crypto.subtle.verify(
      { name: "RSA-PSS", saltLength: 32 },
      publicKey,
      signature,
      dataBuffer
    );
console.log('isValid :>> ', isValid);
    return isValid;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}


async function importPublicKey(base64: string): Promise<CryptoKey> {
  try {
    const binaryDerString = atob(base64); // Decode base64 to binary string
    const binaryDer = new Uint8Array(binaryDerString.length);

    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    return window.crypto.subtle.importKey(
      "spki", // Make sure to use spki for public key
      binaryDer,
      {
        name: "RSA-PSS",
        hash: { name: "SHA-256" },
      },
      true,
      ["verify"]
    );
  } catch (error) {
    console.error("Error importing public key:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
