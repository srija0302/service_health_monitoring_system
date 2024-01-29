import React, { useEffect, useState } from 'react';
import { Button, Card, Container, ListGroup, Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import formattedDate from './dateUtil';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showButton, setShowButton] = useState(true);
    const [buttonClicked, setButtonClicked] = useState(false);
    const token = localStorage.getItem('token');
    let navigate = useNavigate();

    const getServicesDetails = () => {
        fetch('http://localhost:3001/get-services', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .then(data => {
                setServices(data);
            })
            .catch(error => {
                console.error('Error fetching services:', error);
            });
    }
    useEffect(() => {
        getServicesDetails();
    }, []);

    const updateStatus = async (status, id) => {
        setButtonClicked(true);
        status = (status === 'up') ? 'down' : 'up'
        const payload = {
            status,
            id
        }
        await fetch(`http://localhost:3001/update-service`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        if (selectedDate) {
            searchServices();
        } else {
            getServicesDetails();
        }
    }
    const getStatusColor = status => {
        switch (status) {
            case 'up':
                return 'text-success';
            case 'down':
                return 'text-danger';
            default:
                return 'text-black';
        }
    };
    const handleServiceClick = (service) => {
        if (buttonClicked) {
            setButtonClicked(false);
            return;
        }
        setSelectedService(service);
    };

    const searchServices = () => {
        if (!selectedDate) {
            alert('Select date');
        } else {
            setShowButton(false);
            setSelectedService(null);
            const reactDatePickerDate = selectedDate
            const datePickerDateObject = new Date(reactDatePickerDate);
            datePickerDateObject.setHours(datePickerDateObject.getHours() + 5);
            datePickerDateObject.setMinutes(datePickerDateObject.getMinutes() + 30);
            const formattedDate = datePickerDateObject.toISOString().slice(0, 19).replace("T", " ");

            fetch(`http://localhost:3001/search-service?searchDate=${formattedDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(response => response.json())
                .then(data => {
                    setServices(data);
                })
                .catch(error => {
                    console.error('Error fetching services:', error);
                });
        }
    }

    const sendNotification = (service) =>{
        setButtonClicked(true);
        const downDate = formattedDate(service.timestamp);
        fetch(`http://localhost:3001/email-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: service.name,
                    downDate
                })
            }).then(res => res.json())
            .then(data => {
              alert('Email sent!')
            }).catch(error => {
                    console.error('Error fetching services:', error);
                });
    }
    useEffect(() => {
        async function getSelectedService() {
            if (selectedService) {

                let serviceData = []
                await fetch(`http://localhost:3001/get-service-by-id?id=${selectedService.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        serviceData = data
                    })
                    .catch(error => {
                        console.error('Error fetching services:', error);
                    });
                const upStatusCount = serviceData.filter(data => data.status === 'up').length;
                const downStatusCount = serviceData.length - upStatusCount;

                const chartData = {
                    labels: ['Up', 'Down'],
                    datasets: [
                        {
                            data: [upStatusCount, downStatusCount],
                            backgroundColor: ['#36A2EB', '#FF6384'],
                            hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                        },
                    ],
                };

                setChartData(chartData);
            }
        }
        getSelectedService();
    }, [selectedService]);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        localStorage.getItem('token')?(
        <Container>
            <Row>
                <Col xs={12} md={8} style={{ maxWidth: '800px' }}>
                    <div style={{ display: 'flex', justifyContent:'space-between' }}>
                        <h1 className="mt-3">Service Dashboard</h1>
                        <Button onClick={logout} variant="link">Logout</Button>
                    </div>
                    <p>Choose a specific date to identify the services that have experienced downtime in the past 30 days from that selected date.</p>
                    <DatePicker
                        selected={selectedDate}
                        onChange={date => { setSelectedDate(date)}}
                        maxDate={new Date()}
                    />
                    <div>
                        <Button
                            onClick={() => {
                                setSelectedDate(null);
                                getServicesDetails();
                                setShowButton(true);
                                setSelectedService(null);
                            }}
                            style={{ marginTop: '1rem' }}
                        >Clear</Button>
                        <Button
                            onClick={() => searchServices()}
                            style={{ marginTop: '1rem', marginLeft:'1rem' }}
                        >Search</Button>
                    </div>
                    <div style={{ marginTop: '5rem' }}>
                        {services.length > 0 && services.map(service => (
                            <ListGroup as="ol">
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                    style={{ maxWidth: '100%', cursor: 'pointer' }}
                                    onClick={() => handleServiceClick(service)}
                                >
                                    <div className={`ms-2 me-auto ${getStatusColor(service.status)}`}>
                                        <div className="fw-bold text-black" >{service.name}</div>
                                        {service.status}
                                    </div>
                                    {showButton && (<Button variant={service.status === 'up' ? 'danger' : 'success'}
                                        style={{ marginLeft: '1rem' }}
                                        onClick={() => updateStatus(service.status, service.id)}
                                    >
                                        {service.status === 'up' ? 'STOP' : 'START'}
                                    </Button>)}
                                    {!showButton && (<Button variant="link"
                                        style={{ marginLeft: '1rem' }}
                                        onClick={() => sendNotification(service)}
                                    >
                                        Send mail
                                    </Button>)}
                                </ListGroup.Item>
                            </ListGroup>
                        ))}
                        {services.length === 0 && <p> No services found</p>}
                    </div>
                </Col>
                <Col xs={12} md={4} style={{ marginTop: '10rem' }}>
                    {selectedService && !buttonClicked && (
                        <Card className="mt-3">
                            <Card.Body>
                                <Card.Title>{selectedService.name}</Card.Title>
                                {chartData && (
                                    <div>
                                        <h5>Service Status Distribution</h5>
                                        <Doughnut data={chartData} />
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
        ):<p>Go back to login page!</p>
    );
}

export default Dashboard;
