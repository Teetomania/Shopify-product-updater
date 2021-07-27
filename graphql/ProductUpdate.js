import {gql} from 'apollo-boost';

export const ProductUpdateMutation = gql `
    mutation updateProduct($input: ProductInput!) {
        productUpdate (input: $input){
            product {
                id
                description
                title
            }
            userErrors{
                message
                field
            }
        }
    }

`;