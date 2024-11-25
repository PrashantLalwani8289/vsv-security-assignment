import React, { useEffect, useRef, useState } from 'react';
import { Chart, ChartType, registerables } from 'chart.js';
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import Footer from "./footer";
import { FaUsers, FaTruckMoving } from "react-icons/fa"
import { FaCartShopping, FaSackDollar } from "react-icons/fa6";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management/store/store';
import { GetDashboardData } from '../../interfaces/commonInterfaces';
import { useNavigate } from 'react-router-dom';
import routes from '../../routes/routes';

// import Chart from 'chart.js/auto'
Chart.register(...registerables);
declare global {
    interface HTMLCanvasElement {
        chart?: Chart;
    }
}

const Dashboard: React.FC = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navigate=useNavigate();
    const TOKEN = useSelector((state: RootState) => state.root.token);
    const AuthStr = 'Bearer '.concat(TOKEN);
    const [DashBoardData, setDashBoardData] = useState<GetDashboardData>();
    const lineChartRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        GetDashBoardData()
    }, [])
    useEffect(() => {
        // Function to initialize a chart
        const initializeChart = (canvasRef: React.MutableRefObject<HTMLCanvasElement | null>, ChartType: ChartType, data: any) => {
            if (canvasRef.current) {
                // Ensure any existing chart on this canvas is destroyed first
                if (canvasRef.current && canvasRef.current.chart) {
                    canvasRef.current.chart.destroy();
                }

                // Initialize new chart
                canvasRef.current.chart = new Chart(canvasRef.current, {
                    type: ChartType,
                    data: data,
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                grid: {
                                    display: true
                                },
                                beginAtZero: false
                            },
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                            },
                        }
                    }
                });
            }
        };

        const lineChartData = {
            labels: DashBoardData?.getLineChartdata.labels,
            datasets: [
                {
                    label: 'Most Purchased Products',
                    data: DashBoardData?.getLineChartdata.datasets,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        };


        // Initialize charts on component mount 
        initializeChart(lineChartRef, 'line', lineChartData);

        // Clean up function to destroy charts on component unmount
        return () => {
            if (lineChartRef.current && lineChartRef.current.chart) {
                lineChartRef.current.chart.destroy();
            }
        };
    }, [DashBoardData]);
    //  dashboard data api
    const GetDashBoardData = async () => {
        const dashboardData = await axios.get('http://localhost:5000/dashboard/get-dashboard-data', { headers: { Authorization: AuthStr } })
        setDashBoardData(dashboardData.data)
    }
    return (
        <div className="wrapper">
            <Sidebar isAuthenticated={true} sidebarRef={sidebarRef} />
            <div className="main">
                <Navbar sidebarRef={sidebarRef} />
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3">
                            <strong>Analytics</strong> Dashboard
                        </h1>
                        <div className="row">
                            <div className="col-xl-6 col-xxl-5 d-flex">
                                <div className="w-100">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col mt-0">
                                                            <h5 className="card-title">Sales</h5>
                                                        </div>
                                                        <div className="col-auto">
                                                            <div className="stat text-primary">
                                                                <i className="align-middle" />{<span>{<FaTruckMoving />}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h1 className="mt-1 mb-3">2.382</h1>
                                                    <div className="mb-0">
                                                        <span className="text-danger">
                                                            <i className="mdi mdi-arrow-bottom-right" /> -3.65%
                                                        </span>
                                                        <span className="text-muted">Since last week</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col mt-0">
                                                            <h5 className="card-title">Users</h5>
                                                        </div>
                                                        <div className="col-auto">
                                                            <div className="stat text-primary">
                                                                <i className="align-middle" />{<span>{<FaUsers />}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h1 className="mt-1 mb-3">{DashBoardData?.getUserCardData.totalUser}</h1>
                                                    <div className="mb-0">
                                                        {
                                                            DashBoardData?.getUserCardData.Percentage === 'Increased' ?
                                                                <span className="text-success">
                                                                    <i className="mdi mdi-arrow-bottom-right" /> {DashBoardData?.getUserCardData.thisWeekUsersPercentage}%
                                                                </span>
                                                                :
                                                                <span className="text-danger">
                                                                    <i className="mdi mdi-arrow-bottom-right" /> {DashBoardData?.getUserCardData.thisWeekUsersPercentage}%
                                                                </span>
                                                        }
                                                        <span className="text-muted">Since last week</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col mt-0">
                                                            <h5 className="card-title">Earnings</h5>
                                                        </div>
                                                        <div className="col-auto">
                                                            <div className="stat text-primary">
                                                                <i className="align-middle" />{<span>{<FaSackDollar />}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h1 className="mt-1 mb-3">${DashBoardData?.getEarningcardData.totalEarnings}</h1>
                                                    <div className="mb-0">
                                                        {
                                                            DashBoardData?.getEarningcardData.Percentage === 'Increased' ?
                                                                <span className="text-success">
                                                                    <i className="mdi mdi-arrow-bottom-right" /> {DashBoardData?.getEarningcardData.thisWeekEarningPercentage.toFixed(2)}%
                                                                </span>
                                                                :
                                                                <span className="text-danger">
                                                                    <i className="mdi mdi-arrow-bottom-right" /> {DashBoardData?.getEarningcardData.thisWeekEarningPercentage.toFixed(2)}%
                                                                </span>
                                                        }
                                                        <span className="text-muted">Since last week</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col mt-0">
                                                            <h5 className="card-title">Orders</h5>
                                                        </div>
                                                        <div className="col-auto">
                                                            <div className="stat text-primary">
                                                                <i className="align-middle" />{<span>{<FaCartShopping />}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h1 className="mt-1 mb-3">{DashBoardData?.getOrdercardData.totalOrders}</h1>
                                                    <div className="mb-0">
                                                        {
                                                            DashBoardData?.getOrdercardData.Percentage === 'Increased' ?
                                                                <span className="text-success">
                                                                    <i className="mdi mdi-arrow-bottom-right" /> {DashBoardData?.getOrdercardData.thisWeekOrdersPercentage}%
                                                                </span>
                                                                :
                                                                <span className="text-danger">
                                                                    <i className="mdi mdi-arrow-bottom-right" /> {DashBoardData?.getOrdercardData.thisWeekOrdersPercentage}%
                                                                </span>
                                                        }
                                                        <span className="text-muted">Since last week</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-7">
                                <div className="card flex-fill w-100">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Recent Movement</h5>
                                    </div>
                                    <div className="card-body py-3">
                                        <div className="chart chart-sm">
                                            <canvas id="chartjs-dashboard-line" ref={lineChartRef} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="" style={{
                                maxWidth: "100%"
                            }}>
                                <div className="card flex-fill">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">New Users </h5>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover my-0">
                                            <thead>
                                                <tr>
                                                    <th className="d-none d-xl-table-cell">Id</th>
                                                    <th className="d-none d-xl-table-cell">Name</th>
                                                    <th className="d-none d-xl-table-cell">Email</th>
                                                    <th className="d-none d-xl-table-cell">Dob</th>
                                                    <th className="d-none d-xl-table-cell">Gender</th>
                                                    <th className="d-none d-xl-table-cell">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {DashBoardData?.getUserdata.map((customer, index) => {
                                                    return (
                                                        <tr key={customer._id}>
                                                            <td>{index + 1}</td>
                                                            <td>{customer.username}</td>
                                                            <td>{customer.email}</td>
                                                            <td>{customer.dob}</td>
                                                            <td>{customer.gender}</td>
                                                            <td>
                                                                {customer.status === "active" ? (
                                                                    <span className="badge bg-success">Active</span>
                                                                ) : (
                                                                    <span className="badge bg-danger">Inactive</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        <div style={{
                                            display:"flex",
                                            justifyContent: "center",
                                            margin: "20px"
                                        }}>
                                            <button style={{
                                                padding: "5px",
                                                marginLeft: "10px",
                                                borderRadius: "5px",
                                                border: "1px solid #000",
                                                color: "#000",
                                                backgroundColor: "green",
                                                cursor: "pointer",
                                            }} 
                                            onClickCapture={()=>{navigate(routes.CUSTOMERS_SHOW)}}
                                            >View More</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Dashboard;
