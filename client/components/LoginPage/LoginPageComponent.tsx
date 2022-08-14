import { Box, TextInput, Button, Group, Anchor } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification, updateNotification } from "@mantine/notifications"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import Head from "next/head"
import Link from "next/link"
import { loginUser } from "../../pages/api"

const LoginPageComponent = () => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      password: (value) => (value.length < 6 && 'Password is too short')
    }
  })

  const mutation = useMutation<{successMessage: string}, AxiosError<{errorMessage: string}>, Parameters<typeof loginUser>['0']>(loginUser, {
    onMutate: () => {
      showNotification({
        id: 'login',
        title: 'Login',
        message: 'Logging you in',
        loading: true
      })
    },
    onSuccess: (data) => {
      updateNotification({
        id: 'login',
        title: 'Login',
        message: `${data.successMessage}`,
        loading: false
      })
    },
    onError: (error) => {
      updateNotification({
        id: 'login',
        title: 'Login',
        message: `${error.response?.data.errorMessage}`,
        loading: false
      })
    }
  })
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box sx={{ maxWidth: 340 }} mx="auto">
        <form onSubmit={form.onSubmit(values => mutation.mutate(values))}>
          <TextInput type="email" label="Email" placeholder="Input your email address" required {...form.getInputProps('email')} />
          <TextInput type="password" label="Password" placeholder="Input your password" required {...form.getInputProps('password')}/>
          <Button type="submit" mt="lg">Login</Button>
          <Group mt="lg" position="apart">
            <Link href="" passHref>
              <Anchor>Forget Password?</Anchor>
            </Link>
            <Link href="/auth/register" passHref>
              <Anchor>Don&apos;t have an account?</Anchor>
            </Link>
          </Group>
        </form>
      </Box>
    </>
  )
}

export default LoginPageComponent
