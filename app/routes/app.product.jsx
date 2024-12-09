import {
    Box,
    Card,
    Layout,
    List,
    Page,
    Text,
    BlockStack,
    Button,
    } from "@shopify/polaris";
    import { TitleBar } from "@shopify/app-bridge-react";
    
    import { apiVersion,authenticate } from "../shopify.server";
import { useActionData, useLoaderData, Form } from "@remix-run/react";
import { json } from "@remix-run/react";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { Link } from "@remix-run/react";
import imag from '../../C101307_Image_01.jpg'






let numver = "1";


export const query = `{products (first: ${numver}) { edges { node { id title images(first:5){edges { node{ src } } } } } } }`;
        export const loader = async ({ request }) => {  
  
           
            const { session } = await authenticate.admin(request);
            const { shop, accessToken} = session;
           
            try{
                const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`,{
                    method: "post",
                    headers: {
                        "Content-Type": "application/graphql",
                        "X-Shopify-Access-Token": accessToken
                        },
                    body: query
                    });
                    if(response.ok){
                        const data = await response.json()
                
                        const {
                            data: {
                                products: { edges }
                                }
                                } = data
                                return edges;
                                }
                                }catch(err){
                console.log(err)
            }
            
            
            return null;
        }


        export const action = async ({ request }) => {
          let settings = await request.formData();
          settings = Object.fromEntries(settings);

          const { session } = await authenticate.admin(request);
            const { shop, accessToken} = session;
            const query2 = `{products (first: ${settings.nuproduct}) { edges { node { id title images(first:5){edges { node{ src } } } } } } }`;
            try{
                const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`,{
                    method: "post",
                    headers: {
                        "Content-Type": "application/graphql",
                        "X-Shopify-Access-Token": accessToken
                        },
                    body: query2
                    });
                    if(response.ok){
                        const data = await response.json()
                
                        const {
                            data: {
                                products: { edges }
                                }
                                } = data
                                return edges;
                                }
                                }catch(err){
                console.log(err)
            }
            
            return null;
        //   return json(data);
        }
     






export default function goldprice(){
    let products = useLoaderData()
    console.log(products);
    let newproduct = useActionData();
    console.log(newproduct);
    if (newproduct != undefined){
        products = newproduct;
    }
                
    
        
    
                         
    return(
        <>
        <Page>
            <TitleBar title="Goldprice page" />
            <Layout>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="200">
                            <Text variant="bodyMd">
                                <Form method="POST">
                                    <label for="nuproduct">number of product data shown (upto 250)</label>
                                <input type="number" name="nuproduct" id="nuproduct" defaultValue="1" max={250}></input>
                                    


                                {/* <input type="submit" value="Submit"></input> */}
                                <Button submit={true}>submit</Button>

                                </Form>
                            </Text>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
         <Page>
            <TitleBar title="Goldprice page" />
                                {/* <form action="">
                                    <input type="text" name="price" id="price" pattern="[0-9]{4,7}" title="Only 0-9 numbers and min 4 to max 7 digit are allowed"></input>
                                    <input type="submit" value="Submit"></input>
                                </form> */}
                                {products.map((val,ind)=>{
                                    return<>
            <Layout>
                <Layout.Section>
                                    {/* <Link to="/app/goldprice"> */}
                    <Card>
                        <BlockStack gap="200">
                            <Text variant="bodyMd">
                                    <p>{val.node.id}</p>
                                    {(val.node.images.edges.length > 0) ? ( 
                                        <img src={val.node.images.edges[0].node.src} width="100" height="auto" alt="product-img" loading="lazy"></img>
                                    ) : (
                                        <img src={imag} width="100" height="auto" alt="product-img" loading="lazy"></img>
                                    )}
                                    
                                    <p>{val.node.title}</p>
                            </Text>
                        </BlockStack>
                    </Card>
            {/* </Link> */}
                </Layout.Section>
            </Layout>
                                    </>
                                })}
        </Page>
        {/* <AppProvider>
            <Link to="/app/product"><Product/></Link>
        </AppProvider> */}
        </>
    )
}