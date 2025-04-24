export default function getDateVietNam(date) {
    const daysOfWeek = [
        'Chủ Nhật', // Sunday
        'Thứ 2',    // Monday
        'Thứ 3',    // Tuesday
        'Thứ 4',    // Wednesday
        'Thứ 5',    // Thursday
        'Thứ 6',    // Friday
        'Thứ 7'     // Saturday
    ];

    // Mảng ánh xạ tháng sang tiếng Việt
    const months = [
        'Tháng 01',
        'Tháng 02',
        'Tháng 03',
        'Tháng 04',
        'Tháng 05',
        'Tháng 06',
        'Tháng 07',
        'Tháng 08',
        'Tháng 09',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12'
    ];

    // Lấy các thành phần của ngày
    const dayOfWeek = daysOfWeek[date.getDay()]; // Thứ 6

    const day = String(date.getDate()).padStart(2, '0'); // 05
    const month = months[date.getMonth()]; // Tháng 12
    const year = date.getFullYear(); // 2045

    // Ghép chuỗi theo định dạng mong muốn
    const formattedDate = `${dayOfWeek}, ${day} ${month}, ${year}`;

    return formattedDate;
}

// module.exports = getDateVietNam;
// module.exports = { getDateVietNam };