import { Card, Table, Tag } from "antd";
import { VideoStatus } from "@/types/types";

interface VideoStatusTableProps {
  title: string;
  data: VideoStatus[];
}

export const VideoStatusTable = ({ title, data }: VideoStatusTableProps) => {
  const columns = [
    { title: "Video ID", dataIndex: "videoId", key: "videoId" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "processing" ? "blue" : status === "success" ? "green" : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
   /*  {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string | undefined) => title || "N/A",
    },
    {
      title: "Transcription",
      dataIndex: "transcription",
      key: "transcription",
      render: (transcription: string | undefined) =>
        transcription ? transcription.slice(0, 50) + "..." : "N/A",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration: string | undefined) => duration || "N/A",
    }, */
  ];

  return (
    <Card title={title}>
      <Table
        dataSource={data.slice(0, 5)} // Limit to 5 for brevity
        columns={columns}
        pagination={false}
        size="small"
        rowKey="videoId"
      />
    </Card>
  );
};