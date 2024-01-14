import { Alert, Space, Spin } from 'antd'
const Spinner = ({ text }) => (
  <Space
    direction='vertical'
    style={{
      width: '100%'
    }}
  >
    <Space>
      <Spin tip='Loading' size='large'>
        <Alert message={text ? text : 'Đang được thêm'} description='...' type='warning' />
      </Spin>
    </Space>
  </Space>
)
export default Spinner
