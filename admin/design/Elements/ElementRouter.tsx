import { CustomPropertyDesigner } from "@/context/DesignerContext";
import ColorElement from "./ColorElement";
import ImageElement from "./ImageElement";
import SelectElement from "./SelectElement";
import SwitchElement from "./SwitchElement";
import TextElement from "./TextElement";

const ElementRouter = ({
  property,
  value,
  onChange,
}: {
  property: CustomPropertyDesigner;
  value: any;
  onChange: (value: any) => void;
}) => {
  const props = {
    value,
    onChange,
    title: property.title,
    options: property.options || [],
  };

  switch (property.type) {
    case "boolean":
      return <SwitchElement {...props} />;
    case "select":
      return <SelectElement {...props} />;
    case "color":
      return <ColorElement {...props} />;
    case "text":
      return <TextElement {...props} />;
    case "image":
      return <ImageElement {...props} />;
    default:
      throw new Error("Error invalid property type");
  }
};

export default ElementRouter;
