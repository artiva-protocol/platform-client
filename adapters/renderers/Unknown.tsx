import {
  RenderComponentType,
  RendererConfig,
  RenderingPreference,
  RenderRequest,
} from "@artiva/shared";

export const Unknown: RendererConfig = {
  getRenderingPreference: (request: RenderRequest) => {
    if (request.media.content?.type?.startsWith("text/")) {
      return RenderingPreference.LOW;
    }
    return RenderingPreference.FALLBACK;
  },

  render: ({ request }: RenderComponentType) => (
    <div>{request.media.content?.type || "unknown"}</div>
  ),
};
