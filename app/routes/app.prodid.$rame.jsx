import Quantity from "./quantity";
import { useParams } from "@remix-run/react"
import {
    Card,
    InlineGrid,
    Text,
    BlockStack,
    Button,
    Divider,
    Thumbnail
} from "@shopify/polaris";
import { useActionData, useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { useRef } from "react";
import { Form } from "@remix-run/react";



export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const url = new URL(request.url);
    const productid = url.pathname.split('/')[3]
    console.log(url.pathname.split('/')[3])

    const response = await admin.graphql(
        `#graphql
  query{product(id:"gid://shopify/Product/${productid}"){title,featuredMedia{preview{image{url}}}variants(first:250){edges{node{id,title,price,inventoryQuantity,inventoryItem{id},image{url}}}}}}`
    )

    const responseJson = await response.json();

    return ({
        collection: responseJson
    })
}

export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    let settings = await request.formData();
    settings = Object.fromEntries(settings);

    let strtoobj = JSON.parse(settings.passinghidden);

    console.log(strtoobj);
    let allgetdata = []
    for(let key in strtoobj){
        console.log(key);
    const response = await admin.graphql(
      `#graphql
      mutation InventorySet($input: InventorySetQuantitiesInput!) {
        inventorySetQuantities(input: $input) {
          inventoryAdjustmentGroup {
            createdAt
            reason
            referenceDocumentUri
            changes {
              name
              delta
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
            "input": {
              "name": "available",
              "reason": "correction",
              "ignoreCompareQuantity": true,
              "quantities": [
                {
                  "inventoryItemId": key,
                  "locationId": process.env.SHOPIFY_LOCATIONID,
                  "quantity": strtoobj[key]
                }
              ]
            }
          },
      }
    );
    const data = await response.json();
    allgetdata.push(data);
    }
    
    return allgetdata;
}


export default function Newman() {
    const products = useLoaderData();
    const param = useParams();
    const isupdate = useActionData();
    const inputRef = useRef(null);
    let allquant = {};

    console.log(param, isupdate)
    
    products?.collection.data.product.variants.edges.map((value) => {
        return allquant[value.node.inventoryItem.id] = value.node.inventoryQuantity
    })
    console.log(products?.collection.data.product)
    // console.log(allquant)
    const updatedquant = (data, id) => {
        allquant[id] = parseInt(data);
        // console.log(data,id)
        console.log(JSON.stringify(allquant, null, 2))
        if (inputRef.current) {
            inputRef.current.value = JSON.stringify(allquant);  // Directly change the DOM element's value
          }
    }




    return (
        <>
            {/* <div>
        param = {param.rame}
        </div> */}
            <Card roundedAbove="sm">
                <BlockStack gap="400">
                    <BlockStack gap="200">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15, }}>
                            <Thumbnail
                                source={products?.collection.data.product.featuredMedia?.preview.image.url}
                                size="large" />
                            <Text as="h2" variant="headingSm">
                                {products?.collection.data.product.title}
                            </Text>
                        </div>
                        <Divider />
                        <InlineGrid gap="400" columns={3}>
                            {products?.collection.data.product.variants.edges.map((value, index) => {
                                return <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 15, justifyContent: 'space-between' }}>
                                        <Thumbnail
                                            source={value.node.image?.url}
                                            size="large" />
                                        <Text as="p" variant="bodyLg" style={{ display: 'flex' }}>
                                            {value.node.title}
                                            <Text as="p" variant="bodyLg" style={{ display: 'flex' }}>
                                                {value.node.price}
                                            </Text>
                                            <Text as="p" variant="bodyLg" style={{ display: 'flex' }}>
                                                {value.node.inventoryQuantity}
                                            </Text>
                                        </Text>
                                        <Quantity value={{ quantity: value.node.inventoryQuantity, id: value.node.inventoryItem.id }} getquant={updatedquant} />
                                    </div>
                                </>
                            })}
                        </InlineGrid>
                    </BlockStack>
                </BlockStack>
                <div style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <Form method="POST">
                        <input ref={inputRef} type="text" name="passinghidden" defaultValue={``} ></input>
                        <Button variant="primary" submit={true}>Update Quantity</Button>
                    </Form>
                </div>
            </Card>
        </>
    )
}