"use client"

import React, { useState } from "react"
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

// Form schemas

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
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

  const cancelInteractionIfLoading = (e: React.MouseEvent) => {
    if (loading) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // Handle page changes
  const onValueChange = (mode: string) => {
    setMode(mode);
  }
  const onSubmit = (values: any) => {
    if (loading) return;
    setLoading(true);

    let url: string = (process.env.NEXT_PUBLIC_API_URL as string + "auth/");
    let body;
    // We could check types, but it's a real pain.
    if (mode === "login") {
      url += "login";

      const loginData = values as z.infer<typeof loginSchema>
      body = {
        email: loginData.email,
        password: loginData.password
      };
    } else if (mode === "register") {
      url += "register";

      const registerData = values as z.infer<typeof registerSchema>
      body = {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password
      };
    } else {
      toast("Errore", { description: "Modalità del form non riconosciuta!" })
      return;
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.ok) {
        toast("Logged in");
      } else {
        throw new Error("Codice di errore " + response.status);
      }
    }).catch((e: Error) => {
      const description: string = e.message ?? e;
      toast("Errore", { description: description })
    }).finally(() => {
      setLoading(false);
    })
  }

  return (
    // grid-rows-[1fr,auto,1fr]: 
    // auto -> per la riga centrare usa auto,
    // 1fr per le altre due (spazio uguale)
    <div className="min-h-screen grid grid-rows-[1fr,auto,1fr]">
      <div className="flex justify-center row-start-2">
        <Tabs
          defaultValue="login"
          className="w-[400px]"
          onValueChange={(value) => onValueChange(value)}
        >
          {/* Declare the possible tabs */}
          <TabsList
            className="grid w-full grid-cols-2 rounded"
            onClick={cancelInteractionIfLoading}
          >
            <TabsTrigger
              value="login"
              className="rounded hover:cursor-pointer">
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register" className="rounded hover:cursor-pointer">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="rounded">
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
                    <Button className="rounded hover:cursor-pointer" type="submit">Login</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card className="rounded">
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
                            <Input type="cfpassword" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button className="rounded hover:cursor-pointer" type="submit">Register</Button>
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