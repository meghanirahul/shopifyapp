// import {shopify} from '@shopify/shopify-api'
console.log("app js link");
var myHeaders = new Headers();
myHeaders.append("x-access-token", "goldapi-1r9ugslxk11jsv-io");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://www.goldapi.io/api/XAU/INR", requestOptions)
  .then(response => response.json())
  .then(result => {console.log(result);console.log(result.price)})
  .catch(error => console.log('error', error));



//   const adminApiClient = new shopify.clients.Rest({session});
//   const storefrontTokenResponse = await adminApiClient.post({
//     path: 'storefront_access_tokens',
//     type: DataType.JSON,
//     data: {
//       storefront_access_token: {
//         title: 'This is my test access token',
//       },
//     },
//   });
  
//   const storefrontAccessToken =
//     storefrontTokenResponse.body['storefront_access_token']['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'];




// //  // Load the access token as per instructions above
// // const storefrontAccessToken = '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';
// // Shop from which we're fetching data
// const shop = 'vrmeditech.myshopify.com';

// // StorefrontClient takes in the shop url and the Storefront Access Token for that shop.
// const storefrontClient = new shopify.clients.Storefront({
//   domain: shop,
//   storefrontAccessToken,
// });

// // Use client.query and pass your query as `data`
// const products = await storefrontClient.query({
//   data: `{
//     products (first: 3) {
//       edges {
//         node {
//           id
//           title
//         }
//       }
//     }
//   }`,
// });

// console.log(products);