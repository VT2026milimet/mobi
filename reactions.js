/* --- reactions.js--- */

// Hàm tự động inject CSS cho các hiệu ứng phản ứng (bọt khí, kết tủa, tráng gương, đinh sắt mạ đồng...)
(function injectReactionStyles() {
    // Tránh inject nhiều lần nếu style đã tồn tại
    if (document.getElementById('reaction-styles')) return;

    const style = document.createElement('style');
    style.id = 'reaction-styles';
    style.innerHTML = `
        .bubble {
            position: absolute;
            background: rgba(255, 255, 255, 0.4);
            border: 0.5px solid rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            animation: bubbleUp 3s infinite ease-in;
            z-index: 10;
            pointer-events: none;
        }
        @keyframes bubbleUp {
            0% { transform: translateY(0) scale(0.4); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(-120px) scale(1.2); opacity: 0; }
        }
        .liq-upper-blur { filter: blur(0.3px); }
        .precipitate-solid {
            box-shadow:
                inset 10px 0 15px rgba(255,255,255,0.6),
                inset -10px 0 15px rgba(0,0,0,0.05),
                0 -2px 5px rgba(255,255,255,0.3);
        }
        .copper-coated {
            filter: sepia(1) saturate(5) hue-rotate(-30deg) brightness(0.8) !important;
            position: absolute;
            top: 0; left: 0;
            pointer-events: none;
        }
        .iron-nail-wrapper { position: relative; display: inline-block; }
    `;
    document.head.appendChild(style);
})();

