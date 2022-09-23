import NFTFeedContext from "@/context/NFTFeedContext";
import PostPreview from "./PostPreview";

export const NFTFeed = () => {
  const { feed } = NFTFeedContext.useContainer();

  return (
    <div className="grid grid-cols-5">
      {feed?.map((x) => (
        <PostPreview key={x.id} post={x} />
      ))}
    </div>
  );
};

export default NFTFeed;
