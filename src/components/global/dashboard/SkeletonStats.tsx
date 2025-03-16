import { Card, Col, Row, Skeleton } from "antd";

export const SkeletonStats = () => (
  <Row gutter={[16, 16]}>
    {Array(4)
      .fill(null)
      .map((_, index) => (
        <Col key={index} xs={24} sm={12} md={6}>
          <Card>
            <Skeleton active paragraph={{ rows: 1 }} title={false} />
          </Card>
        </Col>
      ))}
  </Row>
);