// backend/server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import authRoutes from "./routes/authRoutes";
import connectDB from "./config/db";
import { uploadFileBuffer, uploadJSON , fetchJSON} from "./utils/zeroGStorage";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://og-de-vahan-qq1ki1tfi-chandan-jhas-projects.vercel.app",
  "og-de-vahan-jhachanda-chandan-jhas-projects.vercel.app",
  "https://og-de-vahan.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.use(fileUpload());

// Auth routes
app.use("/auth", authRoutes);

// ---------------------------
// 0G Storage routes
// ---------------------------

// Upload a single file
app.post("/api/uploadFile", async (req, res) => {
  try {
    console.log('checkpoint 1')
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const file = req.files.file as any; // express-fileupload File object
    if (!file.data || !file.name) {
      return res.status(400).json({ success: false, error: "Invalid file object" });
    }

    // Upload buffer to 0G
    const result = await uploadFileBuffer(file.data, file.name);
    return res.json({ success: true, rootHash: result.rootHash, txHash: result.txHash });
  } catch (error: any) {
    console.error("UploadFile error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Upload JSON data
app.post("/api/uploadJSON", async (req, res) => {
  try {
    const jsonData = req.body;
    if (!jsonData || Object.keys(jsonData).length === 0) {
      return res.status(400).json({ success: false, error: "No JSON data provided" });
    }

    const result = await uploadJSON(jsonData);
    return res.json({ success: true, rootHash: result.rootHash, txHash: result.txHash });
  } catch (error: any) {
    console.error("UploadJSON error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch JSON from 0G Storage
app.get("/api/fetchJSON/:rootHash", async (req, res) => {
  try {
    const { rootHash } = req.params;
    if (!rootHash) return res.status(400).json({ success: false, error: "rootHash is required" });
    const data = await fetchJSON(rootHash);
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("FetchJSON error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/IPFS",async(req,res )=>{
    try {
    // 1. Extract metadata from the request
    const { name, description, image } = await req.body;

    // 2. Validate input
    if (!name || !description || !image) {
      return res.json(
        { success: false, error: 'Missing required metadata fields.' }
      );
    }

    // 3. Get Pinata JWT
    const pinataJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNjlmMTJmOS1kOTQ0LTRjY2ItOTkzNS1lYThiMWY5MmU1NjYiLCJlbWFpbCI6ImpoYTk1Mzc1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmODE4NTIyODI0ZDM5YzEwNTYwNyIsInNjb3BlZEtleVNlY3JldCI6IjAwNmQ2NDNkMTZlMDk4MDMzNGRlNmZmYWVlOWNiZGIzMGM2YzlmMTliMzY3YmRlNTk0OWRjNjQyZjU4NDE2NTYiLCJleHAiOjE3ODU3NTE5Mjl9.BqPPy4gmTqOSc82H2vJxHE9yjg6Y8q7f-SVoGoHeIFQ";
    if (!pinataJwt) {
      console.error("Missing PINATA_JWT environment variable");
      return res.json(
        { success: false, error: 'Server configuration error.' },
      );
    }

    // 4. Prepare the JSON metadata
    const metadata = {
      name,
      description,
      image, // should already be a Cloudinary or IPFS gateway URL
    };

    // 5. Upload metadata to public IPFS using pinJSONToIPFS
    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNjlmMTJmOS1kOTQ0LTRjY2ItOTkzNS1lYThiMWY5MmU1NjYiLCJlbWFpbCI6ImpoYTk1Mzc1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmODE4NTIyODI0ZDM5YzEwNTYwNyIsInNjb3BlZEtleVNlY3JldCI6IjAwNmQ2NDNkMTZlMDk4MDMzNGRlNmZmYWVlOWNiZGIzMGM2YzlmMTliMzY3YmRlNTk0OWRjNjQyZjU4NDE2NTYiLCJleHAiOjE3ODU3NTE5Mjl9.BqPPy4gmTqOSc82H2vJxHE9yjg6Y8q7f-SVoGoHeIFQ`,
  },
  body: JSON.stringify(metadata),
});

if (!pinataResponse.ok) {
  throw new Error(`Pinata upload failed: ${pinataResponse.statusText}`);
}

const data = await pinataResponse.json();
console.log("Pinata response:", data);


    // 6. Get IPFS hash and build tokenURI
    const ipfsHash = data.IpfsHash;
    const tokenUri = `ipfs://${ipfsHash}`;
console.log(tokenUri);
    // 7. Return success response
    return res.json({ success: true, tokenUri });

  }  catch (error) {
        if (error instanceof Error) {
    return res.json({ error: error.message });
  }
  return res.json({ error: 'Unknown error' });
    }

})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
