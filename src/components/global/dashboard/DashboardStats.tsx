import { Card, Col, Row, Statistic } from "antd";
import { AdminDashboardState } from "@/types/types";

interface DashboardStatsProps {
  state: AdminDashboardState;
}

export const DashboardStats = ({ state }: DashboardStatsProps) => {
  const transcodingCount = Object.values(state.transcodingVideos).filter(
    (v) => v.status === "processing"
  ).length;
  const processedCount = Object.values(state.processedVideos).filter(
    (v) => v.status === "success"
  ).length;
  const transcriptionCount = Object.values(state.transcriptions).filter(
    (v) => v.status === "processing"
  ).length;
  const thumbnailCount = Object.values(state.thumbnails).filter(
    (v) => v.status === "processing"
  ).length;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic title="Active Users" value={state.activeUsers} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic title="New Signups" value={state.newSignups} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic title="Total Users" value={state.totalUsers} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic title="Total Videos" value={state.totalVideos?.[0]?.total} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic title="Videos Transcoding" value={transcodingCount} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic title="Videos Processed" value={processedCount} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic title="Transcriptions in Progress" value={transcriptionCount} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic title="Thumbnails in Progress" value={thumbnailCount} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic title="Active Subscriptions" value={state.activeSubscriptionsCount} />
        </Card>
      </Col>
    </Row>
  );
};