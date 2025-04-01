import { Card } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const StatusCountDisplayPie = ({ title, statusCounts }) => {
  const data = statusCounts.map(item => ({ name: item._id || 'Unknown', count: item.count }));
  const COLORS = ['#1890ff', '#13c2c2', '#fadb14', '#f5222d', '#722ed1'];

  return (
    <Card className="shadow-md rounded-lg m-4 w-full max-w-xs border-none" title={<span className="text-lg font-semibold text-gray-800">{title}</span>}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

const StatusDashboardPie = ({ data }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-100 min-h-screen">
      <StatusCountDisplayPie title="Transcode Status" statusCounts={data.transcodeStatusCount ?? []} />
      <StatusCountDisplayPie title="Thumbnail Status" statusCounts={data.thumbnailStatusCount ?? []} />
      <StatusCountDisplayPie title="Description & Title Status" statusCounts={data.descriptionAndTitleStatus ?? []} />
      <StatusCountDisplayPie title="Transcription Status" statusCounts={data.transcriptionStatusCount ?? []} />
    </div>
  );
};

export default StatusDashboardPie;