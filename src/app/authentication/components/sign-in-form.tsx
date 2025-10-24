"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.email("E-mail inválido!"),
  password: z.string("Senha inválida!").min(8, "Senha inválida!"),
});

type FormValues = z.infer<typeof formSchema>;

const SignInForm = ({ switchToSignUp }: { switchToSignUp?: () => void }) => {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            if (ctx.error.code === "USER_NOT_FOUND") {
              toast.error("E-mail não encontrado.");
              return form.setError("email", {
                message: "E-mail não encontrado.",
              });
            }
            if (ctx.error.code === "INVALID_EMAIL_OR_PASSWORD") {
              toast.error("E-mail ou senha inválidos.");
              form.setError("password", {
                message: "E-mail ou senha inválidos.",
              });
              return form.setError("email", {
                message: "E-mail ou senha inválidos.",
              });
            }
            toast.error(ctx.error.message);
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignInWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };
  return (
    <>
      <Card className="w-full border-none bg-transparent shadow-none">
        <CardHeader>
          <Link
            href="/"
            className="text-muted-foreground cursor-pointer text-xs"
          >
            ⟵ Voltar
          </Link>
          <CardTitle className="text-4xl text-gray-900 dark:text-white">
            Entrar na conta
          </CardTitle>
          <CardDescription className="dark:text-muted-foreground/80 text-gray-600">
            Não possui uma conta Logyc?{" "}
            <button
              type="button"
              onClick={() => switchToSignUp && switchToSignUp()}
              className="cursor-pointer text-green-600 hover:underline"
            >
              Crie uma.
            </button>
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 border border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 focus:border-green-600 focus:ring-0 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/60 dark:focus:border-green-500"
                        placeholder="Digite seu email"
                        {...field}
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
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="h-12 border border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 focus:border-green-600 focus:ring-0 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/60 dark:focus:border-green-500"
                          placeholder="Digite sua senha"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <EyeOff className="text-muted-foreground h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                type="submit"
                className="h-12 w-full cursor-pointer bg-green-600 font-sans font-normal text-white duration-300 hover:scale-[1.02] hover:bg-green-700"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar na conta Logyc"
                )}
              </Button>
              <div className="my-3 flex w-full items-center justify-center gap-3">
                <div className="h-0 w-full border-t"></div>
                <p className="text-muted-foreground text-sm">ou</p>
                <div className="h-0 w-full border-t"></div>
              </div>
              <Button
                className="h-12 w-full cursor-pointer border border-gray-300 bg-transparent font-sans font-normal text-gray-900 duration-300 hover:scale-[1.02] hover:bg-transparent dark:border-white/30 dark:text-white"
                onClick={handleSignInWithGoogle}
                type="button"
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando com Google...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Entrar com Google
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default SignInForm;
