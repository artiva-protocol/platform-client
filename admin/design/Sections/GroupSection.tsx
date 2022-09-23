import DesignerContext, {
  CustomPropertyDesigner,
} from "@/context/DesignerContext";
import ElementRouter from "../Elements/ElementRouter";
import merge from "deepmerge";

const GroupSection = ({ settings }: { settings: CustomPropertyDesigner[] }) => {
  const { data, mutate } = DesignerContext.useContainer();

  const onChange = (key: string, value: any) => {
    let tmp: any = { custom: {} };
    tmp.custom[key] = value;
    mutate(merge(data || {}, tmp));
  };

  return (
    <div className="p-8 bg-gray-200 w-full">
      {settings.map((x, i) => (
        <div key={i} className={`${i > 0 ? "mt-8" : ""}`}>
          <ElementRouter
            property={x}
            value={data?.custom[x.key]}
            onChange={(value: any) => onChange(x.key, value)}
          />
        </div>
      ))}
    </div>
  );
};

export default GroupSection;
