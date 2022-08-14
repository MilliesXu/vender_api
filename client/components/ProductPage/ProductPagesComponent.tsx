import { Grid, Container, Group, Button, Table, Center } from "@mantine/core"
import Head from "next/head"

const ProductPageComponent = () => {
  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Grid>
        <Grid.Col span={12}>
          <Group>
          <Button radius="md" size="md">
            Add Product
          </Button>
          </Group>
        </Grid.Col>
        <Grid.Col span={12}>
          <Container>
            <Table highlightOnHover>
              <thead>
                <tr>
                  <th><Center>Name</Center></th>
                  <th><Center>Description</Center></th>
                  <th><Center>Action</Center></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Product One</td>
                  <td>This is product one</td>
                  <td>Action</td>
                </tr>
                <tr>
                  <td>Product One</td>
                  <td>This is product one</td>
                  <td>Action</td>
                </tr>
              </tbody>
            </Table>
          </Container>
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ProductPageComponent
