import DesignerContext from "context/DesignerContext";
import merge from "deepmerge";
import ColorElement from "../Elements/ColorElement";
import ImageElement from "../Elements/ImageElement";
import TextElement from "../Elements/TextElement";

const BrandSettings = () => {
  const { data, mutate } = DesignerContext.useContainer();

  const onChange = (key: string, value: any) => {
    let tmp: any = {};
    tmp[key] = value;
    mutate(merge(data || {}, tmp));
  };

  return (
    <div className="p-8 bg-gray-200 w-full">
      <TextElement
        title="Site description"
        description="Used in your theme, meta data and search results"
        value={data?.description}
        onChange={(value) => onChange("description", value)}
      />
      <div className="flex items-top mt-10 relative">
        <ColorElement
          title="Accent color"
          description="Primary color used in your theme"
          value={data?.accent_color}
          onChange={(value) => {
            onChange("accent_color", value);
          }}
        />
      </div>
      <div className="mt-10">
        <ImageElement
          title="Platform logo"
          description="The primary logo, should be transparent and at least 600x72px"
          buttonText="Upload logo"
          value={data?.logo}
          onChange={(value) => {
            onChange("logo", value);
          }}
        />
      </div>

      <div className="mt-10">
        <ImageElement
          title="Platform cover"
          description="The primary logo, should be transparent and at least 600x72px"
          buttonText="Upload cover"
          value={data?.cover_image}
          onChange={(value) => {
            onChange("cover_image", value);
          }}
        />
      </div>
    </div>
  );
};

export default BrandSettings;
