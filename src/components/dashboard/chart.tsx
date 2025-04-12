import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Column, Line, Pie } from '@ant-design/charts';
import { Card, Spin, Row, Col, Button, Typography, Alert } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Define interfaces for type safety
interface Statistics {
  id: string;
  label: string;
  revenue: number;
  orders: number;
  newCustomers: number;
}

interface ProductCategory {
  id: string;
  category: string;
  value: number;
}

interface CustomerGender {
  id: string;
  gender: string;
  value: number;
}

// Consistent color palette
const COLOR_PALETTE = {
  primary: '#1890FF',
  secondary: '#FF6B6B',
  accent: '#FFD700',
  gender: ['#FF66CC', '#00BFFF', '#32CD32'],
  category: ['#FF5733', '#FF8C00', '#FFD700', '#00CED1', '#6A5ACD'],
};

const Chart: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [customerGender, setCustomerGender] = useState<CustomerGender[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, categoriesRes, genderRes] = await Promise.all([
        axios.get<Statistics[]>('http://localhost:8080/statistics'),
        axios.get<ProductCategory[]>('http://localhost:8080/productCategories'),
        axios.get<CustomerGender[]>('http://localhost:8080/customerGender'),
      ]);
      setStatistics(statsRes.data);
      setProductCategories(categoriesRes.data);
      setCustomerGender(genderRes.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Memoized chart configurations
  const revenueConfig = useMemo(
    () => ({
      data: statistics.length > 0 ? statistics : [{ label: 'No Data', revenue: 0 }],
      xField: 'label',
      yField: 'revenue',
      label: { position: 'top', style: { fontSize: 14, fontWeight: 'bold', fill: '#FF99AA' } },
      color: COLOR_PALETTE.primary,
      // tooltip: {
      //   formatter: (datum: { revenue: number; label: string }) => ({
      //     name: 'Doanh thu',
      //     value: `${datum.revenue.toLocaleString()} VNĐ`,
      //   }),
      // },
      interaction: { elementHighlight: true },
      columnStyle: { radius: [8, 8, 0, 0] },
    }),
    [statistics]
  );

  const orderConfig = useMemo(
    () => ({
      data: statistics.length > 0 ? statistics : [{ label: 'No Data', orders: 0 }],
      xField: 'label',
      yField: 'orders',
      color: COLOR_PALETTE.secondary,
      // tooltip: {
      //   formatter: (datum: { orders: number; label: string }) => ({
      //     name: 'Đơn hàng',
      //     value: `${datum.orders} đơn`,
      //   }),
      // },
      interaction: { elementHighlight: true },
      lineStyle: { lineWidth: 3 },
      point: { size: 5, shape: 'circle' },
    }),
    [statistics]
  );

  const categoryConfig = useMemo(
    () => ({
      data: productCategories.length > 0 ? productCategories : [{ category: 'No Data', value: 0 }],
      angleField: 'value',
      colorField: 'category',
      label: { type: 'spider', style: { fontSize: 14, fontWeight: 'bold' } },
      radius: 0.8,
      color: COLOR_PALETTE.category,
      // tooltip: {
      //   formatter: (datum: { category: string; value: number }) => ({
      //     name: 'Loại sản phẩm',
      //     value: `${datum.category}: ${datum.value}`,
      //   }),
      // },
    }),
    [productCategories]
  );

  const genderConfig = useMemo(
    () => ({
      data: customerGender.length > 0 ? customerGender : [{ gender: 'No Data', value: 0 }],
      angleField: 'value',
      colorField: 'gender',
      label: { type: 'spider', style: { fontSize: 14, fontWeight: 'bold' } },
      radius: 0.8,
      color: COLOR_PALETTE.gender,
      // tooltip: {
      //   formatter: (datum: { gender: string; value: number }) => ({
      //     name: 'Giới tính',
      //     value: `${datum.gender}: ${datum.value}`,
      //   }),
      // },
    }),
    [customerGender]
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <>


      <h1
        style={{
          fontSize: '24px',
          fontWeight: 600,
          marginBottom: '16px',

          textAlign: 'center',
          textTransform: 'uppercase',
        }
        }
      >Thống kê</h1>
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={fetchData}>
              Thử lại
            </Button>
          }
          style={{ marginBottom: '16px' }}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="📈 Doanh thu theo tháng"
            style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}


            headStyle={{ backgroundColor: "#FF99AA", color: '#fff' }}
          >
            {statistics.length > 0 ? <Column {...revenueConfig} /> : <p>Không có dữ liệu</p>}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="🛍️ Phân loại sản phẩm"
            style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}


            headStyle={{ backgroundColor: "#FF99AA", color: '#fff' }}
          >
            {productCategories.length > 0 ? <Pie {...categoryConfig} /> : <p>Không có dữ liệu</p>}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="📦 Số đơn hàng theo tháng"
            style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}

            headStyle={{ backgroundColor: "#FF99AA", color: '#fff' }}
          >
            {statistics.length > 0 ? <Line {...orderConfig} /> : <p>Không có dữ liệu</p>}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="👥 Tỷ lệ khách hàng theo giới tính"
            style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}

            headStyle={{ backgroundColor: "#FF99AA", color: '#fff' }}
          >
            {customerGender.length > 0 ? <Pie {...genderConfig} /> : <p>Không có dữ liệu</p>}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Chart;