import { Card, Skeleton } from "antd";

interface SkeletonTableProps {
  title: string;
}

export const SkeletonTable = ({ title }: SkeletonTableProps) => (
  <Card title={title}>
    <Skeleton active paragraph={{ rows: 5 }} title={false} />
  </Card>
);