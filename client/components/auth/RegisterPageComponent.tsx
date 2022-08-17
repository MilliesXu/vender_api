import { Box, TextInput, Button, Group, Anchor } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification, updateNotification } from "@mantine/notifications"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import Head from "next/head"
import Link from "next/link"
import { registerUser } from "../../pages/api"

const RegisterPageComponent = () => {
  const form = useForm({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    },
    validate: {
      firstname: (value) => (value.length < 2 && 'Firstname is too short'),
      lastname: (value) => (value.length < 2 && 'Lastname is too short'),
      password: (value) => (value.length < 6 && 'Password is too short'),
      passwordConfirmation: (value, values) => (value !== values.password && 'Password must be match')
    }
  })

  const mutation = useMutation<{successMessage: string}, AxiosError<{errorMessage: string}>, Parameters<typeof registerUser>['0']>(registerUser, {
    onMutate: () => {
      showNotification({
        id: 'register',
        title: 'Creating Account',
        message: 'Please wait while we creating an account for you',
        loading: true,
        autoClose: false,
      })
    },
    onSuccess: (data) => {
      updateNotification({
        id: 'register',
        title: 'Creating Account',
        message: `${data.successMessage}`,
        loading: false,
        autoClose: false,
        color: 'green'
      })
    },
    onError: (error) => {
      updateNotification({
        id: 'register',
        title: 'Creating Account',
        message: `${error.response?.data.errorMessage}`,
        loading: false,
        autoClose: false,
        color: 'red'
      })
    }
  })

  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box sx={{ maxWidth: 340 }} mx="auto">
        <form onSubmit={form.onSubmit(values => mutation.mutate(values))}>
          <TextInput label="Firstname" placeholder="Input your firstname" required {...form.getInputProps('firstname')} />
          <TextInput label="Lastname" placeholder="Input your lastname" required {...form.getInputProps('lastname')} />
          <TextInput type="email" label="Email" placeholder="Input your email address" required {...form.getInputProps('email')} />
          <TextInput type="password" label="Password" placeholder="Input your password" required {...form.getInputProps('password')}/>
          <TextInput type="password" label="Password Confirmation" placeholder="Confirm your password" required {...form.getInputProps('passwordConfirmation')} />
          <Button type="submit" mt="lg">Register</Button>
          <Group mt="lg">
            <Link href="/auth/login" passHref>
              <Anchor>Already have an account?</Anchor>
            </Link>
          </Group>
        </form>
      </Box>
    </>
  )
}

export default RegisterPageComponent