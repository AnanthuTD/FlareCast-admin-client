import React from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Reusable component for displaying status counts as a bar chart
export const StatusCountDisplayBar = ({ title, statusCounts }) => {
  const data = statusCounts.map(item => ({
    name: item._id || 'Unknown',
    count: item.count,
  }));

  return (
    <Card
      title={<span className="text-lg font-semibold text-gray-800">{title}</span>}
      className="shadow-md rounded-lg m-4 w-full max-w-xs border-none"
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#1890ff" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Parent component
const StatusDashboardBar = ({ data }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-100 min-h-screen">
      <StatusCountDisplayBar title="Transcode Status" statusCounts={data.transcodeStatusCount ?? []} />
      <StatusCountDisplayBar title="Thumbnail Status" statusCounts={data.thumbnailStatusCount ?? []} />
      <StatusCountDisplayBar title="Description & Title Status" statusCounts={data.descriptionAndTitleStatus ?? []} />
      <StatusCountDisplayBar title="Transcription Status" statusCounts={data.transcriptionStatusCount ?? []} />
    </div>
  );
};

export default StatusDashboardBar;