import { EditionAnimations } from "./EditionAnimations";
import { AudioImage } from "./AudioImage";
import { Model } from "./Model";
import { VideoPreviews } from "./VideoPreviews";
import { VideoCustom } from "./VideoCustom";
import { ImageCustom } from "./ImageCustom";
import { Thumbnail } from "./Thumbnail";
import { Audio } from "./Audio";
import { Text } from "./Text";
import { HTML } from "./HTML";
import { RendererConfig } from "@artiva/shared";

export const DefaultRenderers: RendererConfig[] = [
  Thumbnail,
  VideoPreviews,
  EditionAnimations,
  AudioImage,
  Model as any,
  Audio,
  Text,
  HTML,
  ImageCustom,
  VideoCustom,
];
