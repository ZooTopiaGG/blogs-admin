import { Button, Table, message } from 'antd';
import React, { useEffect, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, Dispatch, useHistory } from 'umi';
import { ConnectState } from '@/models/connect';
import classnames from 'classnames';
import moment from 'moment';
import { delDynamic } from '@/services/dyManage'

interface Iprops {
  dispatch: Dispatch;
  list: any;
  listData: any;
  artInfo: any;
  listDataLoading?: boolean;
  artInfoLoading?: boolean;
  queryParams: any;
}

const DyManage: React.FC<Iprops> = props => {
  const { dispatch, list, listData, listDataLoading, queryParams } = props;

  const history = useHistory();

  const columns: any = [
    {
      title: '标题',
      dataIndex: 'content'
    },
    {
      title: '评论量',
      dataIndex: 'commentsNum',
      width: 150,
      render: (_: any, record:any) => <>{record.commentsList.length}</>
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
          <a onClick={() => handleDeleteArticle(record)}>删除</a>
        </>
      )
    }
  ];

  const handleDeleteArticle = (record: any) => {
    delDynamic({id: record.id}).then(res => { 
      if (res.isSuc) {
        message.success('操作成功');
        refreshTable();
      } else {
        message.error(res.message)
      }
    }).catch(e => console.log(e))
  }

  const refreshTable = useCallback(() => {
    dispatch({
      type: 'dyManage/getDynamicListEffect',
      payload: {
        page: queryParams.page,
        size: queryParams.pageSize
      }
    });
  }, [queryParams.page, queryParams.pageSize]);

  useEffect(() => {
    refreshTable();
  }, [refreshTable]);

  const handleOk = useCallback(() => {
    history.push('/dyManage/add');
  }, []);

  const onTableChange = (page: any, pageSize: any) => {
    dispatch({
      type: 'dyManage/queryParamsReducer',
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
          发布动态
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

export default connect(({ dyManage, loading }: ConnectState) => ({
  list:
    dyManage.list &&
    dyManage.list.map((x: any) => {
      x.key = x.id;
      return x;
    }),
  queryParams: dyManage.queryParams,
  listData: dyManage.listData,
  listDataLoading: loading.effects['dyManage/getDynamicListEffect']
}))(DyManage);
