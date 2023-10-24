import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { DynamoDB } from "aws-sdk";

const documentClient = new DynamoDB.DocumentClient({ region: "us-east-1" });

async function setToken(
  userId: string,
  token: string,
  itemId: string,
  address: string
) {
  const params = {
    TableName: "users",
    Item: {
      name: userId,
      address,
      onboardingStep: "Processing",  // Assuming "Processing" corresponds to OnboardingSteps.Processing in your Express code
      plaid_access_token: token,
      plaid_item_id: itemId,
      plaid_history_synced: false,
    },
  };

  try {
    await documentClient.put(params).promise();
    return params.Item;
  } catch (error) {
    console.error(`setToken() failed: ${error}`);
    throw error;
  }
}

interface SetTokenProps extends NextApiRequest {
  body: {
    public_token: string;
    address: string;
  };
}

export default async function handler(
  req: SetTokenProps,
  res: NextApiResponse
) {
  const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
      },
    },
  });

  const client = new PlaidApi(configuration);

  let plaidItemId = "";
  let user;

  try {
    const response = await client.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });

    plaidItemId = response.data.item_id;

    user = await setToken(
      "abc",
      response.data.access_token,
      response.data.item_id,
      req.body.address
    );

    // init the tx sync
    await client.transactionsSync({
      access_token: response.data.access_token,
    });

    res.status(200).json({
      success: true,
      plaidItemId,
      user,
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    console.error(`public_token: ${req.body.public_token}`);
    res.status(500).json({ error: error });
  }
}
