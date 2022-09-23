import { useState } from "react";
import { useEffect } from "react";

const useSHA256 = (content: string | undefined) => {
  const [hash, setHash] = useState<string | undefined>();

  useEffect(() => {
    const handler = async () => {
      if (!content) return;
      const utf8 = new TextEncoder().encode(content);
      const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, "0"))
        .join("");
      setHash(hashHex);
    };
    handler();
  }, [content]);

  return hash;
};

export default useSHA256;
