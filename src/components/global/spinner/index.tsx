import React from 'react';
import { Flex, Spin } from 'antd';

const Spinner: React.FC = () => (
  <Flex align="center" justify='center' gap="middle" className='w-full h-full'>
    <Spin size="large" />
  </Flex>
);

export default Spinner;