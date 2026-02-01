import api from "./axios";

export const getDashboardData = () =>{
    return api.get('/dashboard');
};

export const getCitizenDashboardData = () =>{
    return api.get('/dashboard/citizen');
}

export const getStaffDashboardData = () =>{
    return api.get('/dashboard/staff');
}

export const getAdminDashboard = () =>{
    return api.get('/dashboard/admin');
}   