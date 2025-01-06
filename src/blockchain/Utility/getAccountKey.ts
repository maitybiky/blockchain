export async function getAccountKey(publicKey: string): Promise<string> {
  try {
    // Convert the public key string to a Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(publicKey);

    // Generate a SHA-256 hash of the public key
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert the hash to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    // Optionally truncate the hash to create a shorter key
    const shortKey = hashHex.substring(0, 16); // Take the first 16 characters (or customize length)

    return shortKey;
  } catch (error) {
    throw error;
  }
}
