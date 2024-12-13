import { useLoaderData, useActionData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);


    const response = await admin.graphql(
        `#graphql
  mutation {
      webhookSubscriptionUpdate(
        id: "gid://shopify/WebhookSubscription/1650862719289",
        webhookSubscription: {
          callbackUrl: "https://recommendations-going-redeem-trustee.trycloudflare.com/webhooks"
        }
      ) {
        userErrors {
          field
          message
        }
        webhookSubscription {
          id
          endpoint {
            __typename
          }
        }
      }
    }`
    )

    const responseJson = await response.json();

    return ({
        collection: responseJson
    })

}

export default function Webhook(){
    const loaderdata = useLoaderData();
    console.log(loaderdata);
    return(
        <>
        <p>Webhook</p>
        </>
    )
}