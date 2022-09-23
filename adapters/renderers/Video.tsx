import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { MediaLoader, useMediaObjectProps } from "./MediaLoader";
import {
  RenderComponentType,
  RendererConfig,
  RenderingPreference,
  RenderRequest,
} from "@artiva/shared";
import { ImageRenderer } from "./Image";

import { useSyncRef } from "../../utils/useSyncRef";
import { useA11yIdPrefix } from "../../utils/useA11yIdPrefix";
import { ArtivaClientConfig } from "configs/artiva-client-config";
import {
  ArrowsPointingOutIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";

export const VideoRenderer = forwardRef<HTMLVideoElement, RenderComponentType>(
  (props, ref) => {
    const { request, className } = props;
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const video = useRef<HTMLVideoElement>(null);
    const { preferredIPFSGateway } = ArtivaClientConfig;
    const [showControls, setShowControls] = useState(false);

    const controlAriaId = useA11yIdPrefix("video-renderer");
    const uri =
      request.renderingContext === "FULL"
        ? request.media.animation?.uri || request.media.content?.uri
        : request.media.content?.uri || request.media.animation?.uri;

    const {
      props: mediaProps,
      loading,
      error,
    } = useMediaObjectProps({
      uri,
      request,
      preferredIPFSGateway,
    });

    useSyncRef(video, ref);

    useEffect(() => {
      const fullScreenCallback = () => {
        setIsFullScreen(!!document.fullscreenElement);
      };
      document.addEventListener("fullscreenchange", fullScreenCallback);
      return () => {
        document.removeEventListener("fullscreenchange", fullScreenCallback);
      };
    }, []);

    const onCanPlay = useCallback(() => {
      setIsPlaying(!video.current?.paused);
    }, []);

    const togglePlay = useCallback(() => {
      if (!video.current) {
        return;
      }
      if (video.current.paused) {
        video.current.play();
      } else {
        video.current?.pause();
      }
    }, [video]);

    const openFullscreen = useCallback(() => {
      const elem = video.current;
      if (elem && elem.requestFullscreen) {
        setIsMuted(false);
        return elem.requestFullscreen();
      }

      // Thank Apple for this one :(. Needed for iOS
      // @ts-ignore
      if (elem && elem.webkitSetPresentationMode) {
        setIsMuted(false);
        // @ts-ignore
        return elem.webkitSetPresentationMode("fullscreen");
      }
      return;
    }, [video]);

    const toggleMute = useCallback(() => {
      if (!video.current) {
        return;
      }
      if (video.current.muted) {
        setIsMuted(false);
      } else {
        setIsMuted(true);
      }
    }, [video]);

    const playLoop = useCallback(() => {
      if (!video.current) {
        return;
      }
      video.current.currentTime = 0;
    }, [video.current]);

    // Fallback to rendering an image if loading the video fails
    if (error) {
      return <ImageRenderer {...props} />;
    }

    return (
      <MediaLoader loading={loading} error={error}>
        <div
          className="relative h-full"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <Transition
            show={!!video.current && showControls}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="video-controls">
              <div className="absolute w-full h-full flex items-center justify-around z-10">
                <div className="flex items-center">
                  <button
                    onClick={openFullscreen}
                    className="bg-black rounded-full w-12 h-12 mr-6 flex items-center justify-around"
                  >
                    <ArrowsPointingOutIcon className="w-6 text-white" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="bg-white rounded-full w-16 h-16 mr-6 flex items-center justify-around"
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-8 text-black" />
                    ) : (
                      <PlayIcon className="w-8 text-black" />
                    )}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="bg-black rounded-full w-12 h-12 flex items-center justify-around"
                  >
                    {isMuted ? (
                      <SpeakerXMarkIcon className="w-6 text-white" />
                    ) : (
                      <SpeakerWaveIcon className="w-6 text-white" />
                    )}
                  </button>
                </div>
              </div>
              <div className="absolute bg-black opacity-30 w-full h-full"></div>
            </div>
          </Transition>
          <video
            {...mediaProps}
            className={`${className} video-content`}
            aria-controls={controlAriaId}
            autoPlay
            muted={isMuted}
            controls={isFullScreen}
            loop
            onEnded={playLoop}
            onLoadedData={mediaProps.onLoad}
            onCanPlayThrough={onCanPlay}
            playsInline
            preload="metadata"
            ref={video}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          ></video>
        </div>
      </MediaLoader>
    );
  }
);

VideoRenderer.displayName = "VideoRenderer";

export const Video: RendererConfig = {
  getRenderingPreference: (request: RenderRequest) => {
    //Fix for foundation
    if (request.media.image?.uri.endsWith("mp4")) {
      request.media.content = request.media.image;
      request.media.content.type = "video";
      request.media.image = undefined;
    }

    const type = request.media.content?.type || request.media.animation?.type;

    const video = type?.includes("video");
    if (video) return RenderingPreference.PREFERRED;
    if (!type && !!request.media.animation?.uri)
      return RenderingPreference.NORMAL;

    return RenderingPreference.INVALID;
  },
  render: VideoRenderer,
};
