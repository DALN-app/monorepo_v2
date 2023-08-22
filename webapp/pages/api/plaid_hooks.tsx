import { Readable } from "stream";

import { S3 } from "@aws-sdk/client-s3";
import pinataSDK from "@pinata/sdk";
import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const aws_client = new S3({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_KEY as string,
    secretAccessKey: process.env.S3_SECRET as string,
  },
});

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const url = `mongodb+srv://admin:${process.env.DB_PASSWORD}@spndao.vjnl9b2.mongodb.net/?retryWrites=true&w=majority`;
const dbClient = new MongoClient(url);
const dbName = "spndao";

async function getAccessToken(item_id: string) {
  await dbClient.connect();

  const db = dbClient.db(dbName);
  const collection = db.collection("users");

  const access_token = await collection
    .findOne({ plaid_item_id: item_id })
    .then((result) => {
      return result?.plaid_access_token as string;
    });

  return access_token;
}

interface PlaidHook extends NextApiRequest {
  body: {
    webhook_code: string;
    webhook_type: string;
    item_id: string;
    new_transactions: number;
  };
}

function logHook(req: PlaidHook) {
  console.log("---------------------------------------");
  console.log(`webhook_code: ${req.body.webhook_code}`);
  console.log(`webhook_type: ${req.body.webhook_type}`);
  console.log(`item_id: ${req.body.item_id}`);
  console.log(`new_transactions: ${req.body.new_transactions}`);
  console.log(`webhook_code: ${req.body.webhook_code}`);
}

export default async function handler(req: PlaidHook, res: NextApiResponse) {
  logHook(req);

  if (req.body.webhook_code === "HISTORICAL_UPDATE") {
    const access_token = await getAccessToken(req.body.item_id);
    const client = new PlaidApi(configuration);

    const transactionsSyncRes = await client.transactionsSync({
      access_token: access_token,
    });

    aws_client.putObject(
      {
        Bucket: "spndao",
        Key: `${transactionsSyncRes.data.request_id}.json`,
        Body: JSON.stringify(transactionsSyncRes.data.added),
      },
      async (err, data) => {
        if (err) {
          return res.status(500).json({ error: err });
        }

        const s3obj = await aws_client.getObject({
          Bucket: "spndao",
          Key: `${transactionsSyncRes.data.request_id}.json`,
        });

        const buffer = s3obj.Body as Readable;

        const pinata = new pinataSDK(
          process.env.PINATA_API_KEY,
          process.env.PINATA_API_SECRET
        );

        const options = {
          pinataMetadata: {
            name: req.body.item_id,
          },
        };

        try {
          const pinataRes = await pinata.pinFileToIPFS(buffer, options);
          console.log(`pinataRes: ${pinataRes}`);
          return res.status(200);
        } catch (err) {
          console.log(`pinata.pinFileToIPFS() failed: ${err}`);
          return res.status(500).json({ error: err });
        }
      }
    );

    return res.status(200);
  } else {
    return res.status(200);
  }
}
