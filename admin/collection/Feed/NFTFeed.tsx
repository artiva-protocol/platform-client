import CuratorContext from "@/context/CuratorContext";
import NFTFeedContext from "@/context/NFTFeedContext";
import { PostRequest } from "@/hooks/post/useAddContents";
import PostPreview from "./PostPreview";

export const NFTFeed = () => {
  const { addContent, collection } = CuratorContext.useContainer();
  const { feed } = NFTFeedContext.useContainer();

  const isCurated = (post: PostRequest) => {
    return !!collection.find(
      (x) =>
        x.type === post.type &&
        JSON.stringify(x.content) === JSON.stringify(post.content)
    );
  };

  return (
    <div className="grid grid-cols-5">
      {feed?.map((x, i) => (
        <PostPreview
          key={i}
          post={x}
          onClick={() => {
            addContent(x);
          }}
          selected={isCurated(x)}
        />
      ))}
    </div>
  );
};

export default NFTFeed;
