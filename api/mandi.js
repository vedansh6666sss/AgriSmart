import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    // Allow cross-origin requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");

    if (req.method !== "GET") {
        return res.status(455).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.VITE_DATA_GOV_API_KEY;
    const resourceId = process.env.VITE_RESOURCE_ID;

    // 1. Get the crop requested by the frontend (defaults to Soybean)
    const requestedCrop = req.query.commodity || 'Soybean';

    // 2. Map frontend names to strict government Agmarknet names
    const commodityMap = {
        "Mustard": "Mustard",
        "Gram (Chickpea)": "Bengal Gram(Gram)(Whole)",
        "Soybean": "Soyabean",
        "Cotton": "Cotton"
    };
    const govCommodityName = commodityMap[requestedCrop] || requestedCrop;

    try {
        const client = await connectToDatabase();
        const db = client.db("agrismart");
        const collection = db.collection("mandi_rates");

        // 3. Fetch from data.gov.in using the official crop name and state
        const targetUrl = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=50&filters%5Bstate%5D=Madhya%20Pradesh&filters%5Bcommodity%5D=${encodeURIComponent(govCommodityName)}`;

        const response = await fetch(targetUrl);
        const data = await response.json();

        const records = data.records || [];

        if (records.length > 0) {
            // Store latest records with a timestamp
            await collection.updateMany(
                {},
                {
                    $set: {
                        updatedAt: new Date(),
                        source: "Agmarknet data.gov.in",
                        records: records
                    }
                },
                { upsert: true }
            );

            return res.status(200).json({
                success: true,
                source: "live",
                count: records.length,
                records: records
            });
        }

        // Fallback to database cache if government API is temporarily empty
        const cachedData = await collection.findOne({});
        return res.status(200).json({
            success: true,
            source: "cache",
            records: cachedData?.records || []
        });
    } catch (error) {
        console.error("Mandi API Error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch Mandi rates"
        });
    }
}