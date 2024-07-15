Viết 1 module nesjs + postgresql thực hiện việc confirm OTP khi người dùng đặt đơn hàng:

1. API send OTP thực hiện việc tạo và gửi OTP qua email tới khách hàng (sử dụng mailgun API)
2. API tạo đơn hàng thực hiện validate OTP và lưu thông tin đơn hàng
   Đơn hàng có các thông tin cơ bản:
   - Email người dùng
   - Mã sản phẩm
   - Tên sản phẩm
   - Đơn giá
   - Số lượng
   - Tổng tiền
