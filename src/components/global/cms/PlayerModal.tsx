"use client";

import { Modal } from "antd";
import Player from "@/components/global/player";
import { PromotionalVideo } from "./types";

interface PlayerModalProps {
  isVisible: boolean;
  video: PromotionalVideo | null;
  onCancel: () => void;
}

export default function PlayerModal({ isVisible, video, onCancel }: PlayerModalProps) {
  return (
    <Modal
      title={video?.title || "Promotional Video"}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      className="rounded-xl"
      width={800}
    >
      {video?.hslUrl ? (
        <Player
          hslUrl={video.hslUrl}
          thumbnailsUrl={video.thumbnailsUrl}
          posterUrl={video.posterUrl}
          videoId={video.videoId}
        />
      ) : (
        <p>No video URL available</p>
      )}
    </Modal>
  );
}