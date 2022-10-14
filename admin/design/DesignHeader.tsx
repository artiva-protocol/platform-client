import MetadataSaveButton from "../MetadataSaveButton";

const DesignHeader = () => {
  return (
    <div className="flex justify-between items-baseline relative">
      <h1 className="text-3xl font-bold">Site Design</h1>

      <MetadataSaveButton />
    </div>
  );
};

export default DesignHeader;
