import React from "react";
import { useLoaderData } from "@remix-run/react";
import { useActionData } from "@remix-run/react";
import { InlineGrid,InlineStack,Button,Card,Layout,Page,Text,BlockStack,Thumbnail } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useEffect,useState, useCallback} from 'react';
import { apiVersion,authenticate } from "../shopify.server";
import { Form } from "@remix-run/react";



// export const loader = async({request}) => {
//     await authenticate.admin(request);

//   return null;
// }

export const action = async ({ request }) => {
    let settings = await request.formData();
    settings = Object.fromEntries(settings);
    

    

    const { session } = await authenticate.admin(request);
      const { shop, accessToken} = session;
    const { admin } = await authenticate.admin(request);

    let idaray = await admin.graphql(
        `{
            products(first:250,query:"title:gold"){edges{node{
                variants(first:250){edges{node{id,title}}}
            }}}
        }`
    );
    let idari = (await idaray.json()).data.products.edges[0].node.variants.edges;
    // let arri10k = []
    // let arri14k = []
    // let arri16k = []
    // let arri18k = []
    // let arri20k = []
    // let arri22k = []
    // let arri24k = []
    let pprice;
    if(settings.title.match(/gold/gi) != null){
        if(settings.submit == 'Submit'){
            pprice = parseInt(settings.price);
            console.log(settings.price)
        }
        else{
            pprice = parseFloat(settings.liveprice) * 83.47;
            pprice = Math.round(pprice);
            console.log(settings.liveprice)
            };
            if(String(pprice).length > 3){
                for(let i = 0; i < idari.length; i++){    
                // console.log(pprice)
                let imount = pprice;
                if(idari[i].node.title.match("10k") != null){
                    // arri10k.push(idari[i].node.title);
                    imount -= 35576;
                }
                else if(idari[i].node.title.match("14k") != null){
                    // arri14k.push(idari[i].node.title);
                    imount -= 31312;
                }
                else if(idari[i].node.title.match("16k") != null){
                    // arri16k.push(idari[i].node.title);
                    imount -= 23550;
                }
                else if(idari[i].node.title.match("18k") != null){
                    // arri18k.push(idari[i].node.title);
                    imount -= 15366;
                }
                else if(idari[i].node.title.match("20k") != null){
                    // arri20k.push(idari[i].node.title);
                    imount -= 10922;
                }
                else if(idari[i].node.title.match("22k") != null){
                    // arri22k.push(idari[i].node.title);
                    imount -= 5679;
                }
                else{
                    
                };
    
                if(idari[i].node.title.match("1g") != null){
                    imount /= 10;
                }
                else if(idari[i].node.title.match("10g") != null){
                }
                else if(idari[i].node.title.match("100g") != null){
                    imount *= 10;
                }
                else{
                    imount *= 100;
                };
    
                await admin.graphql(
                    `mutation{
                        productVariantUpdate(input:{
                            id:"${idari[i].node.id}",
                            price: "${String(imount)}"
                        }){
                            productVariant{
                            price
                            }
                        }
                    }`
                  )
            }
        }
    }
    

    // let ram = await [arri10k,arri14k,arri16k,arri18k,arri20k,arri22k,arri24k]

    // idaray = idaray.data.products.edges[0].node.variants.edges[0].node.id;
    // const {
    //     data: {
    //         products: { edges: [
    //             {node}
    //         ] }
    //         }
    //         } = idari;
    

   

      const query2 = 
`{products (first: 50,query:"title:${settings.title}") {
        edges {
          node {
                id
                title
                images(first:5){
                    edges
                    {
                        node{
                            src
                        }
                    } 
                }
                variants(first:250){
                    edges{
                        node{
                        id
                        title
                        price
                        inventoryQuantity
                        }
                    }
                }
                }
               }
        }
    }`
;
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
      
      
      return settings;
  //   return json(data);
  }


  export const goldprice = async () => {
    try {
        const response = await fetch("https://api.gold-api.com/price/XAU", {
            method: "get"
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        //  console.log(data); // For debugging
        return data;
    } catch (error) {
        console.log("Error during fetching: " + error);
        throw error; // Re-throw the error for further handling
    }
};

const updatequant = async (title) => {
 console.log(title)
}


function product(){
    let productiii = useActionData();
    console.log(productiii)



//gold live price update api
    const [goldPrice, setGoldPrice] = useState(null);
    const [error, setError] = useState(null);
    const [clickf, setclickf] = useState(0);

    useEffect(() => {
        const fetchGoldPrice = async () => {
            try {
                const data = await goldprice();
                setGoldPrice(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchGoldPrice();
        }, [clickf]);
        
        console.log(goldPrice);
        if(goldPrice != null){
            console.log(goldPrice.price)
        }
    





    // const [email, setEmail] = useState('');
    // const handleSubmit = useCallback(() => {
    //     setEmail('');
    //   }, []);
    // const handleEmailChange = useCallback((value) => setEmail(value), []);

    return(
        <>
         <Page>
            <TitleBar title="Single Product price change" />
            <Layout>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="200">
                            
                                <Form method="POST">
                                   
                                <div className="p-input">
                                    <label for="title">product handle : </label>
                                    <input type="text" name="title" id="title" placeholder="write product handle"></input>
                                    <input type="submit" value="Submit" name="submit"></input>
                                </div>    
                                <div className="p-input" style={{paddingTop:"40px"}}>
                                    <label for="price">price for 24k / 10g : </label>
                                    <input type="numbers" name="price" id="price" placeholder="updated price"></input>
                                    <input type="submit" value="Submit" name="submit"></input>
                                </div>
                                <div className="p-input" style={{paddingTop:"40px"}}>
                                    <p onClick={()=>{setclickf(clickf + 1)}}>click here to update price <span style={{background:"#808080",cursor:"pointer"}}>click{clickf}</span> </p>
                                    <p>{(goldPrice != null)?(goldPrice.price):("loading...")}</p>
                                </div>
                                <div className="p-input">
                                    <label for="matchprice">Match Price with Live Market : </label>
                                    <input type="text" name="liveprice" value={(goldPrice != null)?(goldPrice.price):("loading...")} readOnly></input>
                                    <input type="submit" name="matchprice" value="Match Price"></input> 
                                </div>
                               

                                
                                {/* <Button submit={true}>submit</Button> */}

                                </Form>
                    
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
                                {(productiii != undefined) ? (productiii.map((prod,index)=>{
        return <Page>
            <TitleBar title={prod.node.title} />
            <Layout>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="200">
                            <Text variant="bodyMd">
                                <Text className={"ready"+index}>{prod.node.title}</Text>
                                <InlineStack wrap={false} gap="200">
                                    {prod.node.images.edges.map((val)=>{
                                        return <Thumbnail
                                        source={val.node.src}
                                        alt="Black choker necklace"
                                        />

                                    })}
                                </InlineStack>
                                <InlineGrid columns={4} gap="600">
                                    {prod.node.variants.edges.map((val,ind)=>{
                                        return <>
                                        <Text>
                                           <h4>Title: {val.node.title}</h4>
                                           <p>Price: {val.node.price}</p> 
                                           <p>Quantity: {val.node.inventoryQuantity}</p>
                                           <input type="number" name={"quantity"+ind} defaultValue={val.node.inventoryQuantity} id={'goldquant'+ind} onChange={() => updatequant(val.node.id)}/>
                                        </Text>
                                        </>
                                    })}
                                </InlineGrid>   
                            </Text>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
                                })):("")} 
        </>
    )
}

export default product;