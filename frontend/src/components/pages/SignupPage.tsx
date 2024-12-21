import React, { useState } from "react";
import { Button, Card, Form, Input, message } from 'antd';
import { LoadingOutlined, LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { routes } from "../../routes/routes";
import { endpoint } from "../../config/endpoint";
import { ApiHandler } from "../../api/ApiHandler";
import { CommonResponse, SignupRequest } from "../../api/ApiTypes";
import { Navigate } from "react-router-dom";

export const SignupPage: React.FC = () => {
    const [state, setState] = useState('new');
    if (state !== 'done' && localStorage.getItem('signup')) {
        setState('done');
        return (<></>);
    }

    if (state === 'done' || state === 'fail') {
        if (state === 'done') {
            message.success('Your user has been created. Let a site admin know to have it enabled.');
            return <Navigate to={routes.login.link} />
        } else {
            message.error('Signup failed, please try again later.');
        }
    }
    if (state === 'load') {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Card style={{ width: 500 }}>
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                        <Title level={2}>Signup</Title>
                        <LoadingOutlined spin />
                    </div>
                </Card>
            </div>
        )
    }

    const onFinish = async (values: any) => {
        setState('load');
        try {
            await ApiHandler.callPost<SignupRequest, CommonResponse>(endpoint.auth.signup, { username: values.username, password: values.password, email: values.email });
            localStorage.setItem('signup', '1');
            setTimeout(() => setState('done'), 100);
        } catch (err) {
            setState('fail');
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Card style={{ width: 500 }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Title level={2}>Signup</Title>
                </div>
                <Form
                    name="normal_signup"
                    className="signup-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: "Username required." },
                            { min: 2, message: "Username too short. Minimum 2 characters." },
                            { max: 20, message: "Username too long. Maximum 20 characters." },
                            { pattern: /^[a-zA-Z][a-zA-Z_]+$/g, message: "Username must start with letter and contain letters or underscores." }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Username"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: "Password required." },
                            { min: 5, message: "Password too short. Minimum 5 characters." },
                            { max: 200, message: "Password too long. Maximum 200 characters." },
                            { pattern: /[a-z]/g, message: 'Password must contain lowercase character.' },
                            { pattern: /[A-Z]/g, message: 'Password must contain uppercase character.' },
                            { pattern: /[0-9]/g, message: 'Password must contain digit.' }
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Password confirmation required.',
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('Password does not match.'));
                                }
                            })
                        ]}>
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Confirm password"
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Email required." },
                            { pattern: /^[a-zA-Z0-9\.\-\_]+@[a-zA-Z0-9\.\-\_]+\.[a-z]{2,10}/g, message: 'Email is malformed.' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined className="site-form-item-icon" />}
                            type="email"
                            placeholder="Email"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="signup-form-button"
                            block
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}