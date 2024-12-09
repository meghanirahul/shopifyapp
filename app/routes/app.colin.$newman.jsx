
import { useParams } from "@remix-run/react"
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
    const url = new URL(request.url);
    const collectionid = url.pathname.split('/')[3]
    console.log(url.pathname.split('/')[3])

    const response = await admin.graphql(
        `#graphql
  query{collection(id:"gid://shopify/Collection/${collectionid}"){products(first:100){edges{node{title,id,featuredMedia{preview{image{url}}}}}}}}`
    )

    const responseJson = await response.json();

    return ({
        collection: responseJson
    })
} 


export default function Newman(){
    const products = useLoaderData();
    const param = useParams();

    console.log(param)
    console.log(products?.collection.data.collection.products.edges)
    
    return(
    <>
        {/* <div>
        param = {param.newman}
        </div> */}
        <Card roundedAbove="sm">
                <BlockStack gap="400">
                    <BlockStack gap="200">
                        <Text as="h2" variant="headingSm">
                            Collections
                        </Text>
                        {products?.collection.data.collection.products.edges.map((value, index) => {
                            return <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                    <Thumbnail
                                        source={value.node.featuredMedia?.preview.image?.url}
                                        size="large" />
                                    <Link url={'/app/prodid/'+value.node.id.split('/')[4]}>
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