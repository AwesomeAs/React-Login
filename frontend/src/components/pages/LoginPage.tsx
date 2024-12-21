import React, { useState } from "react";
import { Button, Card, Form, Input, message } from 'antd';
import { LoadingOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { routes } from "../../routes/routes";
import { ApiHandler } from "../../api/ApiHandler";
import { endpoint } from "../../config/endpoint";
import { LoginRequest, LoginResponse } from "../../api/ApiTypes";
import { Navigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
    const [state, setState] = useState('new');
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
                        <Title level={2}>Login</Title>
                        <LoadingOutlined spin />
                    </div>
                </Card>
            </div>
        )
    }
    if (state == 'done') {
        return <Navigate to={routes.home.link} />
    }
    
    const onFinish = (values: any) => {
        setState('load');
        ApiHandler.callPost<LoginRequest, LoginResponse>(endpoint.auth.login, { username: values.username, password: values.password })
        .then(response => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setState('done');
        }).catch((reason: Error) => {
            let errorMessage = 'An error occurred';
            try {
                const payload = JSON.parse(reason.message);
                errorMessage = payload.error || errorMessage;
            } catch (err) {}
            setState('new');
            message.error(errorMessage);
        });
    };

    const canSignUp = localStorage.getItem('signup') === null;

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
                    <Title level={2}>Login</Title>
                </div>
                <Form
                    name="normal_login"
                    className="login-form"
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
                            { max: 200, message: "Password too long. Maximum 200 characters." }
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            block
                        >
                            Log in
                        </Button>
                        {canSignUp ? "Don't have an account - " : ""}
                        <a href={routes.signup.link} style={{ display: canSignUp ? 'contents' : 'none' }}>
                            sign up
                        </a>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}