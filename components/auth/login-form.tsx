"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { LoginSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { login } from "@/lib/actions/login"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { CardWrapper } from "./card-wrapper"

export const LoginForm = () => {
  const searchParams = useSearchParams()

  const callbackUrl = searchParams.get("callbackUrl")

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email is already in use with different provider!"
      : ""

  const [showTwoFactor, setShowTwoFactor] = useState(false)

  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      login(values, callbackUrl!)
        .then((data) => {
          if (data?.error) {
            form.reset()
            setError(data?.error)
          }

          if (data?.success) {
            form.reset()
            setSuccess(data?.success)
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true)
          }
        })
        .catch(() => {
          setError("Something went wrong!")
        })
    })

    form.reset
  }
  return (
    <CardWrapper
      headerLabel="Go on and store your passwords secure."
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        autoCorrect="off"
                        autoComplete="off"
                        autoCapitalize="off"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john.doe@example.com"
                          type="email"
                          autoCorrect="off"
                          autoComplete="off"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="•••••••••"
                          type="password"
                          autoCorrect="off"
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button variant="link" size="sm" asChild className="px-0">
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type="submit" disabled={isPending} className="w-full">
            {showTwoFactor ? "Confirm" : "Log In"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
