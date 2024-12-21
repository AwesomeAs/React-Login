import React, { useEffect, useState } from "react";
import { Button, Col, List, Modal, Row, Space, Tag } from "antd";
import { ApiHandler } from "../../api/ApiHandler";
import { endpoint } from "../../config/endpoint";
import { UserActiveRequest, UserActiveResponse } from "../../api/ApiTypes";

interface UserListItemType {
    id: number;
    username: string;
    email: string;
    active: boolean;
    roles: string[];
}

export const AdminPage: React.FC = () => {
    const [initUsersLoading, setInitUsersLoading] = useState(true);
    const [userList, setUserList] = useState<UserListItemType[]>([]);
    useEffect(() => {
        ApiHandler.callGet<UserListItemType[]>(endpoint.admin.users)
            .then((data) => {
                setInitUsersLoading(false);
                setUserList(data);
            });
    }, []);

    const setUserActive = async (item: UserListItemType) => {
        const newActive = !item.active;
        const response = await ApiHandler.callPost<UserActiveRequest, UserActiveResponse>(endpoint.admin.user_active, { user_id: item.id, active: newActive });
        if (response.updated) {
            const newList = userList.map(user => {
                if (user.id === item.id) {
                    user.active = newActive;
                }
                return user;
            });
            setUserList(newList);
        }
    }

    return (
        <div>
            <h1>Admin page</h1>
            <p>Manage users here.</p>
            <Modal />
            <List
                className="users-list"
                bordered
                header={<Row gutter={[8, 8]}><Col span={8}>Username</Col><Col span={0} xs={{ span: 8 }}>Roles</Col><Col span={8}>Actions</Col></Row>}
                loading={initUsersLoading}
                itemLayout="horizontal"
                dataSource={userList}
                renderItem={(item) => (
                    <List.Item style={{ display: 'block' }}>
                        <Row gutter={[8, 8]} justify={'space-between'}>
                            <Col span={8}>{item.username}</Col>
                            <Col span={0} xs={{ span: 8 }}>{((item.roles && item.roles.length > 0) ? item.roles.map(e => <Tag color="default">{e}</Tag>) : 'none')}</Col>
                            <Col span={8}>
                                <Space wrap>
                                    <Button key="list-item-active" disabled={(item.roles && item.roles.indexOf('admin') !== -1)} onClick={() => setUserActive(item)}>{item.active ? 'disable' : 'enable'}</Button>
                                </Space>
                            </Col>
                        </Row>
                    </List.Item>
                )}
            />
        </div>
    )
}