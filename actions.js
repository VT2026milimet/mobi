/* --- actions.js--- */
// Định nghĩa các nhóm hóa chất để kiểm tra phản ứng (axit, bazơ, chỉ thị)
const ChemClass = {
    acids: ['hcl', 'h2so4', 'hno3', 'ch3cooh', 'axit'],
    bases: ['naoh', 'ba(oh)2', 'ca(oh)2', 'koh', 'nh4oh', 'bazơ', 'kiềm'],
    indicators: ['phenolphtalein', 'quỳ tím']
};

/**
 * MODULE QUẢN LÝ THAO TÁC VỚI HÓA CHẤT RẮN (DÙNG MUỖNG)
 */
const SolidTransfer = {
    isHoldingSolid: false,      // Trạng thái đang cầm chất rắn hay không
    currentSolid: null,         // Tên hóa chất rắn đang cầm

    // Thử lấy hóa chất rắn từ lọ bằng muỗng
    tryScoop: function(el) {
        const foundBottle = LabActions.checkToolCollision(el, true);
        if (foundBottle) {
            const chemImg = foundBottle.querySelector('img');
            const chemName = chemImg ? chemImg.alt : "";
            const state = LabActions.getChemicalState(chemName);

            // Chỉ cho phép lấy nếu là chất rắn
            if (state !== "rắn") {
                LabActions.speak("Đây là chất lỏng, bạn nên dùng ống hút để lấy nhé.");
                return false;
            }

            this.isHoldingSolid = true;
            this.currentSolid = chemName;
            this.showSolidOnTool(el, true);
            LabActions.speak("Đã lấy một lượng hóa chất");
            return true;
        }
        return false;
    },

    // Thử bỏ chất rắn đang cầm vào ống nghiệm / bình
    tryPutIn: function(el) {
        if (!this.isHoldingSolid) return false;

        const foundContainer = LabActions.checkToolCollision(el, false);
       
        if (foundContainer) {
            const containerImg = foundContainer.querySelector('img');
            // Không cho bỏ chất rắn vào giấy quỳ tím
            if (containerImg && containerImg.alt.toLowerCase().includes("quỳ tím")) return false;

            const chemFormula = LabActions.getFormulaByName(this.currentSolid).toLowerCase();
           
            let currentList = foundContainer.dataset.chemList || "";
            if (!currentList.toLowerCase().includes(chemFormula)) {
                foundContainer.dataset.chemList = currentList ? `${currentList}, ${chemFormula}` : chemFormula;
            }

            this.createSolidDropEffect(foundContainer);
            this.isHoldingSolid = false;
            this.showSolidOnTool(el, false);
            LabActions.speak("Đã cho hóa chất vào ống nghiệm.");
            LabActions.checkAllGlobalReactions();
            return true;
        }
        return false;
    },

    // Hiển thị / ẩn hạt chất rắn trên đầu muỗng
    showSolidOnTool: function(el, show) {
        let grainContainer = el.querySelector('.solid-grain-container');
        if (show) {
            if (!grainContainer) {
                grainContainer = document.createElement('div');
                grainContainer.className = 'solid-grain-container';
                Object.assign(grainContainer.style, {
                    position: 'absolute', bottom: '12px', left: '50%',
                    transform: 'translateX(-50%)', width: '12px', height: '8px'
                });
                for(let i = 0; i < 38; i++) {
                    const grain = document.createElement('div');
                    Object.assign(grain.style, {
                        position: 'absolute', width: '4px', height: '3px',
                        background: '#eee', borderRadius: '40%',
                        left: Math.random() * 8 + 'px', top: Math.random() * 4 + 'px',
                        boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
                    });
                    grainContainer.appendChild(grain);
                }
                el.appendChild(grainContainer);
            }
        } else if (grainContainer) grainContainer.remove();
    },

    // Tạo hiệu ứng hạt rắn rơi vào bình
    createSolidDropEffect: function(container) {
        for(let i = 0; i < 15; i++) {
            const grain = document.createElement('div');
            const narrowLeft = (47 + Math.random() * 6) + '%';
            Object.assign(grain.style, {
                position: 'absolute', top: '10px', left: narrowLeft,
                width: '2px', height: '2px', background: '#fff',
                borderRadius: '50%', pointerEvents: 'none',
                transition: `all ${0.4 + Math.random() * 0.4}s ease-in`
            });
            container.appendChild(grain);
            setTimeout(() => { grain.style.top = '75%'; grain.style.opacity = '0'; }, 50);
            setTimeout(() => grain.remove(), 900);
        }
    }
};

