import React from "react";
import { Card, Form, Input } from 'antd';
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { UserInfo } from "../../api/ApiTypes";

export const ProfilePage: React.FC = () => {
    const userInfo: UserInfo | null = JSON.parse(localStorage.getItem('user') || '');
    if (userInfo === null) {
        return <></>
    }

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
                    <Title level={2}>Profile</Title>
                </div>
                <Form
                    name="normal_profile"
                    className="profile-form"
                    disabled={true}
                >
                    <Form.Item
                        name="username"
                        label="Username"
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Username"
                            defaultValue={userInfo.username}
                            value={userInfo.username}
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                    >
                        <Input
                            prefix={<MailOutlined className="site-form-item-icon" />}
                            placeholder="Email"
                            defaultValue={userInfo.email}
                            value={userInfo.email}
                        />
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}