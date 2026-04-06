const toolCategoryData = `
Dụng cụ thủy tinh | Ống nghiệm | ongnghiem.jpg | Chứa lượng nhỏ hóa chất và thực hiện phản ứng hóa học | lắc ống nghiệm/dừng lắc ống nghiệm
Dụng cụ thủy tinh | Giá ống nghiệm | giaongnghiem.jpg | Giữ và đặt các ống nghiệm khi làm thí nghiệm | không
Dụng cụ thủy tinh | Cốc thủy tinh | cocthuytinh.jpg | Chứa dung dịch, pha chế và có thể đun nóng | lắc cốc thủy tinh/dừng lắc cốc thủy tinh
Dụng cụ thủy tinh | Bình tam giác | binhtamgiac.jpg | Dùng để lắc trộn dung dịch và thực hiện phản ứng | lắc bình tam giác/dừng lắc bình tam giác
Dụng cụ thủy tinh | Bình cầu | binhcau.jpg | Thực hiện phản ứng cần đun nóng hoặc chưng cất | lắc bình cầu/dừng lắc bình cầu
Dụng cụ thủy tinh | Bình định mức | binhdinhmuc.jpg | Pha dung dịch với thể tích chính xác | lắc bình định mức/dừng lắc bình định mức
Dụng cụ thủy tinh | Ống nhỏ giọt | ongnhogiot.jpg | Nhỏ dung dịch từng giọt | hút dung dịch/nhỏ dung dịch
Dụng cụ thủy tinh | Ống dẫn thủy tinh | ongdanthuytinh.jpg | Dẫn khí hoặc dung dịch giữa các dụng cụ | không
Dụng cụ thủy tinh | Đũa thủy tinh | duathuytinh.jpg | Khuấy dung dịch hoặc hỗ trợ rót dung dịch | khuấy/dừng khuấy
Dụng cụ thủy tinh | Phễu thủy tinh | pheuthuytinh.jpg | Rót dung dịch hoặc lọc dung dịch | không
Dụng cụ thủy tinh | Ống sinh hàn | ongsinhhan.jpg | Làm lạnh hơi trong quá trình chưng cất | không
Dụng cụ thủy tinh | Chén thủy tinh | chenthuytinh.jpg | Chứa hoặc cô đặc dung dịch | không
Dụng cụ gia nhiệt | Đèn cồn | dencon.jpg | Cung cấp nguồn nhiệt cho các phản ứng | đốt đèn cồn/tắt đèn cồn
Dụng cụ gia nhiệt | Bếp điện | bepdien.jpg | Gia nhiệt dung dịch hoặc hóa chất | bật bếp điện/tắt bếp điện
Dụng cụ gia nhiệt | Bếp cách thủy | bepcachthuy.jpg | Gia nhiệt nhẹ và ổn định cho dung dịch | bật bếp cách thủy/tắt bếp cách thủy
Dụng cụ gia nhiệt | Kiềng ba chân | kiengbachan.jpg | Giá đỡ khi đun nóng bằng đèn cồn | không
Dụng cụ gia nhiệt | Lưới amiăng | luoiamiang.jpg | Phân bố nhiệt đều khi đun | không
Dụng cụ gia nhiệt | Kẹp gỗ ống nghiệm | kepgoongnghiem.jpg | Giữ ống nghiệm khi đun nóng | không
Dụng cụ gia nhiệt | Kẹp kim loại | kepkimloai.jpg | Giữ bình hoặc cốc khi gia nhiệt | không
Dụng cụ đo lường | Ống đong | ongdong.jpg | Đo thể tích dung dịch tương đối chính xác | không
Dụng cụ đo lường | Pipet | pipet.jpg | Lấy thể tích dung dịch chính xác | hút dung dịch/nhỏ dung dịch
Dụng cụ đo lường | Buret | buret.jpg | Dùng trong thí nghiệm chuẩn độ | không
Dụng cụ đo lường | Cân điện tử | candientu.jpg | Đo khối lượng hóa chất | không
Dụng cụ đo lường | Nhiệt kế | nhietke.jpg | Đo nhiệt độ của dung dịch | không
Dụng cụ đo lường | Đồng hồ bấm giờ | donghobamgio.jpg | Đo thời gian phản ứng | đếm giờ/tắt đếm giờ
Dụng cụ Khuấy – thao tác | Đũa thủy tinh | duathuytinh.jpg | Khuấy dung dịch | khuấy/dừng khuấy
Dụng cụ Khuấy – thao tác | Muỗng lấy hóa chất | muong.jpg | Lấy hóa chất rắn | múc/bỏ vào
Dụng cụ Khuấy – thao tác | Kẹp gắp | kepgap.jpg | Gắp vật nóng hoặc hóa chất | không
Dụng cụ Khuấy – thao tác | Kẹp ống nghiệm | kepongnghiem.jpg | Giữ ống nghiệm khi thao tác | không
Dụng cụ Khuấy – thao tác | Giá đỡ thí nghiệm | giadoongnghiem.jpg | Cố định các dụng cụ trong thí nghiệm | không
Dụng cụ Tách – lọc | Phễu thủy tinh | pheuthuytinh.jpg | Lọc dung dịch | không
Dụng cụ Tách – lọc | Giấy lọc | giayloc.jpg | Giữ lại chất rắn khi lọc | không
Dụng cụ Tách – lọc | Phễu chiết | pheuchiet.jpg | Tách hai chất lỏng không hòa tan | không
Dụng cụ Tách – lọc | Bình lắng | binhlang.jpg | Tách chất theo sự khác nhau về khối lượng riêng | không
Dụng cụ Tách – lọc | Ống ly tâm | onglytam.jpg | Chứa mẫu trong quá trình ly tâm | không
Dụng cụ Tách – lọc | Máy ly tâm | maylytam.jpg | Tách chất bằng lực ly tâm | không
Dụng cụ Tách – lọc | Bộ chưng cất | bochungcat.jpg | Tách chất dựa vào nhiệt độ sôi khác nhau | không
`;