/**
 * MODULE QUẢN LÝ VA CHẠM VÀ DỊCH CHUYỂN CHẤT LỎNG (ỐNG HÚT / ỐNG NHỎ GIỌT)
 */
const LiquidTransfer = {

    // Thử hút chất lỏng vào ống hút
    trySuck: function(el, liq) {
        const foundBottle = LabActions.checkToolCollision(el, true);
        if (foundBottle) {
            const chemImg = foundBottle.querySelector('img');
            const chemName = chemImg ? chemImg.alt : "";
            const state = LabActions.getChemicalState(chemName);

            // Chặn nếu là chất rắn
            if (state === "rắn") {
                LabActions.speak("Đây là chất rắn, bạn không thể dùng ống hút. Hãy dùng muỗng nhé!");
                return false;
            }
            // Chặn nếu là giấy quỳ tím
            if (state === "giấy") {
                LabActions.speak("Đây là quỳ tím, bạn không thể dùng ống hút để lấy.");
                return false;
            }

            // Hút thành công
            LabActions.speak("Đã lấy dung dịch.");
            let suckColor = "rgba(128,128,128,0.5)";
            if (chemName.toLowerCase().includes("cuso4")) suckColor = "rgba(0, 112, 255, 0.6)";
           
            liq.style.height = "65%";
            liq.style.backgroundColor = suckColor;
            el.dataset.currentChem = chemName;
            el.dataset.currentColor = suckColor;
            return true;
        }
        return false;
    },

    // Thử nhỏ chất lỏng từ ống vào bình/ống nghiệm
    tryDrop: function(el, liq) {
        if (!el.dataset.currentChem) return false;

        const foundContainer = LabActions.checkToolCollision(el, false);
        if (foundContainer) {
            const formula = el.dataset.currentChem;
            const currentColor = el.dataset.currentColor || "rgba(128,128,128,0.5)";

            LabActions.speak("Đang nhỏ dung dịch...");
            LabActions.createDropEffect(el, currentColor);
            LabActions.transferWithLogic(foundContainer, currentColor, formula);

            liq.style.height = "0%";
            el.dataset.currentChem = "";
            el.dataset.currentColor = "";
            return true;
        }
        return false;
    }
};

