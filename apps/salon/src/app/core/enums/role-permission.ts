export enum PermissionNames {
    //Appointment
    //GetAllApointment = 1,
    //GetAllByBranch = 2,
    //GetAllByStatus = 3,
    CreateAppointment = 'Tạo lịch hẹn',
    //GetAppointmentById = 5,
    //UpdateStatus = 7,
    AssignTechnicalStaff = 'Chọn nhân viên kỹ thuật',
    //UpdateAppointmentWithoutService = 9,
    //UpdateAppointmentWithService = 10,
    //UpdateAppointment = 11,
    DeleteAppointmentById = 'Xóa lịch hẹn',
    UpdateDiscount = 'Cập nhật giảm giá',

    //Authentication
    CreateUser = 'Thêm nhân viên',
    CreateUserForEmployee = 'Thêm tài khoản cho nhân viên',

    //Bill
    CreateBill = 'Tạo hóa đơn',
    //GetAllBillAsync = 17,
    //GetBillByIdAsync = 18,
    UpdateBill = 'Cập nhật hóa đơn',

    //Branch
    //GetAllBranches = 20,
    //GetBranchByID = 21,
    //GetBranchNameByID = 22,
    CreateBranch = 'Thêm chi nhánh',
    UpdateBranch = 'Chỉnh sửa chi nhánh',
    DeleteBranch = 'Xóa chi nhánh',

    //Customer
    //GetAllCustomer = 26,
    //GetAllByPage = 27,
    //GetCusomerById = 28,
    CreateCustomer = 'Thêm khách hàng',
    UpdateCustomer = 'Sửa thông tin khách hàng',
    //DeactivateCustomer = 31,
    //SearchCustomers = 32,
    //UploadImage = ,
    UploadImages = 'Tải hình ảnh lên',
    //GetHistoryCustomerById = 35,

    //CustomerType
    //GetAllCustomerTypes = 36,
    //GetCustomerTypeById = 37,
    //CreateCustomerType = 38,
    //UpdateCustomerType = 39,
    //DeleteCustomerType = 40,

    //Job/JobType
    //GetAllJobs = 41,
    //GetJobTypeByID = 42,
    CreateJobType = 'Tạo công việc',
    UpdateJob = 'Sửa công việc',
    DeleteJob = 'Xóa công việc',

    //Payment
    //GetPaymentByDay = 46,
    //GetPaymenOfCustomer = 47,
    AddPayment = 'Thêm phiếu thanh toán',
    //GetPaymentByBranch = 49,
    ExportExelPayment = 'Export dữ liệu phiếu thanh toán',

    //Permission
    //GetAllPermissions = 51,
    //GetPermissionsByJobType = 52,
    //GetPermissionsByName = 53,
    //GetPermissionNameByJobType = 54,
    //GetRolePermissionByID = 55,
    CreateRolePermission = 'Thêm quyền cho vai trò',
    CreatePermission = 'Thêm quyền',
    DeleteRolePermission = 'Xóa quyền cho vai trò',
    DeletePermission = 'Xóa quyền',
    UpdatePermission = 'Cập nhật quyền',

    //Service
    //GetAllService = 61,
    //GetServiceById = 62,
    CreateService = 'Tạo dịch vụ',
    UpdateService = 'Cập nhật dịch vụ',
    DeleteService = 'Xóa dịch vụ',

    //User
    //OnlyUser = 66,
    //ViewAllUser = 67,
    //UserPage = 68,
    //GetAllEmployee = 69,
    //EmployeeByBranchAndJob = 70,
    //GetAllAdmin = 71,
    //GetUserByEmail = 72,
    //GetUserByAdmin = 73,
    //GetUserByEmployee = 74,
    //GetUserBoolByEmail = 75,
    UpdateUser = 'Cập nhật thông tin nhân viên',
    DeleteUser = 'Xóa nhân viên',

    //Report
    //GetRevenueReportByBranch = 78,
    //GetRevenueReportByDay = 79,

    //Bill
    //GetBillHistory = 80,
    //GetBillByCustomer = 81,

    //Appointment
    //InfoToCreateBill = 82,
    //GetAppointmentByDay = 83,
}