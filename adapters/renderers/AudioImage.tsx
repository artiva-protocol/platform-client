import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useMemo,
  Fragment,
} from "react";
import { useSyncRef } from "../../utils/useSyncRef";
import { MediaLoader, useMediaObjectProps } from "./MediaLoader";
import {
  RenderComponentType,
  RendererConfig,
  RenderingPreference,
  RenderRequest,
} from "@artiva/shared";
import { ImageRenderer } from "./Image";
import { ArtivaClientConfig } from "configs/artiva-client-config";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";

type FakeWaveformCanvasProps = {
  audioRef: any;
  uri: string;
  audioColors: {
    progressColor: string;
    waveformColor: string;
  };
};

const FakeWaveformCanvas = ({
  audioRef,
  uri,
  audioColors,
}: FakeWaveformCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState<undefined | number>();
  const updateWidth = useCallback(() => {
    const newWidth =
      canvasRef.current?.parentElement?.getBoundingClientRect()?.width;
    if (newWidth && newWidth !== width) {
      setWidth(newWidth);
    }
  }, [canvasRef.current]);

  useEffect(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [updateWidth]);

  const uriEntropy = useMemo(
    () =>
      uri
        .split("")
        .reduce((last, char) => last ^ (last + char.charCodeAt(0)), 0),
    [uri]
  );

  useEffect(() => {
    updateCanvasLines();
    const updateInterval = setInterval(updateCanvasLines, 1000);
    return () => clearInterval(updateInterval);
  }, [width]);

  const seekAudio: MouseEventHandler<HTMLCanvasElement> = useCallback(
    (evt) => {
      if (audioRef.current && canvasRef.current && width) {
        const position =
          (evt.clientX - canvasRef.current.getBoundingClientRect().left) /
          width;
        audioRef.current.currentTime = position * audioRef.current.duration;
        audioRef.current.play();
        updateCanvasLines();
      }
    },
    [audioRef.current, width]
  );

  const height = 30;
  const updateCanvasLines = useCallback(() => {
    if (canvasRef.current && width && audioRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (!context) {
        return;
      }
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < width; i += 5) {
        const sinRnd = Math.sin(i + uriEntropy) * 10000;
        const lineHeight = Math.floor(
          Math.min(
            Math.sin((i / width) * 0.2) +
              2 * (sinRnd - Math.floor(sinRnd)) * 40,
            height
          )
        );
        if (
          audioRef.current.currentTime / audioRef.current.duration >
          i / width
        ) {
          context.fillStyle = audioColors.progressColor;
        } else {
          context.fillStyle = audioColors.waveformColor;
        }
        context.fillRect(i, (height - lineHeight) / 2, 2, lineHeight);
      }
    }
  }, [canvasRef.current, audioRef.current, width]);

  return (
    <canvas
      ref={canvasRef}
      className="cursor-pointer w-[86%]"
      height={height}
      width={width}
      onClick={seekAudio}
    />
  );
};

export const AudioImageRenderer = forwardRef<
  HTMLAudioElement,
  RenderComponentType
>(({ request }, ref) => {
  const uri = request.media.content?.uri || request.media.animation?.uri;
  const { preferredIPFSGateway } = ArtivaClientConfig;
  const { props, loading, error } = useMediaObjectProps({
    uri,
    request,
    preferredIPFSGateway,
  });

  const imageProps = useMediaObjectProps({
    uri: request.media.image?.uri,
    request,
    preferredIPFSGateway,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  useSyncRef(audioRef, ref);
  const [playing, setPlaying] = useState<boolean>(false);

  const togglePlay: MouseEventHandler<HTMLAudioElement> = useCallback(
    (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (audioRef.current) {
        if (playing) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
      }
    },
    [audioRef.current, playing]
  );

  useEffect(() => {
    const isMobile = () => {
      try {
        document.createEvent("TouchEvent");
        return true;
      } catch (e) {
        return false;
      }
    };
    if (!document || !isMobile()) return;
    props.onLoad();
  }, [document]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [audioRef.current, playing]);

  const playingText = playing ? "Pause" : "Play";

  return (
    <MediaLoader loading={loading} error={error}>
      <Fragment>
        {!loading && (
          <div className="w-full max-w-xs sm:max-w-md flex flex-col items-center justify-around relative">
            <img {...imageProps.props} className="object-contain" />
            <div className="mt-4 flex flex-row items-center justify-around w-full">
              <button
                aria-live="polite"
                aria-pressed={playing ? true : false}
                onClick={togglePlay as any}
                title={playingText}
              >
                {playing ? (
                  <PauseIcon className="w-8 text-gray-600 bg-gray-200 rounded-full p-2" />
                ) : (
                  <PlayIcon className="w-8 text-gray-600 bg-gray-200 rounded-full p-2" />
                )}
              </button>
              <FakeWaveformCanvas
                uri={uri || ""}
                audioRef={audioRef}
                audioColors={{
                  progressColor: "#333",
                  waveformColor: "#999",
                }}
              />
            </div>
          </div>
        )}
        <audio
          loop={true}
          ref={audioRef}
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          {...props}
          onLoadedData={props.onLoad}
          onCanPlayThrough={props.onLoad}
        />
      </Fragment>
    </MediaLoader>
  );
});

AudioImageRenderer.displayName = "AudioImageRenderer";

export const AudioImage: RendererConfig = {
  getRenderingPreference(request: RenderRequest) {
    if (
      request.media?.image &&
      (request.media.content?.type?.startsWith("audio") ||
        request.media.animation?.type?.startsWith("audio"))
    ) {
      return RenderingPreference.PRIORITY;
    }
    return RenderingPreference.INVALID;
  },
  render: (props: RenderComponentType) => {
    if (props.request.renderingContext === "FULL") {
      return <AudioImageRenderer {...props} />;
    }
    const tmp = { ...props };
    tmp.request.media.content = undefined;
    return <ImageRenderer {...tmp} />;
  },
};
