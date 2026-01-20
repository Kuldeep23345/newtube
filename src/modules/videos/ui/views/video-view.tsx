import { CommentsSection } from "../sections/comments-section";
import { SuggestionsSection } from "../sections/suggestions-section";
import { VideoSection } from "../sections/video-section";

interface VideoViewProps {
  videoId: string;
}

export const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="flex flex-col max-w-425 mx-auto pt-2.5 px-4 mb-10">
      <div className="flex flex-col gap-y-6 lg:flex-row">
        <div className="flex-1 min-w-0">
          <VideoSection videoId={videoId} />
          <div className="xl:hidden block mt-4">
            <CommentsSection videoId={videoId} />
          </div>
          <SuggestionsSection videoId={videoId} isManual />
        </div>
        <div className="hidden xl:block w-full xl:w-95 2xl:w-115 shrink">
          <SuggestionsSection videoId={videoId} />
        </div>
      </div>
    </div>
  );
};
