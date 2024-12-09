import {
    Card,
    Link,
    Text,
    BlockStack,
    Divider,
    Thumbnail
} from "@shopify/polaris";
import { useActionData, useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(
        `#graphql
  query{collections(first:10){edges{node{title,image{url},id,handle}}}}`
    )

    const responseJson = await response.json();

    return ({
        collection: responseJson
    })
}

export default function Collection() {
    const loderdata = useLoaderData();
    console.log(loderdata.collection.data.collections);
    return (
        <>
            <Card roundedAbove="sm">
                <BlockStack gap="400">
                    <BlockStack gap="200">
                        <Text as="h2" variant="headingSm">
                            Collections
                        </Text>
                        {loderdata?.collection.data.collections.edges.map((value, index) => {
                            return <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                    <Thumbnail
                                        source={value.node.image?.url}
                                        size="large" />
                                    <Link url={'/app/colin/'+value.node.id.split('/')[4]}>
                                        <Text as="p" variant="bodyLg" style={{ display: 'flex' }}>
                                            {value.node.title}
                                        </Text>
                                    </Link>
                                    <Divider /> 
                                </div>
                            </>
                        })}
                    </BlockStack>
                </BlockStack>
            </Card>
        </>
    )
}