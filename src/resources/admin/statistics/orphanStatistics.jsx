import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [data, setData] = useState({
        motherStatusData: [],
        deathCauseData: [],
        addressData: [],
        ageGroupData: [],
        motherDeceasedData: [],
        genderData: [],
        totalOrphans: 0,
        totalVisitors: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const chartRef = useRef(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true); // Start loading
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const response = await axios.get('https://forms-api.saiid.org/api/orphans/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const {
                    motherStatusCounts,
                    deathCauseCounts,
                    originalAddressCounts,
                    ageGroups,
                    motherDeceasedCounts,
                    genderCounts,
                    totalOrphans,
                    totalVisitors
                } = response.data;

                setData({
                    motherStatusData: Object.entries(motherStatusCounts || {}),
                    deathCauseData: Object.entries(deathCauseCounts || {}),
                    addressData: Object.entries(originalAddressCounts || {}),
                    ageGroupData: Object.entries(ageGroups || {}),
                    motherDeceasedData: Object.entries(motherDeceasedCounts || {}),
                    genderData: Object.entries(genderCounts || {}),
                    totalOrphans: totalOrphans || 0,
                    totalVisitors: totalVisitors || 0,
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false); // End loading
            }
        };

        fetchDashboardData();
    }, []);

    const createGradient = (context, color1, color2) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) {
            return color1;
        }
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    };

    const genderColors = {
        'أنثى': ['#FF6384', '#FFA1B4'],
        'ذكر': ['#36A2EB', '#7DC4FF']
    };

    const generateChartData = (label, data, colorFunction) => ({
        labels: data.map(([key]) => key.toString()),  // Ensure the key is a string
        datasets: [{
            label,
            data: data.map(([, count]) => Number(count) || 0),  // Ensure count is a number
            backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, data, chartArea } = chart;
                if (!chartArea) {
                    return null;
                }
                if (typeof colorFunction === 'object') {
                    return data.labels.map(label => createGradient(context, colorFunction[label][0], colorFunction[label][1]));
                }
                return data.datasets[0].data.map((_, i) =>
                    createGradient(context, colorFunction(i)[0], colorFunction(i)[1])
                );
            },
            borderColor: '#fff',
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
        }],
    });

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                suggestedMax: 250
            }
        }
    };

    const motherStatusColors = (i) => [`hsl(${210 + i * 30}, 70%, 60%)`, `hsl(${210 + i * 30}, 70%, 40%)`];
    const deathCauseColors = (i) => [`hsl(${0 + i * 45}, 70%, 60%)`, `hsl(${0 + i * 45}, 70%, 40%)`];
    const addressColors = (i) => [`hsl(${120 + i * 20}, 70%, 60%)`, `hsl(${120 + i * 20}, 70%, 40%)`];
    const ageGroupColors = (i) => [`hsl(${30 + i * 60}, 70%, 60%)`, `hsl(${30 + i * 60}, 70%, 40%)`];
    const motherDeceasedColors = (i) => [`hsl(${270 + i * 45}, 70%, 60%)`, `hsl(${270 + i * 45}, 70%, 40%)`];

    const motherStatusChartData = generateChartData('عدد الأيتام حسب حالة الأم', data.motherStatusData, motherStatusColors);
    const deathCauseChartData = generateChartData('عدد الأيتام حسب سبب وفاة الأب', data.deathCauseData, deathCauseColors);
    const addressChartData = generateChartData('عدد الأيتام حسب العنوان الأصلي', data.addressData, addressColors);
    const ageGroupChartData = generateChartData('عدد الأيتام حسب الفئة العمرية', data.ageGroupData, ageGroupColors);
    const motherDeceasedChartData = generateChartData('عدد الأيتام حسب حالة الأم المتوفاة', data.motherDeceasedData, motherDeceasedColors);
    const genderChartData = generateChartData('عدد الأيتام حسب جنس اليتيم', data.genderData, genderColors);

    return (
        <div className="p-4 bg-gray-100" dir="rtl">
            <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">احصائيات الأيتام</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">إجمالي الايتام</h2>
                        {isLoading ? (
                            <div className="h-10 w-24 bg-gray-300 animate-pulse rounded"></div>
                        ) : (
                            <p className="text-5xl font-bold text-blue-600">{data.totalOrphans.toLocaleString()}</p>
                        )}
                    </div>
                    <div className="text-6xl text-blue-200">👦</div>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">إجمالي الزوار</h2>
                        {isLoading ? (
                            <div className="h-10 w-24 bg-gray-300 animate-pulse rounded"></div>
                        ) : (
                            <p className="text-5xl font-bold text-green-600">{data.totalVisitors.toLocaleString()}</p>
                        )}
                    </div>
                    <div className="text-6xl text-green-200">👥</div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white shadow-md rounded-lg p-4 h-80 animate-pulse">
                            <div className="h-full w-full bg-gray-300 rounded"></div>
                        </div>
                    ))
                ) : (
                    <>
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">عدد الأيتام حسب جنس اليتيم</h2>
                            <Bar data={genderChartData} options={barChartOptions} />
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">عدد الأيتام حسب العنوان الأصلي</h2>
                            <Bar data={addressChartData} options={barChartOptions} />
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">عدد الأيتام حسب الفئة العمرية</h2>
                            <Bar data={ageGroupChartData} options={barChartOptions} />
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">عدد الأيتام حسب سبب وفاة الأب</h2>
                            <Bar data={deathCauseChartData} options={barChartOptions} />
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">عدد الأيتام حسب حالة الأم المتوفاة</h2>
                            <div style={{ width: '100%', height: '300px' }}>
                                <Pie data={motherDeceasedChartData} options={pieChartOptions} />
                            </div>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">عدد الأيتام حسب حالة الأم</h2>
                            <div style={{ width: '100%', height: '300px' }}>
                                <Pie data={motherStatusChartData} options={pieChartOptions} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
