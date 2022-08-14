import { Grid, Container, Group, Button, Table, Center } from "@mantine/core"
import Head from "next/head"

const MaterialPageComponent = () => {
  return (
    <>
      <Head>
        <title>Materials</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Grid>
        <Grid.Col span={12}>
          <Group>
          <Button radius="md" size="md">
            Add Material
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
                  <th><Center>Uom</Center></th>
                  <th><Center>Unit Price</Center></th>
                  <th><Center>Action</Center></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Material One</td>
                  <td>This is material one</td>
                  <td>UOM</td>
                  <td align="right">28.32</td>
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

export default MaterialPageComponent
