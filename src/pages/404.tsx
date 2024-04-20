import { Result, Button } from 'antd/lib';
import { useRouter } from 'next/router';
import { HomeOutlined } from '@ant-design/icons/lib';

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => router.push('/')}>
          <HomeOutlined /> Back to Home
        </Button>
      }
    />
  );
};

export default NotFoundPage;
