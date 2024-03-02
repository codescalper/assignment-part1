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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SelectNetwok from "./Select"
import { useNetwork } from "@/hooks/useNetwork"

const formSchema = z.object({
  contractAddress: z.string().refine(value => value.length === 42, "Must be a valid contract address"),
  tokenId: z.string().refine(value => value.length > 0, "Must be a valid token ID"),
  network: z.enum(["ethereum", "polygon", "solana"]),
});

export default function NFTForm() {
  const {isNetwork} = useNetwork();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractAddress: "",
      tokenId: "",
      network: "ethereum",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isNetwork === "ethereum" || isNetwork === "polygon" || isNetwork === "solana") {
      values.network = isNetwork;
    } 
    
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }


  return (
    <div className="flex justify-center ">
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  max-w-full ">
        <FormField
          control={form.control}
          name="contractAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract Address</FormLabel>
              <FormControl>
                <Input placeholder="Paste NFT contract address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tokenId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter Token ID" {...field} />
              </FormControl>
              <FormDescription>
                This is your unique token ID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="network"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network</FormLabel>
              <FormControl>
                <SelectNetwok />
              </FormControl>
              <FormDescription>
                This is your unique token ID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}
