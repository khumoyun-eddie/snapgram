import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  useToast,
} from "@/components/ui";
import { SigninValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signInAccount, isPending } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        variant: "destructive",
        title: "Sign In failed. Please try again!",
      });
    }

    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        variant: "destructive",
        title: "Sign In failed. Please try again!",
      });
    }
  }

  return (
    <Form {...form}>
      <div className='flex-col sm:w-420 flex-center'>
        <img src='/assets/images/logo.svg' alt='logo' />
        <h2 className='pt-5 h3-bold md:h2-bold sm:pt-12'>Log in to your account</h2>
        <p className='mt-2 text-light-3 small-medium md:base-regular'>Welcome back!. Please, enter your details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full gap-5 mt-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='shad-button_primary'>
            {isUserLoading ? (
              <div className='gap-2 flex-center'>
                <Loader />
                Loading...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className='mt-2 text-center text-small-regular text-light-2'>
            Don't have an account?
            <Link to='/sign-up' className='ml-1 text-primary-500 text-small-semibold'>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
