import { Box, TextInput, Button, Group, Anchor } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification, updateNotification } from "@mantine/notifications"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useMe } from "../../context/me"
import { loginUser } from "../../pages/api"
import { ErrorMessage, SuccessMessage } from "../../types"

const LoginPageComponent = () => {
  const router = useRouter()
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      password: (value) => (value.length < 6 && 'Password is too short')
    }
  })
  const {user, refetch} = useMe()

  const mutation = useMutation<SuccessMessage, AxiosError<ErrorMessage>, Parameters<typeof loginUser>['0']>(loginUser, {
    onMutate: () => {
      showNotification({
        id: 'login',
        title: 'Login',
        message: 'Logging you in',
        loading: true,
        autoClose: false,
      })
    },
    onSuccess: (data) => {
      updateNotification({
        id: 'login',
        title: 'Login',
        message: `${data.successMessage}`,
        loading: false,
        autoClose: false,
        color: 'green'
      })
      refetch()
      router.replace('/')
    },
    onError: (error) => {
      updateNotification({
        id: 'login',
        title: 'Login',
        message: `${error.response?.data.errorMessage}`,
        loading: false,
        autoClose: false,
        color: 'red'
      })
    }
  })

  useEffect(() => {
    if (user) router.push('/')
  }, [user, router])

  return (
    <>
      { user === null && (
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
      ) }
    </>
  )
}

export default LoginPageComponent
