import * as XLSX from 'xlsx';

/**
 * Export users data to Excel
 * @param {Array} users - Array of user objects
 * @param {string} filename - Name for the Excel file
 */
export const exportUsersToExcel = (users, filename = 'Users_Export') => {
    // Prepare data for Excel
    const excelData = users.map(user => ({
        'First Name': user.firstName || '',
        'Last Name': user.lastName || '',
        'Email': user.email || '',
        'Phone': user.phoneNumber || 'N/A',
        'Role': user.role || '',
        'Status': user.status || '',
        'Verification Status': user.verificationStatus || '',
        'Created At': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
        'Last Login': user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A',
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    // Save file
    XLSX.writeFile(wb, `${filename}_${Date.now()}.xlsx`);
};

/**
 * Export appointments data to Excel
 * @param {Array} appointments - Array of appointment objects
 * @param {string} filename - Name for the Excel file
 */
export const exportAppointmentsToExcel = (appointments, filename = 'Appointments_Export') => {
    // Prepare data for Excel
    const excelData = appointments.map(apt => ({
        'Appointment ID': apt._id || '',
        'Date': apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : 'N/A',
        'Time': apt.timeSlot || 'N/A',
        'Patient Name': `${apt.patient?.firstName || ''} ${apt.patient?.lastName || ''}`.trim(),
        'Patient Email': apt.patient?.email || 'N/A',
        'Doctor Name': `${apt.doctor?.firstName || ''} ${apt.doctor?.lastName || ''}`.trim(),
        'Doctor Email': apt.doctor?.email || 'N/A',
        'Status': apt.status || '',
        'Reason for Visit': apt.reasonForVisit || 'N/A',
        'Notes': apt.notes || 'N/A',
        'Created At': apt.createdAt ? new Date(apt.createdAt).toLocaleDateString() : 'N/A',
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Appointments');

    // Save file
    XLSX.writeFile(wb, `${filename}_${Date.now()}.xlsx`);
};
