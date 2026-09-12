import ImageKit from "imagekit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// server.js me imports hoisted ho jaate hain
// isliye dotenv yahin load karte hain, warna
// env vars imagekit instance bante waqt
// available nahi hote.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

const MISSING_CREDENTIALS = [
  !publicKey && "IMAGEKIT_PUBLIC_KEY",
  !privateKey && "IMAGEKIT_PRIVATE_KEY",
  !urlEndpoint && "IMAGEKIT_URL_ENDPOINT",
].filter(Boolean);

if (MISSING_CREDENTIALS.length > 0) {
  console.error(
    `[ImageKit] Missing environment variables: ${MISSING_CREDENTIALS.join(", ")}`,
  );
}

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export default imagekit;