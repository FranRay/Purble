import Form from "@/components/Form";
import PostFeed from "@/components/posts/PostFeed";

export default function Home() {
  return (
    <>
      {/* Render components */}
      <Form placeholder="what's happening?" />
      <PostFeed />
    </>
  );
}
