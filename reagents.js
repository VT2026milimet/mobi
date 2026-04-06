/* ============================================================
   REAGENTS MANAGER V1.4
   ============================================================ */

// Module quản lý danh sách và hiển thị các lọ hóa chất (reagents)
const Reagents = {

    // Mỗi hóa chất chứa thông tin: id, tên hiển thị, công thức, tên file ảnh
    inventory: [
        { id: "hcl", name: "Axit Clohidric", formula: "HCl", file: "hcl.jpg" }
    ],

    // Hàm render (tạo HTML) cho một lọ hóa chất theo id
    render: function(id) {
        // Tìm hóa chất trong kho theo id
        const item = this.inventory.find(i => i.id === id);
        if (!item) return "";

        // Xây dựng đường dẫn đến file ảnh của hóa chất
        // Lưu ý: file ảnh phải nằm trong thư mục assets/chemicals/
        const imagePath = `assets/chemicals/${item.file}`;

        // Trả về đoạn HTML tạo ra một lọ hóa chất (reagent-bottle)
        return `
            <div class="reagent-bottle" id="reagent-${id}">
                <img src="${imagePath}"
                     alt="${item.name}"
                     style="width: 200px; height: 250px; object-fit: contain; display: block;"
                     onerror="this.src='https://cdn-icons-png.flaticon.com/512/1048/1048953.png'; this.style.width='100px';">
            </div>`;
    }
};