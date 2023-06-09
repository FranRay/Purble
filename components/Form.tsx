import axios from "axios";
import { useCallback, useState } from "react";
import { BsImageFill } from "react-icons/bs";
import { toast } from "react-hot-toast";

import useRegisterModal from "@/hooks/useRegisterModal";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import usePost from "@/hooks/usePost";
import usePosts from "@/hooks/usePosts";

import Button from "./Button";
import Avatar from "./Avatar";

interface FormProps {
  placeholder: string;
  isComment?: boolean;
  postId?: string;
}

// This is the form that is used to create a new post or comment
const Form: React.FC<FormProps> = ({ placeholder, isComment, postId }) => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();
  const { mutate: mutatePosts } = usePosts();
  const { mutate: mutatePost } = usePost(postId as string); 

  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  // const [imagePreviewUrl, setImagePreviewUrl] = useState<string | undefined>(undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setFilename(event.target.files[0].name);
    }
  };

  // If the user is logged in, show the form
  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      const url = isComment ? `/api/comments?postId=${postId}` : "/api/posts";

      // Upload image if selected
      let imagePreviewUrl: string | undefined;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "uploads");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dxr4zksko/image/upload",
          formData
        );

        // console.log(response.data || null);
        console.log(response.data.url || null);

        if (response.data && response.data.url) {
          imagePreviewUrl = response.data.url;
        } else {
          throw new Error("Image upload failed");
        }
      }
      console.log(imagePreviewUrl);
      // Create post/comment with body and image URL
      await axios.post(url, { body, imageUrl: imagePreviewUrl })
      .then((res) => 
        {
        console.log(res)
        }
      );

      

      toast.success("Tweet Created");

      // Reset the form and update the posts
      setBody("");
      setFile(null);
      setFilename("");
      mutatePosts();
      mutatePost();

    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [body, file, mutatePosts, isComment, postId, mutatePost]);

  // If the user is not logged in, show the login/register buttons
  return (
    <div className="border-b-[1px] border-neutral-800 px-5 py-2">
      {currentUser ? (
        <div className="flex flex-row gap-4 mt-4">
          <div>
            <Avatar userId={currentUser?.id} />
          </div>
          <div className="w-full">
            <textarea
              disabled={isLoading}
              onChange={(e) => setBody(e.target.value)}
              value={body}
              className="
                disabled:opacity-80
                peer
                resize-none
                mt-3
                w-full
                bg-black
                ring-0
                outline-none
                text-[20px]
                placeholder-neutral-500
                text-white
              "
              placeholder={placeholder}
            ></textarea>
            <hr
              className="
                opacity-100
                h-[1px]
                border-neutral-800
                transition
                "
            />
            {/* Display the image preview */}
            {file && (
              <div className="flex items-center mt-2">
                <img src={URL.createObjectURL(file)} alt="Preview" className="h-20 w-20 object-cover" />
                <span className="text-white ml-2">{filename}</span>
              </div>
            )}
            {/* Buttons for image upload and submit */}
            <div className="mt-4 flex flex-row content-center items-center pb-2">
              <label htmlFor="image-upload">
                <BsImageFill
                  size={20}
                  className="cursor-pointer text-neutral-500 hover:text-sky-500"
                />
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-full flex justify-end">
                <Button disabled={isLoading || !body} onClick={onSubmit} label="Tweet" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h1
            className="
        text-white
        text-2xl
        text-center
        mb-4
        font-bold
        "
          >
            Welcome to Fritter
          </h1>
          <div className="flex flex-row items-center justify-center gap-4">
            <Button label="Login" onClick={loginModal.onOpen} />
            <Button label="Register" onClick={registerModal.onOpen} secondary />
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
