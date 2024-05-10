import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import { LockOutlined, GoogleOutlined, UserOutlined } from '@ant-design/icons';
import { LoginFormPage, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { message } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React from 'react';
import { flushSync } from 'react-dom';
import { createStyles } from 'antd-style';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { DataItem } from '../../../../types/index';
import { ShcenaForm } from './shcema';
import { useFormModal } from '@/hooks/useFormModal';
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const intl = useIntl();
  const [showModal, formRef] = useFormModal();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login({ ...values });
      if (msg.status === 'ok') {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <Lang />
      <div
        style={{
          backgroundColor: 'white',
          height: '100vh',
        }}
      >
        <LoginFormPage
          logo={<img alt="logo" src="/logo.svg" />}
          title="Bitbus admin"
          subTitle={'Bitbus 后台管理平台'}
          backgroundVideoUrl="/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr.mp4"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder={'请输入用户名'}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.username.required"
                    defaultMessage="请输入用户名!"
                  />
                ),
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder={'请输入密码'}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.password.required"
                    defaultMessage="请输入密码！"
                  />
                ),
              },
            ]}
          />
          <ProFormText
            name="code"
            fieldProps={{
              size: 'large',
              prefix: <GoogleOutlined />,
            }}
            placeholder={'请输入验证码'}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage id="pages.login.code.required" defaultMessage="请输入验证码!" />
                ),
              },
            ]}
          />
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <BetaSchemaForm<DataItem>
              trigger={
                <a
                  onClick={() => {
                    return false;
                  }}
                >
                  绑定GA
                </a>
              }
              layoutType={'ModalForm'}
              width={500}
              rowProps={{
                gutter: [16, 16],
              }}
              colProps={{
                span: 12,
              }}
              grid={false}
              onFinish={async (values) => {
                console.log(values);
              }}
              columns={ShcenaForm}
              onOpenChange={() => {
                console.log('xxxx');
              }}
            />
            <a
              onClick={async () => {
                await showModal({
                  modalProps: {
                    title: '22222',
                    onFinish: async (values) => {
                      console.log(values);
                    },
                  },
                  formProps: {
                    labelWidth: 100,
                    columns: ShcenaForm,
                  },
                });
                console.log(formRef);
              }}
            >
              绑定GA
            </a>
          </div>
        </LoginFormPage>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
