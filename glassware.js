/* ============================================================
   GLASSWARE IMAGE ENGINE V11.0 - FULL LIST & FIXED ID
   ============================================================ */

const Glassware = {
    toolMap: {
        "Ống nghiệm": "ongnghiem.jpg",
        "Giá ống nghiệm": "giaongnghiem.jpg",
        "Cốc thủy tinh (Beaker)": "cocthuytinh.jpg",
        "Bình tam giác (Erlenmeyer)": "binhtamgiac.jpg",
        "Bình cầu": "binhcau.jpg",
        "Bình định mức": "binhdinhmuc.jpg",
        "Ống nhỏ giọt": "ongnhogiot.jpg",
        "Ống dẫn thủy tinh": "ongdanthuytinh.jpg",
        "Đũa thủy tinh": "duathuytinh.jpg",
        "Phễu thủy tinh": "pheuthuytinh.jpg",
        "Phễu chiết": "pheuchiet.jpg",
        "Ống sinh hàn": "ongsinhhan.jpg",
        "Chén thủy tinh": "chenthuytinh.jpg",
        "Đèn cồn": "dencon.jpg",
        "Bếp điện": "bepdien.jpg",
        "Bếp cách thủy": "bepcachthuy.jpg",
        "Kiềng ba chân": "kiengbachan.jpg",
        "Lưới amiăng": "luoiamiang.jpg",
        "Kẹp gỗ ống nghiệm": "kepgoongnghiem.jpg",
        "Kẹp kim loại": "kepkimloai.jpg",
        "Ống đong": "ongdong.jpg",
        "Pipet": "pipet.jpg",
        "Buret": "buret.jpg",
        "Cân điện tử": "candientu.jpg",
        "Nhiệt kế": "nhietke.jpg",
        "Đồng hồ bấm giờ": "donghobamgio.jpg",
        "Muỗng lấy hóa chất": "muong.jpg",
        "Spatula (thìa hóa chất)": "spatula.jpg",
        "Kẹp gắp": "kepgap.jpg",
        "Kẹp ống nghiệm": "kepongnghiem.jpg",
        "Chổi rửa ống nghiệm": "choiruaongnghiem.jpg",
        "Giá đỡ thí nghiệm": "giadoongnghiem.jpg",
        "Giấy lọc": "giayloc.jpg",
        "Bình lắng": "binhlang.jpg",
        "Ống ly tâm": "onglytam.jpg",
        "Máy ly tâm": "maylytam.jpg",
        "Bộ chưng cất": "bochungcat.jpg"
    },

render: function(name, id = "item") {
        const fileName = this.toolMap[name] || "default.jpg";
        const imagePath = `assets/tools/${fileName}`;

        // ID gán trực tiếp cho div.glass-container để actions.js truy xuất chính xác
        return `
            <div class="glass-container" id="${id}">
                <img src="${imagePath}" class="real-tool-img" alt="${name}" 
                     onerror="this.src='https://cdn-icons-png.flaticon.com/512/3616/3616715.png';">
                <div id="liquid-${id}" class="liquid-layer"></div>
                <div id="bubbles-${id}" class="bubble-box"></div>
            </div>`;
    }
};