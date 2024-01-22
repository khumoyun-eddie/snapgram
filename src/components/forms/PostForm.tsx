import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
  useToast,
} from "@/components/ui";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";

type PostFormPros = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormPros) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();

  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join("") : "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      });

      if (!updatedPost) {
        toast({ title: "Please try again" });
      }
      return navigate(`/posts/${post.$id}`);
    }

    const newPost = await createPost({
      ...values,
      userId: user.id,
    });
    if (!newPost) {
      toast({
        title: "Please try again",
      });
    }
    navigate("/");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full max-w-5xl gap-9'>
        <FormField
          control={form.control}
          name='caption'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Caption</FormLabel>
              <FormControl>
                <Textarea className='shad-textarea custom-scrollbar' {...field} />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='file'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Photo</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Location</FormLabel>
              <FormControl>
                <Input className='shad-input' type='text' {...field} />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Tags</FormLabel>
              <FormControl>
                <Input placeholder='Art, Expression, Learn' type='text' className='shad-input' {...field} />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />
        <div className='flex items-center justify-end gap-4'>
          <Button className='shad-button_dark_4' type='button' onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button
            className='shad-button_primary whitespace-nowrap'
            type='submit'
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {isLoadingCreate || (isLoadingUpdate && "Loading...")}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
