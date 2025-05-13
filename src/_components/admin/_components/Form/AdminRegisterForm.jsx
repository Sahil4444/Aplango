"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { collection, addDoc, getDocs, query } from "firebase/firestore"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { firestore } from "../../../../../Database/Firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify";
// Form schema
const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export function AdminRegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values) {
    try {
      setIsSubmitting(true)

      const today = new Date()
      const dd = String(today.getDate()).padStart(2, "0")
      const mm = String(today.getMonth() + 1).padStart(2, "0")
      const yyyy = today.getFullYear()
      const createdOn = `${dd}-${mm}-${yyyy}`

      const adminsRef = collection(firestore, "admins")
      const querySnapshot = await getDocs(query(adminsRef))
      const adminCount = querySnapshot.size + 1

      await addDoc(adminsRef, {
        invoice: String(adminCount).padStart(2, "0"),
        name: values.name,
        emailid: values.email,
        password: values.password, // In production, hash the password!
        createdon: createdOn,
      })

      toast.success("Admin Registered Successfully.", {
          position: "top-center",
        });

      navigate("/Aplango/admin/admins")
    } catch (error) {
      console.error("Error adding admin: ", error)
      toast.success("Error creating admin!", {
          position: "top-center",
        });
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/Aplango/admin")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Admin</CardTitle>
        <CardDescription>Add a new administrator to the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input type="email" placeholder="admin@example.com" {...field} />
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
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormDescription>Password must be at least 6 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Admin"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
