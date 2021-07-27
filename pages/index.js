import { ResourcePicker } from "@shopify/app-bridge-react";
import {
  Button,
  Card,
  DataTable,
  EmptyState,
  Heading,
  Frame,
  Page,
  Stack,
  TextField,
  Toast,
} from "@shopify/polaris";
import { useState, useMemo, useCallback } from "react";
import { useMutation } from "react-apollo";
import { ProductUpdateMutation } from "../graphql/ProductUpdate";

const Index = () => {
  const [appendToTitle, setAppendToTitle] = useState("");
  const [appendToDescription, setAppendToDescription] = useState("");
  const [pickerOpen, setPickerOpen] = useState("false");
  const [products, setProducts] = useState([]);
  const [showToast, setShowToast] = useState("false");

  const [updateProduct] = useMutation(ProductUpdateMutation);

  const productTableDisplayData = useMemo(
    () =>
      products.map((product) => [
        product.id,
        product.title,
        `${product.title}${appendToTitle}`,
        product.descriptionHtml,
        `${product.descriptionHtml}${appendToDescription}`,
      ]),
    [products, appendToTitle, appendToDescription]
  );
  // const session = await Shopify.Utils.loadCurrentSession(req, res);
  // const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  // const products = await client.query({
  //   data: `{
  //       products (first: 3) {
  //         edges {
  //           node {
  //             id
  //             title
  //             descriptionHtml
  //           }
  //         }
  //       }
  //     }`,
  // });

  const submitHandler = useCallback(() => {
    let count = 0;
    const runMutation = (product) => {
      updateProduct({
        variables: {
          input: {
            descriptionHtml: `${product.descriptionHtml}${appendToDescription}`,
            title: `${product.title}${appendToTitle}`,
            id: product.id
          },
        },
      }).then((data) => {
        console.log('Updated Product', count, data);
        count++;
        if(product[count]) runMutation(products[count])
        else {
          console.log('Update Complete')
          setShowToast(true);
        }
      })
    }
    runMutation(products[count]);
  }, [products, appendToTitle, appendToDescription]);

  const toastMarkup = showToast ? (
    <Toast
      content="Update Successful"
      onDismiss={() => setShowToast(false)}
      duration={4000}
    />
  ) : null;

  return (
    <Frame>
      <Page>
        <Heading>Product Updater App</Heading>
        <Card>
          <Card.Section>
            <Stack vertical>
              <TextField
                label="Append to title"
                value={appendToTitle}
                onChange={setAppendToTitle}
              />
              <TextField
                label="Append to description"
                value={appendToDescription}
                onChange={setAppendToDescription}
                multiline={3}
              />
              <ResourcePicker
                resourceType="Product"
                showVariants={false}
                open={pickerOpen}
                onSelection={(resources) => {
                  console.log(resources);
                  setProducts(resources.selection);
                }}
              />
              <Button primary onClick={() => setPickerOpen(true)}>
                Select Products
              </Button>
            </Stack>
          </Card.Section>
          <Card.Section>
            {productTableDisplayData.length ? (
              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text"]}
                headings={[
                  "ID",
                  "Old Title",
                  "New Title",
                  "Old Description",
                  "New Description",
                ]}
                rows={productTableDisplayData}
              />
            ) : (
              <EmptyState heading="No products selected" />
            )}
          </Card.Section>
          <Card.Section>
            <Button primary onClick={submitHandler} disabled={!products.length}>
              Submit
            </Button>
          </Card.Section>
        </Card>
        {toastMarkup}
      </Page>
    </Frame>
  );
};

export default Index;