// Module chính quản lý tất cả các hiệu ứng phản ứng hóa học
const LabReactions = {

    // Hàm chính áp dụng hiệu ứng phản ứng vào bình/ống nghiệm
    apply: function(container, effectText, isLitmus = false) {
        const liq = container.querySelector('.liquid-layer');
        const text = effectText ? effectText.toLowerCase() : "";
       
        // 1. XỬ LÝ RIÊNG CHO GIẤY QUỲ TÍM (là vật rắn, không phải dung dịch)
        // Khi nhúng giấy quỳ vào dung dịch, chỉ đổi màu giấy quỳ, không ảnh hưởng đến lớp liquid
        if (isLitmus) {
            const img = container.querySelector('img');
            if (img) {
                if (text.includes("đỏ")) {
                    img.style.filter = "sepia(1) saturate(20) hue-rotate(-50deg)";
                } else if (text.includes("xanh")) {
                    img.style.filter = "sepia(1) saturate(20) hue-rotate(180deg)";
                }
            }
            return; // Thoát hàm, không xử lý tiếp phần dung dịch
        }

        // Nếu không có lớp chất lỏng thì thoát
        if (!liq) return;

        // 2. LOGIC RESET - Khôi phục màu mặc định khi không có hiệu ứng
        if (!effectText || effectText === "") {
            liq.style.transition = "all 1s ease";
            const chemList = container.dataset.chemList || "";
            if (chemList.toLowerCase().includes("cuso4")) {
                liq.style.background = "rgba(0, 112, 255, 0.6)";
            } else {
                liq.style.background = "rgba(128, 128, 128, 0.2)";
            }
            liq.style.filter = "none";
            liq.style.boxShadow = "none";
            return;
        }

        // 3. Thiết lập chuyển động mượt cho hiệu ứng
        liq.style.transition = "all 2s ease-out";

        // 4. XỬ LÝ CÁC HIỆU ỨNG DUNG DỊCH

        // Hiệu ứng màu hồng đặc trưng của Phenolphtalein trong môi trường kiềm
        if (text.includes("màu hồng") || text.includes("phenolphtalein")) {
            liq.style.background = "linear-gradient(to bottom, rgba(255, 20, 147, 0.5) 0%, rgba(255, 0, 128, 0.8) 100%)";
            liq.style.boxShadow = "inset 0 0 15px rgba(255, 20, 147, 0.6)";
            liq.style.filter = "saturate(2) brightness(1.1)";
        }
        // Hiệu ứng xanh dương
        else if (text.includes("xanh dương")) {
            liq.style.background = "rgba(0, 0, 255, 0.5)";
        }

        // 5. HIỆU ỨNG SỦI BỌT (tạo bọt khí nổi lên)
        if (text.includes("sủi bọt")) this.createBubbles(container);

        // 6. CÁC PHẢN ỨNG HÓA HỌC KHÁC

        // A. HIỆU ỨNG ĐỎ GẠCH / ĐỎ NÂU - Phản ứng sắt với đồng sunfat (đinh sắt bị mạ đồng)
        if (text.includes("đỏ gạch") || text.includes("đỏ nâu")) {
            liq.style.background = "linear-gradient(to bottom, rgba(0, 191, 255, 0.1) 0%, rgba(0, 80, 200, 0.2) 100%)";
           
            // Tìm tất cả hình ảnh đinh sắt và áp dụng lớp phủ màu đồng
            document.querySelectorAll('.draggable-item img').forEach(img => {
                if (img.src.includes("Dinhsat")) {
                    const ironRect = img.getBoundingClientRect();
                    const contRect = container.getBoundingClientRect();
                    const isColliding = !(ironRect.right < contRect.left || ironRect.left > contRect.right ||
                                         ironRect.bottom < contRect.top || ironRect.top > contRect.bottom);
                   
                    if (isColliding && !img.parentElement.querySelector('.copper-coated')) {
                        // Tạo wrapper nếu chưa có
                        if (!img.parentElement.classList.contains('iron-nail-wrapper')) {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'iron-nail-wrapper';
                            img.parentNode.insertBefore(wrapper, img);
                            wrapper.appendChild(img);
                        }
                        // Tạo lớp phủ màu đồng lên đinh sắt
                        const coat = img.cloneNode(true);
                        coat.classList.add('copper-coated');
                        img.parentElement.appendChild(coat);
                    }
                }
            });
        }
        // B. HIỆU ỨNG TRÁNG GƯƠNG (phản ứng Glucose + AgNO3)
        else if (text.includes("gương") || text.includes("sáng bóng")) {
            liq.style.background = `linear-gradient(135deg,
                #bdc3c7 0%, #eff2f3 25%, #95a5a6 50%, #ffffff 75%, #bdc3c7 100%)`;
            liq.style.boxShadow = "inset 0 0 20px rgba(255,255,255,0.8)";
            liq.style.filter = "brightness(1.2) contrast(1.1)";
        }
        // C. KẾT TỦA TRẮNG (siêu nét)
        else if (text.includes("trắng")) {
            liq.style.background = `linear-gradient(to bottom,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.2) 55%,
                rgba(255, 255, 255, 1) 60%,
                rgba(240, 240, 240, 1) 100%)`;
            liq.classList.add("precipitate-solid");
            liq.style.filter = "contrast(1.3) brightness(1.1)";
        }
        // D. KẾT TỦA XANH LƠ
        else if (text.includes("xanh lơ")) {
            liq.style.background = `linear-gradient(to bottom, rgba(0, 191, 255, 0.2) 0%, rgba(0, 191, 255, 0.2) 60%, rgba(0, 150, 255, 1) 62%, rgba(0, 100, 255, 1) 100%)`;
            liq.classList.add("precipitate-solid");
        }
        // E. XANH TÍM
        else if (text.includes("xanh tím")) {
            liq.style.background = "linear-gradient(to bottom, rgba(120, 100, 255, 0.6) 0%, rgba(60, 20, 255, 0.9) 100%)";
        }
    },

    // Tạo hiệu ứng bọt khí sủi lên trong dung dịch
    createBubbles: function(container) {
        const liq = container.querySelector('.liquid-layer');
        if (!liq) return;

        const liqWidth = parseFloat(liq.style.width) || 20;
        const liqLeft = parseFloat(liq.style.left) || 40;
        const targetArea = container.querySelector('.glass-container') || container;
       
        // Giới hạn số lượng bọt để tránh lag
        if (targetArea.querySelectorAll('.bubble').length > 15) return;

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const b = document.createElement('div');
                b.className = 'bubble';
                const innerX = (Math.random() * 0.6 + 0.2) * liqWidth;
                b.style.left = (liqLeft + innerX) + "%";
                b.style.bottom = "40px";
                const size = (Math.random() * 3 + 2);
                b.style.width = size + "px";
                b.style.height = size + "px";
                b.style.animationDelay = (Math.random() * 1) + "s";
                targetArea.appendChild(b);
            }, i * 150);
        }
    }
};