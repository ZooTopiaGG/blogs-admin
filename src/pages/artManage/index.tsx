import { Button, Divider, Table, Image, Tag, message } from 'antd';
import React, { useEffect, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, Dispatch, useHistory } from 'umi';
import { ConnectState } from '@/models/connect';
import { deleteArticleById } from '@/services/artManage';
import classnames from 'classnames';
import moment from 'moment';

interface Iprops {
  dispatch: Dispatch;
  list: any;
  listData: any;
  artInfo: any;
  listDataLoading?: boolean;
  artInfoLoading?: boolean;
  queryParams: any;
}

const ArtManage: React.FC<Iprops> = props => {
  const { dispatch, list, listData, listDataLoading, queryParams } = props;

  const history = useHistory();

  const columns: any = [
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '缩量图',
      dataIndex: 'smallimg',
      render: (val: any) => <Image style={{ cursor: 'pointer' }} width={100} src={val} />
    },
    {
      title: '类型',
      dataIndex: 'columntype',
      width: 150,
      render: (val: any, record: any) => {
        let color, text;
        switch (val) {
          case 1:
            color = 'green';
            text = '技术集';
            break;
          case 0:
            color = 'orange';
            text = '文章集';
            break;
          case 2:
            color = 'blue';
            text = '刷题集';
            break;
          default:
            color = 'green';
            text = '技术集';
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '阅读量',
      dataIndex: 'viewcount',
      width: 150
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      width: 200,
      render: (val: any) => <>{moment(val).format('YYYY-MM-DD HH:mm')}</>
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 150,
      render: (_: any, record: any) => (
        <>
          <a onClick={() => handleUpdateArticle(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => handleDeleteArticle(record)}>删除</a>
        </>
      )
    }
  ];

  const handleUpdateArticle = (record: any) => {
    history.push('/artManage/edit?id=' + record.id);
  };

  const handleDeleteArticle = (record: any) => {
    deleteArticleById(record.id)
      .then(res => {
        if (res.isSuc) {
          message.success('操作成功');
          refreshTable();
        } else {
          message.error(res.message);
        }
      })
      .catch(e => console.log(e));
  };

  const refreshTable = useCallback(() => {
    dispatch({
      type: 'artManage/getArticleListEffect',
      payload: {
        page: queryParams.page,
        size: queryParams.pageSize,
        columntype: queryParams.columntype
      }
    });
  }, [queryParams.page, queryParams.pageSize, queryParams.columntype]);

  useEffect(() => {
    refreshTable();
  }, [refreshTable]);

  const handleOk = useCallback(() => {
    history.push('/artManage/add');
  }, []);

  const onTableChange = (page: any, pageSize: any) => {
    dispatch({
      type: 'artManage/queryParamsReducer',
      payload: {
        ...queryParams,
        page: page,
        pageSize
      }
    });
  };

  return (
    <PageContainer>
      <div
        style={{ marginBottom: 20 }}
        className={classnames('flex', 'flex-align-center', 'flex-pack-justify')}
      >
        <Button type="primary" onClick={handleOk}>
          发布文章
        </Button>
      </div>
      <Table
        loading={listDataLoading}
        dataSource={list || []}
        columns={columns}
        pagination={{
          total: listData && listData.total,
          current: listData && listData.page,
          pageSize: listData && listData.size,
          onChange: onTableChange
        }}
      />
    </PageContainer>
  );
};

export default connect(({ artManage, loading }: ConnectState) => ({
  list:
    artManage.list &&
    artManage.list.map((x: any) => {
      x.key = x.id;
      return x;
    }),
  queryParams: artManage.queryParams,
  listData: artManage.listData,
  artInfo: artManage.artInfo,
  listDataLoading: loading.effects['artManage/list'],
  artInfoLoading: loading.effects['artManage/getArticleByIdEffect']
}))(ArtManage);