// Module chính quản lý tất cả các hành động trong phòng thí nghiệm
const LabActions = {
    allowedContainers: ["Bình cầu", "Bình định mức", "Bình tam giác", "Chén thủy tinh", "Cốc thủy tinh", "Ống nghiệm", "Cây đinh"],
   
    speechQueue: [],           // Hàng đợi các câu nói
    isSpeaking: false,         // Đang nói hay không
    isPriorityPlaying: false,  // Đang phát âm thanh ưu tiên (phản ứng)
    currentUtterance: null,

    // Cấu hình vị trí và kích thước lớp chất lỏng cho từng loại dụng cụ
    toolConfigs: {
        "Ống nghiệm": { bottom: "35px", width: "10%", radius: "2px 2px 15px 15px", receiveHeight: 15 },
        "Cốc thủy tinh": { bottom: "30px", width: "50%", radius: "2px 2px 5px 5px", receiveHeight: 10 },
        "Bình tam giác": { bottom: "30px", width: "50%", radius: "2px 2px 5px 5px", receiveHeight: 15 },
        "Chén thủy tinh": { bottom: "53px", width: "60%", radius: "3px 3px 20px 20px", receiveHeight: 10},
        "Ống nhỏ giọt": { bottom: "10px", width: "7%", radius: "2px", receiveHeight: 50 },
        "Mặc định": { bottom: "20px", width: "30%", radius: "2px", receiveHeight: 12 }
    },

    // Phát giọng nói (có hỗ trợ ưu tiên)
    speak: function(text, isPriority = false) {
        if (!text) return;
        if (isPriority) {
            this.speechQueue = this.speechQueue.filter(item => item.isPriority);
        } else {
            if (this.isPriorityPlaying) return;
        }
        this.speechQueue.push({ text, isPriority });
        if (!this.isSpeaking) {
            this.processSpeechQueue();
        }
    },

    // Thêm độ trễ vào hàng đợi nói
    delay: function(ms) {
        this.speechQueue.push({ isDelay: true, duration: ms });
        if (!this.isSpeaking) {
            this.processSpeechQueue();
        }
    },

    // Xử lý lần lượt các câu nói trong hàng đợi
    processSpeechQueue: function() {
        if (this.speechQueue.length === 0) {
            this.isSpeaking = false;
            this.isPriorityPlaying = false;
            return;
        }
        this.isSpeaking = true;
        const item = this.speechQueue.shift();

        if (item.isDelay) {
            setTimeout(() => {
                this.processSpeechQueue();
            }, item.duration);
            return;
        }

        if (item.isPriority) {
            responsiveVoice.cancel();
        }

        responsiveVoice.speak(item.text, "Vietnamese Female", {
            onstart: () => {
                this.isPriorityPlaying = item.isPriority;
            },
            onend: () => {
                if (item.isPriority) this.isPriorityPlaying = false;
                this.isSpeaking = false;
                this.processSpeechQueue();
            }
        });
    },

    // Lấy trạng thái của hóa chất (rắn / lỏng / giấy...)
    getChemicalState: function(name) {
        if (!name || typeof chemicalDataRaw === 'undefined') return "lỏng";
        const cleanName = name.trim().toLowerCase();
        const lines = chemicalDataRaw.trim().split('\n');
        for (let line of lines) {
            const columns = line.split('|').map(s => s.trim());
            if (columns.length >= 5) {
                const itemName = columns[1].toLowerCase();
                const itemFormula = columns[3].toLowerCase();
                const state = columns[4].toLowerCase();
                if (cleanName === itemName || cleanName === itemFormula) return state;
            }
        }
        return "lỏng";
    },

    // Kiểm tra xem dụng cụ có đang được đun nóng không
    isHeatingNow: function(container) {
        const cRect = container.getBoundingClientRect();
        let isHot = false;
        document.querySelectorAll('.draggable-item').forEach(lamp => {
            const flame = lamp.querySelector('.lamp-flame');
            if (flame && flame.style.display === "block") {
                const lRect = lamp.getBoundingClientRect();
                if (Math.abs((cRect.left + cRect.width/2) - (lRect.left + lRect.width/2)) < 90 &&
                    (cRect.bottom > lRect.top - 150 && cRect.bottom < lRect.top + 100)) {
                    isHot = true;
                }
            }
        });
        return isHot;
    },

    // Thực hiện hành động chính của dụng cụ (hút, nhỏ, múc, bỏ vào, lắc, đốt...)
    execute: function(el, toolName) {
        try {
            if (toolName.includes("Đinh") || toolName.includes("sắt")) {
                this.handleSolidInteraction(el);
                return;
            }
            if (toolName.includes("Quỳ tím")) {
                this.handleLitmusSpecial(el);
            }

            const actionData = this.getRawAction(toolName);
            if (!actionData || actionData === "không") return;

            const actions = actionData.split("/").map(s => s.trim());
            if (el.dataset.step === undefined) el.dataset.step = "0";

            let step = parseInt(el.dataset.step);
            const act = actions[step].toLowerCase();
            const liq = el.querySelector('.liquid-layer');
            let success = false;

            if (act.includes("hút") && liq) success = LiquidTransfer.trySuck(el, liq);
            else if (act.includes("nhỏ") && liq) success = LiquidTransfer.tryDrop(el, liq);
            else if (act.includes("múc")) success = SolidTransfer.tryScoop(el);
            else if (act.includes("bỏ vào")) success = SolidTransfer.tryPutIn(el);
            else {
                if (act.includes("lắc")) el.classList.add('shake-anim');
                if (act.includes("dừng")) el.classList.remove('shake-anim');

                const flame = el.querySelector('.lamp-flame');
                if (flame) flame.style.display = (act.includes("bật") || act.includes("đốt")) ? "block" : "none";

                this.speak("Đang " + actions[step]);
                success = true;
            }

            if (success) el.dataset.step = (step + 1) % actions.length;
        } catch (e) { console.error("Lỗi execute:", e); }
    },

    // Xử lý đặc biệt khi dùng giấy quỳ tím
    handleLitmusSpecial: function(el) {
        const foundContainer = this.checkToolCollision(el, false);
        if (foundContainer) {
            // Tránh thông báo lặp lại cho cùng một hỗn hợp
            if (el.dataset.lastStatus === foundContainer.dataset.chemList) return true;

            const chemListAttr = foundContainer.dataset.chemList || "";
            el.dataset.chemList = "quỳ tím";

            const chemsInContainer = chemListAttr.split(',').map(c => c.trim().toLowerCase());
            let effect = "";
            let statusText = "Quỳ tím không đổi màu.";

            const isAcid = chemsInContainer.some(c => ChemClass.acids.includes(c));
            const isBase = chemsInContainer.some(c => ChemClass.bases.includes(c));

            if (isAcid) {
                effect = "màu đỏ";
                statusText = "Quỳ tím hóa đỏ do tiếp xúc với dung dịch Axit.";
            } else if (isBase) {
                effect = "màu xanh";
                statusText = "Quỳ tím hóa xanh do tiếp xúc với dung dịch Kiềm.";
            }

            if (effect) {
                this.speak(statusText);
                el.dataset.lastStatus = foundContainer.dataset.chemList;
                if (typeof LabReactions !== 'undefined') LabReactions.apply(el, effect, true);
                this.checkAllGlobalReactions();
            }
        }
        return true;
    },

    // Xử lý khi thả đinh sắt vào bình
    handleSolidInteraction: function(solidEl) {
        const solidRect = solidEl.getBoundingClientRect();
        let foundContainer = null;

        document.querySelectorAll('.draggable-item').forEach(el => {
            if (el === solidEl) return;
            const r = el.getBoundingClientRect();
            const isColliding = !(solidRect.right < r.left - 20 || solidRect.left > r.right + 20 || 
                                  solidRect.bottom < r.top - 20 || solidRect.top > r.bottom + 20);
            if (isColliding) {
                const img = el.querySelector('img');
                if (img && this.allowedContainers.some(name => img.alt.includes(name))) 
                    foundContainer = el;
            }
        });

        if (foundContainer) {
            const formula = "fe";
            let chems = foundContainer.dataset.chemList ? foundContainer.dataset.chemList.split(',') : [];
            if (!chems.includes(formula)) {
                chems.push(formula);
                foundContainer.dataset.chemList = chems.join(',');
                this.speak("Đã cho đinh sắt vào ống nghiệm");
                this.checkAllGlobalReactions();
            }
            return true;
        }
        return false;
    },

    // Kiểm tra và thực hiện tất cả các phản ứng hóa học toàn cục
    checkAllGlobalReactions: function() {
        if (!window.currentExp) return;

        const mainChems = window.currentExp.chems.split(',').map(name => this.getFormulaByName(name.trim()).toLowerCase());
       
        document.querySelectorAll('.draggable-item').forEach(el => {
            const chemListAttr = el.dataset.chemList;
            if (!chemListAttr) return;

            let chemsInContainer = chemListAttr.split(',').map(c => c.trim().toLowerCase());

            const hasBase = chemsInContainer.some(c => ChemClass.bases.includes(c));
            const hasPhenol = chemsInContainer.includes("phenolphtalein");

            // 1. Xử lý Phenolphtalein chuyển màu hồng trong môi trường bazơ
            if (hasBase && hasPhenol && el.dataset.phenolReacted !== "true") {
                if (typeof LabReactions !== 'undefined') {
                    LabReactions.apply(el, "màu hồng");
                }
                this.speak("Dung dịch phenolphtalein không màu chuyển sang màu hồng.", true);
                el.dataset.phenolReacted = "true";
            }

            // 2. Xử lý các phản ứng chính của thí nghiệm
            if (mainChems.every(f => chemsInContainer.includes(f)) && mainChems.length >= 2) {
                if (el.dataset.reacted !== "true") {
                    const needsHeat = window.currentExp.tools.includes("Đèn cồn") || window.currentExp.tools.includes("Bếp");
                   
                    if (!needsHeat || (needsHeat && this.isHeatingNow(el))) {
                        if (typeof LabReactions !== 'undefined') {
                            LabReactions.apply(el, window.currentExp.effect);
                        }

                        // Hiển thị phương trình phản ứng
                        const eqDisplay = document.getElementById('equation-display');
                        if (eqDisplay && window.currentExp.eq) {
                            eqDisplay.innerText = window.currentExp.eq;
                            eqDisplay.style.display = "block";
                        }

                        this.speak("Đã xảy ra phản ứng: " + window.currentExp.effect, true);
                       
                        if (window.currentExp.description) {
                            this.delay(1500);
                            this.speak("Giải thích lý thuyết: " + window.currentExp.description, true);
                        }

                        el.dataset.reacted = "true";
                    }
                }
            }
        });
    },

    // Chuyển chất lỏng vào bình và cập nhật danh sách hóa chất
    transferWithLogic: function(targetEl, color, formula) {
        const targetLiq = targetEl.querySelector('.liquid-layer');
        if (targetLiq) {
            setTimeout(() => {
                const config = this.getConfig(targetEl.querySelector('img') ? targetEl.querySelector('img').alt : "");
                let currentH = parseFloat(targetLiq.style.height) || 0;
                targetLiq.style.height = Math.min(currentH + config.receiveHeight, 85) + "%";
                targetLiq.style.backgroundColor = color;

                let chems = targetEl.dataset.chemList ? targetEl.dataset.chemList.split(',') : [];
                const chemFormula = this.getFormulaByName(formula).toLowerCase();
                if (chemFormula && !chems.includes(chemFormula)) chems.push(chemFormula);

                targetEl.dataset.chemList = chems.join(',');
                this.checkAllGlobalReactions();
            }, 400);
        }
    },

    // Lấy công thức hóa học từ tên gọi
    getFormulaByName: function(name) {
        if (!name) return "";
        const cleanName = name.trim().toLowerCase();
        if (typeof chemicalDataRaw !== 'undefined') {
            const lines = chemicalDataRaw.trim().split('\n');
            for (let line of lines) {
                const p = line.split('|').map(s => s.trim());
                if (p[1] && p[1].toLowerCase() === cleanName) return p[3].toLowerCase();
            }
        }
        return cleanName;
    },

    // Lấy cấu hình hiển thị chất lỏng cho dụng cụ
    getConfig: function(name) {
        for (let key in this.toolConfigs) { 
            if (name.includes(key)) return this.toolConfigs[key]; 
        }
        return this.toolConfigs["Mặc định"];
    },

    // Thiết lập giao diện ban đầu cho dụng cụ (lớp chất lỏng, ngọn lửa...)
    renderExtra: function(container, toolName) {
        try {
            const config = this.getConfig(toolName);
            const liq = container.querySelector('.liquid-layer');
            if (liq) {
                Object.assign(liq.style, {
                    position: "absolute", bottom: config.bottom, width: config.width,
                    left: ((100 - parseFloat(config.width)) / 2) + "%",
                    borderRadius: config.radius, backgroundColor: "rgba(128, 128, 128, 0.5)",
                    height: "0%", zIndex: "1", display: "block", pointerEvents: "none"
                });
            }
            if (toolName.toLowerCase().includes("đèn cồn")) {
                if (!container.querySelector('.lamp-flame')) {
                    const flame = document.createElement('div');
                    flame.className = 'lamp-flame';
                    flame.style.display = "none";
                    container.appendChild(flame);
                }
            }
        } catch (e) { console.warn("Lỗi renderExtra:", toolName); }
    },

    // Kiểm tra va chạm giữa dụng cụ và bình/lọ
    checkToolCollision: function(toolEl, isReagentBottle = false) {
        const rect = toolEl.getBoundingClientRect();
        const toolCenterX = rect.left + rect.width / 2;
        const toolBottomY = rect.bottom;
        const selector = isReagentBottle ? '.reagent-bottle' : '.draggable-item';
        let found = null;

        document.querySelectorAll(selector).forEach(target => {
            if (target === toolEl) return;
            const tRect = target.getBoundingClientRect();

            if (!isReagentBottle) {
                const img = target.querySelector('img');
                if (!img || !this.allowedContainers.some(name => img.alt.includes(name))) return;
            }

            const thresholdX = isReagentBottle ? 90 : 120;
            const thresholdY = isReagentBottle ? 150 : 180;

            if (Math.abs(toolCenterX - (tRect.left + tRect.width / 2)) < thresholdX &&
                Math.abs(toolBottomY - tRect.top) < thresholdY) {
                found = target;
            }
        });
        return found;
    },

    // Tạo hiệu ứng giọt chất lỏng rơi
    createDropEffect: function(el, color) {
        const rect = el.getBoundingClientRect();
        const workbench = document.getElementById('workbench-area');
        if (!workbench) return;

        const drop = document.createElement('div');
        drop.className = 'drop-particle';
        drop.style.backgroundColor = color;
        drop.style.left = (rect.left + rect.width / 2 - 3) + "px";
        drop.style.top = (rect.bottom - 10) + "px";
        workbench.appendChild(drop);
        setTimeout(() => drop.remove(), 600);
    },

    // Lấy chuỗi hành động của dụng cụ từ dữ liệu
    getRawAction: function(name) {
        if (typeof toolCategoryData === 'undefined') return "không";
        const lines = toolCategoryData.trim().split('\n');
        const searchName = name.toLowerCase().replace(/\s+/g, '');
        for (let line of lines) {
            const p = line.split('|').map(s => s.trim());
            if (p[1].toLowerCase().replace(/\s+/g, '') === searchName) return p[4];
        }
        return "không";
    }
};

// Export ra global để các file khác sử dụng
window.LabActions = LabActions;
window.LiquidTransfer = LiquidTransfer;
window.SolidTransfer = SolidTransfer;