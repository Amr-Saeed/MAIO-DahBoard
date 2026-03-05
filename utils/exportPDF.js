import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export users data to PDF
 * @param {Array} users - Array of user objects
 * @param {string} title - Title for the PDF document
 */
export const exportUsersToPDF = (users, title = 'Users Report') => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 20);

    // Add date
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = users.map(user => [
        `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        user.email || '',
        user.role || '',
        user.status || '',
        user.verificationStatus || '',
        user.phoneNumber || 'N/A',
    ]);

    // Add table
    doc.autoTable({
        startY: 35,
        head: [['Name', 'Email', 'Role', 'Status', 'Verification', 'Phone']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }, // Blue header
    });

    // Save the PDF
    doc.save(`${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

/**
 * Export appointments data to PDF
 * @param {Array} appointments - Array of appointment objects
 * @param {string} title - Title for the PDF document
 */
export const exportAppointmentsToPDF = (appointments, title = 'Appointments Report') => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 20);

    // Add date
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = appointments.map(apt => [
        new Date(apt.appointmentDate).toLocaleDateString(),
        apt.timeSlot || 'N/A',
        `${apt.patient?.firstName || ''} ${apt.patient?.lastName || ''}`.trim(),
        `${apt.doctor?.firstName || ''} ${apt.doctor?.lastName || ''}`.trim(),
        apt.status || '',
        apt.reasonForVisit?.substring(0, 50) || 'N/A',
    ]);

    // Add table
    doc.autoTable({
        startY: 35,
        head: [['Date', 'Time', 'Patient', 'Doctor', 'Status', 'Reason']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }, // Blue header
    });

    // Save the PDF
    doc.save(`${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};
