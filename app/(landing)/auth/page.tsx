"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { toast } from "sonner"

import { loginSchema, registerSchema } from "./formschemas"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<string>("login");
  const form = useForm<z.infer<typeof loginSchema> | z.infer<typeof registerSchema>>({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
    // These are important because Next will get mad
    // if a field's value changes from undefined to defined.
    defaultValues: {
      username: "",
      email: "",
      password: "",
      cfpassword: ""
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const cancelInteractionIfLoading = (e: React.MouseEvent) => {
    if (isLoading) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // Handle page changes
  const onValueChange = (mode: string) => {
    setMode(mode);
  }

  const onSubmit = (values: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (isLoading) return;

    // We could check types, but it's a real pain.
    if (mode === "login") {
      const loginData = values as z.infer<typeof loginSchema>
      login(loginData.email, loginData.password).then((logged) => {
        if (!logged) {
          toast.error("Login failed!", {
            description: "Check your credentials and retry."
          })
        }
      })
    } else if (mode === "register") {
      const registerData = values as z.infer<typeof registerSchema>
      register(registerData.username, registerData.email, registerData.password).then((registered) => {
        if (registered) {
          router.push("/dashboard")
        } else {
          toast.error("Registration failed!", {
            description: "Email or username already exists."
          })
        }
      })
    } else {
      toast("Errore", { description: "Modalità del form non riconosciuta!" })
      return;
    }
  }

  return (
    // grid-rows-[1fr,auto,1fr]: 
    // auto -> use auto for the central row
    // 1fr for the other two (equal spacing)
    <div className="min-h-screen grid grid-rows-[1fr,auto,1fr]">
      <div className="flex justify-center row-start-2">
        <Tabs
          defaultValue="login"
          className="w-[400px]"
          onValueChange={(value) => onValueChange(value)}
        >
          {/* Declare the possible tabs */}
          <TabsList
            className="grid w-full grid-cols-2"
            onClick={cancelInteractionIfLoading}
          >
            <TabsTrigger
              value="login"
              className="hover:cursor-pointer">
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register" className="hover:cursor-pointer">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Fill in your details.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="me@email.com" {...field} />
                          </FormControl>
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
                            <Input type="password" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button className="hover:cursor-pointer" type="submit">Login</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Register</CardTitle>
                <CardDescription>Fill in your details.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="yourself" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="me@email.com" {...field} />
                          </FormControl>
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
                            <Input type="password" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cfpassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button className="hover:cursor-pointer" type="submit">Register</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

}