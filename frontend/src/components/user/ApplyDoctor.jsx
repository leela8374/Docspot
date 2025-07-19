import { Col, Form, Input, Row, TimePicker, message } from 'antd';
import { Container } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';

function ApplyDoctor({ userId }) {
   const [doctor, setDoctor] = useState({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      specialization: '',
      experience: '',
      fees: '',
      timings: [],
   });

   const handleTimingChange = (value) => {
      // value is an array of moment objects
      if (value && value.length === 2) {
         setDoctor({ ...doctor, timings: [value[0].format("HH:mm"), value[1].format("HH:mm")] });
      } else {
         setDoctor({ ...doctor, timings: [] });
      }
   };

   const handleChange = (e) => {
      setDoctor({ ...doctor, [e.target.name]: e.target.value });
   };

   const handleSubmit = async () => {
      try {
         const res = await axios.post('http://localhost:8001/api/user/registerdoc', { doctor, userId: userId }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         });
         if (res.data.success) {
            message.success(res.data.message);
         } else {
            message.error(res.data.message);
         }
      } catch (error) {
         console.log(error);
         message.error('Something went wrong');
      }
   };

   return (
      <Container>
         <h2 className='text-center p-3'>Apply for Doctor</h2>
         <Form onFinish={handleSubmit} className='m-3'>
            <h4>Personal Details:</h4>
            <Row gutter={20}>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Full Name is required' }]}>
                     <Input name='fullName' value={doctor.fullName} onChange={handleChange} placeholder='Enter name' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Phone is required' }]}>
                     <Input value={doctor.phone} onChange={handleChange} name='phone' type='number' placeholder='Your phone' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email is required' }]}>
                     <Input value={doctor.email} onChange={handleChange} name='email' type='email' placeholder='Your email' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Address is required' }]}>
                     <Input value={doctor.address} onChange={handleChange} name='address' type='text' placeholder='Your address' />
                  </Form.Item>
               </Col>
            </Row>
            <h4>Professional Details:</h4>
            <Row gutter={20}>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Specialization" name="specialization" rules={[{ required: true, message: 'Specialization is required' }]}>
                     <Input value={doctor.specialization} onChange={handleChange} type='text' name='specialization' placeholder='Your specialization' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Experience" name="experience" rules={[{ required: true, message: 'Experience is required' }]}>
                     <Input value={doctor.experience} onChange={handleChange} type='number' name='experience' placeholder='Your experience' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Fees" name="fees" rules={[{ required: true, message: 'Fees is required' }]}>
                     <Input value={doctor.fees} onChange={handleChange} name='fees' type='number' placeholder='Your fees' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Timings" name="timings" rules={[{ required: true, message: 'Timings are required' }]}>
                     <TimePicker.RangePicker format="HH:mm" onChange={handleTimingChange} />
                  </Form.Item>
               </Col>
            </Row>
            <div className="d-flex justify-content-end">
               <button className="btn btn-primary" type="submit">Submit</button>
            </div>
         </Form>
      </Container>
   );
}

export default ApplyDoctor;
