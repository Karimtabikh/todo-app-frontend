"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Lock, Mail } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Mutation, useMutation, useQuery } from "@tanstack/react-query";
import { getUser } from "../api/auth/signin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const schema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(3, { message: "Password is required" }),
});

type Schema = z.infer<typeof schema>;

export default function SignInPage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: Schema) => getUser(data),
    onSuccess: (data) => {
      console.log(data);
      Cookies.set("token", data.access_token, { expires: 1 });
      toast.success("Logged in successfully");
      router.push("/");
    },
    onError: (error) => {
      toast.error("Email or password incorrect");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Schema> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="pl-10"
              required
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="password"
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="pl-10"
              required
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Button variant="link" className="text-sm"></Button>

        <div className="mt-4 text-center">
          <Button
            className="text-sm bg-transparent shadow-none text-black hover:bg-transparent"
            asChild
          >
            <Link href="/sign-up">Don't have an account? Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
