import { Descriptions, Drawer, Tag } from "antd";
import { useEffect, useState } from "react";

interface Admin {
    _id: string;
    email: string;
}

interface IGetUser {
    _id: string;
    name: string;
    email: string;
    age: number;
    gender: string;
    address: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    createdBy: Admin;
    updatedBy: Admin;
    password: string;
    id: string;
}

interface IProps {
    isOpenDetailModal: boolean;
    setIsOpenDetailModal: (v: boolean) => void;
    dataDetailModal: IGetUser | null;
    setDataDetailModal: (v: IGetUser | null) => void;
}

const UserDetail = (props: IProps) => {
    const { isOpenDetailModal, setIsOpenDetailModal, dataDetailModal, setDataDetailModal } = props;



    return (
        <>
            <Drawer
                title="User detail"
                open={isOpenDetailModal}
                onClose={() => {
                    setIsOpenDetailModal(false);
                    setDataDetailModal(null);
                }}
                width={"60%"}
            >
                <Descriptions title="Thông Tin Người Dùng" bordered column={2}>
                    <Descriptions.Item label="ID">{dataDetailModal?._id || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Tên">{dataDetailModal?.name || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataDetailModal?.email || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Tuổi">{dataDetailModal?.age || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Giới tính">{dataDetailModal?.gender || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{dataDetailModal?.address || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Vai trò">
                        <Tag>{dataDetailModal?.role}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tạo lúc">
                        {dataDetailModal?.createdAt
                            ? new Date(dataDetailModal.createdAt).toLocaleString("vi-VN")
                            : "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người tạo">
                        {dataDetailModal?.createdBy?.email || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Cập nhật lúc">
                        {dataDetailModal?.updatedAt
                            ? new Date(dataDetailModal.updatedAt).toLocaleString("vi-VN")
                            : "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người cập nhật">
                        {dataDetailModal?.updatedBy?.email || "N/A"}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};

export default UserDetail;