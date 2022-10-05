import CuratorContext from "@/context/CuratorContext";
import NFTFeedContext from "@/context/NFTFeedContext";
import PostPreview from "./PostPreview";

export const NFTFeed = () => {
  const { addContent, collection } = CuratorContext.useContainer();
  const { feed } = NFTFeedContext.useContainer();

  return (
    <div className="grid grid-cols-5">
      {feed?.map((x) => (
        <PostPreview
          key={x.id}
          post={x}
          onClick={() => {
            addContent(x);
          }}
          selected={!!collection.find((y) => y.id === x.id)}
        />
      ))}
    </div>
  );
};

export default NFTFeed;
