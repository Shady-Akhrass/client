import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AidsDashboard = () => {
    const [data, setData] = useState({
        healthStatusData: [],
        aidTypeData: [],
        jobData: [],
        maritalStatusData: [],
        totalAids: 0,
        totalVisitors: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const response = await axios.get('https://forms-api.saiid.org/api/aids/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                const {
                    statusCounts,
                    aidTypeCounts,
                    jobCounts,
                    maritalStatusCounts,
                    totalAids,
                    totalVisitors
                } = response.data;

                setData({
                    healthStatusData: Object.entries(statusCounts || {}),
                    aidTypeData: Object.entries(aidTypeCounts || {}),
                    jobData: Object.entries(jobCounts || {}),
                    maritalStatusData: Object.entries(maritalStatusCounts || {}),
                    totalAids: totalAids || 0,
                    totalVisitors: totalVisitors || 0,
                });
            } catch (error) {
                console.error('Error fetching aids dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const createGradient = (context, color1, color2) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return color1;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    };

    // Colors for different charts
    const jobColors = (i) => [`hsl(${210 + i * 30}, 70%, 60%)`, `hsl(${210 + i * 30}, 70%, 40%)`];
    const maritalStatusColors = (i) => [`hsl(${30 + i * 60}, 70%, 60%)`, `hsl(${30 + i * 60}, 70%, 40%)`];
    const healthStatusColors = (i) => [`hsl(${120 + i * 20}, 70%, 60%)`, `hsl(${120 + i * 20}, 70%, 40%)`];
    const aidTypeColors = (i) => [`hsl(${270 + i * 45}, 70%, 60%)`, `hsl(${270 + i * 45}, 70%, 40%)`];

    const generateChartData = (label, data, colorFunction) => ({
        labels: data.map(([key]) => key),
        datasets: [{
            label,
            data: data.map(([, count]) => Number(count) || 0),
            backgroundColor: (context) => {
                return data.map((_, i) =>
                    createGradient(context, colorFunction(i)[0], colorFunction(i)[1])
                );
            },
            borderColor: '#fff',
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
        }],
    });

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
        },
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen" dir="rtl">
            <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">احصائيات المساعدات</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">إجمالي المعونات</h2>
                        {isLoading ? (
                            <div className="h-10 w-24 bg-gray-300 animate-pulse rounded"></div>
                        ) : (
                            <p className="text-5xl font-bold text-blue-600">{data.totalAids.toLocaleString()}</p>
                        )}
                    </div>
                    <div className="text-6xl text-blue-200">📊</div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white shadow-lg rounded-lg p-4 h-96 animate-pulse">
                            <div className="h-full w-full bg-gray-300 rounded"></div>
                        </div>
                    ))
                ) : (
                    <>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">عدد المعونات حسب الحالة الصحية</h2>
                            <div className="h-80">
                                <Bar data={generateChartData('عدد المعونات حسب الحالة الصحية', data.healthStatusData, healthStatusColors)} options={chartOptions} />
                            </div>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">عدد المعونات حسب نوع المعونة</h2>
                            <div className="h-80">
                                <Bar data={generateChartData('عدد المعونات حسب نوع المعونة', data.aidTypeData, aidTypeColors)} options={chartOptions} />
                            </div>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">عدد المعونات حسب الوظيفة</h2>
                            <div className="h-80">
                                <Bar data={generateChartData('عدد المعونات حسب الوظيفة', data.jobData, jobColors)} options={chartOptions} />
                            </div>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">عدد المعونات حسب الحالة الاجتماعية</h2>
                            <div className="h-80">
                                <Bar data={generateChartData('عدد المعونات حسب الحالة الاجتماعية', data.maritalStatusData, maritalStatusColors)} options={chartOptions} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AidsDashboard;
