import { ResourcePicker } from "@shopify/app-bridge-react";
import {
  Button,
  Card,
  DataTable,
  EmptyState,
  Heading,
  Page,
  Stack,
  TextField,
} from "@shopify/polaris";
import { useState, useMemo } from "react";

const Index = () => {
  const [appendToTitle, setAppendToTitle] = useState("");
  const [appendToDescription, setAppendToDescription] = useState("");
  const [pickerOpen, setPickerOpen] = useState("false");
  const [products, setProducts] = useState([]);
  const [showToast, setShowToast] = useState("false");

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

  return (
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
            <Button primary onClick={() => console.log("clicked")}>
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
              rows={[productTableDisplayData]}
            />
          ) : (
            <EmptyState heading="No products selected" />
          )}
        </Card.Section>
      </Card>
    </Page>
  );
};

export default Index;
