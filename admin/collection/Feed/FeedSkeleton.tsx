import NFTLoading from "./NFTLoading";

const FeedSkeleton = () => {
  return (
    <div className="grid gap-1 grid-cols-3">
      {Array(3)
        .fill("")
        .map((_, i) => {
          return <NFTLoading key={i} />;
        })}
    </div>
  );
};

export default FeedSkeleton;
