import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import {
  List,
  Skeleton,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import {
  GET_CARS,
  GET_USERS,
  CREATE_CAR,
  UPDATE_CAR,
  DELETE_CAR,
} from "../queries/queries";

const { Option } = Select;

const CarList = () => {
  const {
    loading: usersLoading,
    error: usersError,
    data: userData,
  } = useQuery(GET_USERS);
  const {
    loading: carsLoading,
    error: carsError,
    data: carsData,
  } = useQuery(GET_CARS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedCar, setSelectedCar] = useState(null);
  const [createCar] = useMutation(CREATE_CAR, {
    refetchQueries: [{ query: GET_CARS }],
  });

  const [updateCar] = useMutation(UPDATE_CAR, {
    refetchQueries: [{ query: GET_CARS }],
  });

  const [deleteCar] = useMutation(DELETE_CAR, {
    refetchQueries: [{ query: GET_CARS }],
  });

  const client = useApolloClient();

  const loading = carsLoading || usersLoading;
  const error = carsError || usersError;

  if (loading) return <Skeleton active />;
  if (error) return <p>Error: {error.message}</p>;

  const handleAdd = () => {
    setSelectedCar(null);
    setIsModalVisible(true);
  };

  const handleEdit = (car) => {
    setSelectedCar(car);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: car.name,
      year: car.year,
      make: car.make,
      model: car.model,
      price: car.price,
      userId: car.user ? car.user.id : undefined,
    });
  };

  const handleDelete = (carId) => {
    deleteCar({ variables: { id: carId } })
      .then(() => {
        client.query({ query: GET_CARS });
        message.success("Car deleted successfully");
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const { name, year, make, model, price, userId } = values;
      if (selectedCar) {
        
        updateCar({
          variables: {
            id: uuidv4(),
            personId: userId.toString(),
            make,
            model,
            price: price.toString(),
            year: year.toString(),
          },
        })
          .then(() => {
            client.query({ query: GET_CARS });
            message.success("Car updated successfully");
          })
          .catch((error) => {
            message.error(error.message);
          });
      } else {
        // Add new car
        createCar({  variables: {
          id: uuidv4(),
          personId: userId.toString(),
          make,
          model,
          price: price.toString(),
          year: year.toString(),
        }, })
          .then(() => {
            client.query({ query: GET_CARS });
            message.success("Car added successfully");
          })
          .catch((error) => {
            message.error(error.message);
          });
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <h2>Car List</h2>
      <Button type="primary" onClick={handleAdd}>
        + Add New Car
      </Button>
      <List
        itemLayout="horizontal"
        dataSource={carsData.cars}
        renderItem={(car) => (
          <List.Item
            key={car.id}
            actions={[
              <Button type="primary" onClick={() => handleEdit(car)}>
                Edit
              </Button>,
              <Button
                type="primary"
                danger
                onClick={() => handleDelete(car.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={<a href={`/car/${car.id}`}>{car.name}</a>}
              description={`${car.year} ${car.make} ${car.model} ($${car.price})`}
            />
          </List.Item>
        )}
      />

      <Modal
        title={selectedCar ? "Edit Car" : "Add New Car"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="car_form">
          <Form.Item
            name="name"
            label="Name"
            initialValue={selectedCar ? selectedCar.name : ""}
            rules={[{ required: true, message: "Please enter car name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="year"
            label="Year"
            initialValue={selectedCar ? selectedCar.year : ""}
            rules={[{ required: true, message: "Please enter car year" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="make"
            label="Make"
            initialValue={selectedCar ? selectedCar.make : ""}
            rules={[{ required: true, message: "Please enter car make" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="model"
            label="Model"
            initialValue={selectedCar ? selectedCar.model : ""}
            rules={[{ required: true, message: "Please enter car model" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            initialValue={selectedCar ? selectedCar.price : ""}
            rules={[{ required: true, message: "Please enter car price" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="userId"
            label="Person"
            initialValue={selectedCar ? selectedCar.personId : undefined}
            rules={[{ required: true, message: "Please select a person" }]}
          >
            <Select>
              {userData.people.map((user) => (
                <Option
                  key={user.id}
                  value={user.id}
                >{`${user.firstName} ${user.lastName}`}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CarList;
