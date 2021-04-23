import { Button, Table, message, Upload } from 'antd';
import { UploadOutlined, LoadingOutlined, PlayCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import classnames from 'classnames';
import moment from 'moment';
import { addAudio, deleteAudio } from '@/services/musicManage';
import { qiniuUpload } from '@/utils/qiniuUpload';

interface Iprops {
  dispatch: Dispatch;
  list: any;
  listData: any;
  artInfo: any;
  listDataLoading?: boolean;
  artInfoLoading?: boolean;
  queryParams: any;
}

const MusicManage: React.FC<Iprops> = props => {
  const { dispatch, list, listData, listDataLoading, queryParams } = props;

  const columns: any = [
    {
      title: '歌曲',
      dataIndex: 'songname',
      render: (val: any, record: any) => (
        <a onClick={() => handleClick(record)}>
          <PlayCircleOutlined />
          <span style={{ marginLeft: 10 }}>{val}</span>
        </a>
      )
    },
    {
      title: '歌手',
      dataIndex: 'singername'
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
          <a onClick={() => handleDeleteAudio(record)}>删除</a>
        </>
      )
    }
  ];

  const [audioUrl, setAudioUrl] = useState('');

  const audioRef = useRef<any>(null);

  const handleClick = (record: any) => {
    setAudioUrl(record.url);
  };

  useEffect(() => {
    if (audioRef && audioRef.current && audioUrl) {
      audioRef.current.play();
    }
  }, [audioUrl]);

  const handleDeleteAudio = (record: any) => {
    deleteAudio(record.id)
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
      type: 'musicManage/getAudioListEffect',
      payload: {
        page: queryParams.page,
        size: queryParams.pageSize
      }
    });
  }, [queryParams.page, queryParams.pageSize]);

  useEffect(() => {
    refreshTable();
  }, [refreshTable]);

  const onTableChange = (page: any, pageSize: any) => {
    dispatch({
      type: 'musicManage/queryParamsReducer',
      payload: {
        ...queryParams,
        page: page,
        pageSize
      }
    });
  };

  const beforeUpload = (file: any) => {
    const isAudio = file.type.indexOf('audio/') > -1;
    if (!isAudio) {
      message.error('You can only upload audio file!');
    }
    return isAudio;
  };

  function trim(str: any) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }

  const [loading, setLoading] = useState(false);

  const handleAddAudio = (fileName: any, url: any) => {
    if (!fileName) {
      message.warning('fileName参数为空，请先选择文件');
      setLoading(false);
      return;
    }
    if (!url) {
      message.warning('url参数为空，请先上传文件');
      setLoading(false);
      return;
    }
    let _fileName = trim(fileName.split(/.mp3|.mp4|.flac|.ncm|.m4a/)[0]);
    let singername = '未知',
      songname = '未知';
    try {
      singername = _fileName.split('-')[1];
      songname = _fileName.split('-')[0];
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
    addAudio({ singername, songname, url })
      .then(res => {
        if (res.isSuc) {
          message.success('操作成功');
          setLoading(false);
          refreshTable();
        } else {
          setLoading(false);
          message.error(res.message);
        }
      })
      .catch(e => {
        setLoading(false);
      });
  };

  const customRequest = (file: any) => {
    setLoading(true);
    console.log(file);
    qiniuUpload(file)
      .then(res => {
        console.log(UMI_VIDEO_ADDR + res.key);
        handleAddAudio(file.file.name, UMI_VIDEO_ADDR + res.key);
      })
      .catch(e => {
        setLoading(false);
      });
  };

  return (
    <PageContainer>
      {audioUrl && <audio src={audioUrl} ref={audioRef} />}
      <div
        style={{ marginBottom: 20 }}
        className={classnames('flex', 'flex-align-center', 'flex-pack-justify')}
      >
        <Upload
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={customRequest}
        >
          <Button icon={loading ? <LoadingOutlined /> : <UploadOutlined />}>添加神曲</Button>
        </Upload>
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

export default connect(({ musicManage, loading }: ConnectState) => ({
  list:
    musicManage.list &&
    musicManage.list.map((x: any) => {
      x.key = x.id;
      return x;
    }),
  queryParams: musicManage.queryParams,
  listData: musicManage.listData,
  listDataLoading: loading.effects['musicManage/getAudioListEffect']
}))(MusicManage);
