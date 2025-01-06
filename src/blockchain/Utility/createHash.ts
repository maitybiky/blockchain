async function createHash(obj: any): Promise<string> {
  try {
    // Step 1: Convert the object to a JSON string
    const jsonString = JSON.stringify(obj);

    // Step 2: Encode the string to a Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(jsonString);

    // Step 3: Use the Web Crypto API to create a hash
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Step 4: Convert the hash to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  } catch (error) {
    throw error;
  }
}

export default createHash;
