"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CircleLoader } from "react-spinners"

import { newVerification } from "@/lib/actions/auth/new-verification"

import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { CardWrapper } from "./card-wrapper"

export const NewVerificationForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const onSubmit = useCallback(async () => {
    if (success || error) return

    if (!token) {
      setError("No token provided")
      return
    }

    try {
      const data = await newVerification(token)
      setSuccess(data.success)
      setError(data.error)
    } catch {
      setError("Something went wrong.")
    }
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center justify-center w-full">
        {!success && !error && <CircleLoader color="#ff35ba" size={50} />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  )
}
