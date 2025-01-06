// Convert ArrayBuffer to Base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return window.btoa(binary);  // Convert to Base64
  }
  
  // Convert Base64 to ArrayBuffer
  export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = window.atob(base64);  // Decode Base64 to binary string
    const length = binary.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;  // Return as ArrayBuffer
  }
  