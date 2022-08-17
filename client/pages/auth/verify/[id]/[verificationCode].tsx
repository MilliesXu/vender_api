import { showNotification, updateNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { verifyUser } from "../../../api";

const Verify: NextPage = () => {
  const router = useRouter()
  const {id, verificationCode} = router.query
  const [sendRequest, setSendRequest] = useState(true)

  const mutation = useMutation<{successMessage: string}, AxiosError<{errorMessage: string}>, Parameters<typeof verifyUser>['0']>(verifyUser, {
    onMutate: () => {
      showNotification({
        id: 'verify',
        title: 'Verifying Account',
        message: 'Please wait while we verified the account for you',
        loading: true,
        autoClose: false,
      })
    },
    onSuccess: (data) => {
      updateNotification({
        id: 'verify',
        title: 'Verifying Account',
        message: `${data.successMessage}`,
        loading: false,
        autoClose: false,
        color: 'green'
      })
      setSendRequest(false)
      router.replace('/auth/login')
    },
    onError: (error) => {
      updateNotification({
        id: 'verify',
        title: 'Verifying Account',
        message: `${error.response?.data.errorMessage}`,
        loading: false,
        autoClose: false,
        color: 'red'
      })
      setSendRequest(false)
      router.replace('/auth/register')
    }
  })

  useEffect(() => {
    if (sendRequest) {
      if (typeof(id) === 'string' && typeof(verificationCode) === 'string' ) {
        mutation.mutate({id, verificationCode})
      }
    }
  }, [mutation, id, verificationCode, sendRequest])
  
  return <></>
}

export default Verify
