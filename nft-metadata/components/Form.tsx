"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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

const formSchema = z.object({
    contractAddress: z.string().refine(value => value.length === 42, "Must be a valid contract address"),
    tokenId: z.string().refine(value => value.length > 0, "Must be a valid token ID"),
    network: z.enum(["ethereum", "polygon", "solana"]),
  });

export default function NFTForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractAddress: "",
      tokenId: "",
      network: "ethereum",
    },
  })

 
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl ">
      <FormField
        control={form.control}
        name="contractAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contract Address</FormLabel>
            <FormControl>
              <Input placeholder="Paste NFT contract address" {...field} />
            </FormControl>
            <FormDescription>
              This is your public display name.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  </Form>
  )
}

