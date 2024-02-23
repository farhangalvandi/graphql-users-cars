import React, { useState } from "react";
import { useQuery, useApolloClient,useMutation } from "@apollo/client";
import { List, Skeleton, Button, message, Modal, Form, Input } from "antd";
import {
  ADD_USER,
  GET_USERS_WITH_CARS,
  UPDATE_USER,
  REMOVE_USER,
} from "../queries/queries";
import { v4 as uuidv4 } from "uuid";
const UserList = () => {
  const { loading, error, data } = useQuery(GET_USERS_WITH_CARS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [form] = Form.useForm();
  const client = useApolloClient();

  const [addPerson] = useMutation(ADD_USER);

  // Keep loading and error handling first
  if (loading) return <Skeleton active />;
  if (error) return <p>Error: {error.message}</p>;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddUser = () => {
    form.validateFields()
      .then((values) => {
        const { firstname, lastname } = values;

        return addPerson({
          variables: {
            id: uuidv4(),
            firstName: firstname,
            lastName: lastname,
          },
          update: (cache, { data: { addPerson } }) => {
            const data = cache.readQuery({ query: GET_USERS_WITH_CARS });

            cache.writeQuery({
              query: GET_USERS_WITH_CARS,
              data: {
                peopleWithCars: [
                  ...data.peopleWithCars,
                  {
                    person: addPerson,
                    cars: [],
                  },
                ],
              },
            });
          },
        });
      })
      .then(() => {
        message.success("User added successfully");
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleEdit = (userId) => {
    setSelectedUserId(userId);
    setIsModalVisible(true);
    const user = data.peopleWithCars.find((user) => user.person.id === userId);
    if (user) {
      form.setFieldsValue({
        firstname: user.person.firstName,
        lastname: user.person.lastName,
      });
    }
  };

  const handleEditSubmit = () => {
    form.validateFields().then((values) => {
      client
        .mutate({
          mutation: UPDATE_USER,
          variables: {
            id: selectedUserId,
            firstName: values.firstname,
            lastName: values.lastname,
          },
          refetchQueries: [{ query: GET_USERS_WITH_CARS }],
        })
        .then(() => {
          message.success("User updated successfully");
          setIsModalVisible(false);
          form.resetFields();
        })
        .catch((error) => {
          message.error(error.message);
        });
    });
  };

  const handleDelete = (userId) => {
    client
      .mutate({
        mutation: REMOVE_USER,
        variables: { id: userId },
        refetchQueries: [{ query: GET_USERS_WITH_CARS }],
      })
      .then(() => {
        message.success("User deleted successfully");
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  return (
    <div>
      <h2>User List</h2>
      <Button type="primary" onClick={showModal}>
        + Add New User
      </Button>
      <List
        itemLayout="horizontal"
        dataSource={data.peopleWithCars}
        renderItem={(user) => (
          <List.Item
            actions={[
              <a href={`/user/${user.person.id}`}>Learn More</a>,
              <Button type="primary" onClick={() => handleEdit(user.person.id)}>
                Edit
              </Button>,
              <Button
                type="primary"
                danger
                onClick={() => handleDelete(user.person.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <div>
                  <a href={`/user/${user.person.id}`}>
                    {user.person.firstName} {user.person.lastName}
                  </a>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <Modal
        title={selectedUserId ? "Edit User" : "Add New User"}
        open={isModalVisible}
        onOk={selectedUserId ? handleEditSubmit : handleAddUser}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="add_user_form">
          <Form.Item
            name="firstname"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
