import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Card } from 'antd';
import { GET_USER_WITH_CARS } from "../queries/queries";

const { Meta } = Card;


const UserDetails = () => {
  const { id } = useParams();

  const { loading, error, data, refetch} = useQuery(GET_USER_WITH_CARS, {
    variables: {id: id}
  });
  refetch();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { person, cars } = data.personWithCars;

  return (
    <div>
      <h2>User Details</h2>
      <h3>{person.firstName + " " + person.lastName}</h3>
      <h3>Cars</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {cars.map(car => (
          <Card key={car.id} style={{ width: 300, margin: '0 16px 16px 0' }}>
            <Meta
              title={car.name}
              description={
                <>
                  <p>Year: {car.year}</p>
                  <p>Make: {car.make}</p>
                  <p>Model: {car.model}</p>
                  <p>Price: ${car.price}</p>
                </>
              }
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserDetails;
