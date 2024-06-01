import { Button, Form, Grid, Input, theme, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/services';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { successfullAlert } from '../notification';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '@/context';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export const Login = () => {
    const signIn = useSignIn();
    const { token } = useToken();
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const { updateAuthTokens } = useAuthentication();

    const mutationLogin = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) =>
            await login({ email, password }),
        onSuccess: data => {
            const { accessToken, type, email, userId, refreshToken } = data;
            signIn({
                auth: {
                    token: accessToken,
                    type,
                },
                userState: {
                    email,
                    userId,
                },
            });
            successfullAlert('Login successfully').then(() => {
                updateAuthTokens(accessToken, refreshToken, isAuthenticated);
                navigate('/');
            });
        },
    });

    const validationSchema = yup.object().shape({
        email: yup.string().email('Invalid email format').required('Please input your Email!'),
        password: yup.string().required('Please input your Password!'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: values => {
            mutationLogin.mutate(values);
        },
    });

    const styles = {
        container: {
            margin: '0 auto',
            padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
            width: '380px',
        },
        footer: {
            marginTop: token.marginLG,
            textAlign: 'center',
            width: '100%',
        },
        forgotPassword: {
            float: 'right',
        },
        header: {
            marginBottom: token.marginXL,
        },
        section: {
            alignItems: 'center',
            backgroundColor: token.colorBgContainer,
            display: 'flex',
            height: screens.sm ? '100vh' : 'auto',
            padding: screens.md ? `${token.sizeXXL}px 0px` : '0px',
        },
        text: {
            color: token.colorTextSecondary,
        },
        title: {
            fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
        },
    };

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF" />
                        <path d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z" fill="white" />
                        <path d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z" fill="white" />
                        <path d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z" fill="white" />
                    </svg>

                    <Title style={styles.title}>Sign in</Title>
                    <Text style={styles.text}>
                        Welcome back to AntBlocks UI! Please enter your details below to sign in.
                    </Text>
                </div>
                <Form name="normal_login" layout="vertical" requiredMark="optional" onFinish={formik.handleSubmit}>
                    <Form.Item
                        validateStatus={formik.errors.email && formik.touched.email ? 'error' : ''}
                        help={formik.errors.email && formik.touched.email ? formik.errors.email : null}>
                        <Input
                            name="email"
                            prefix={<MailOutlined />}
                            placeholder="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </Form.Item>
                    <Form.Item
                        validateStatus={formik.errors.password && formik.touched.password ? 'error' : ''}
                        help={formik.errors.password && formik.touched.password ? formik.errors.password : null}>
                        <Input.Password
                            name="password"
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '0px' }}>
                        <Button type="primary" htmlType="submit" disabled={!(formik.isValid && formik.dirty)}>
                            Log in
                        </Button>
                        <div>
                            <Text style={styles.text}>Don't have an account?</Text> <Link href="">Sign up now</Link>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </section>
    );
};
