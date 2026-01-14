// ===============================
// 1. Lấy dữ liệu
// ===============================
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const cart = JSON.parse(localStorage.getItem("cart")) || [];

const box = document.getElementById("orderBox");
const totalEl = document.getElementById("total");

// ===============================
// 2. MUA 1 SẢN PHẨM
// ===============================
if (productId) {
    fetch(`http://localhost:3000/product/${productId}`)
        .then(res => res.json())
        .then(p => renderSingle(p))
        .catch(() => alert("Không tìm thấy sản phẩm"));
}

// ===============================
// 3. THANH TOÁN TỪ GIỎ HÀNG
// ===============================
else if (cart.length > 0) {
    renderCart(cart);
}

// ===============================
// 4. KHÔNG CÓ DỮ LIỆU
// ===============================
else {
    alert("Không có sản phẩm để thanh toán");
    location.href = "../cart/cart.html";
}

// ===============================
// 5. RENDER 1 SẢN PHẨM
// ===============================
function renderSingle(p) {
    box.innerHTML = `
        <img src="${p.img}" width="120">
        <div class="info">
            <p><b>${p.name}</b></p>
            <p>Đơn giá: ${Number(p.price).toLocaleString()} ₫</p>
            <p>Số lượng: <input type="number" id="qty" value="1" min="1"></p>
            <p>Tổng: <span id="total">${p.price.toLocaleString()}</span> ₫</p>
        </div>
    `;

    const qty = document.getElementById("qty");
    qty.addEventListener("input", () => {
        totalEl.innerText = (p.price * qty.value).toLocaleString();
    });
}

// ===============================
// 6. RENDER TỪ GIỎ HÀNG
// ===============================
function renderCart(cart) {
    let total = 0;
    box.innerHTML = "";

    cart.forEach(item => {
        total += item.price * item.quantity;

        box.innerHTML += `
            <div class="order-item">
                <img src="${item.img}" width="80">
                <div>
                    <p><b>${item.name}</b></p>
                    <p>Số lượng: ${item.quantity}</p>
                    <p>${item.price.toLocaleString()} ₫</p>
                </div>
            </div>
        `;
    });

    totalEl.innerText = total.toLocaleString();
}

// ===============================
// 7. VALIDATE + ĐẶT HÀNG
// ===============================
document.querySelector(".submit-btn").addEventListener("click", () => {
    const name = customerName.value.trim();
    const address = customerAddress.value.trim();
    const email = customerEmail.value.trim();
    const phone = customerPhone.value.trim();

    if (!name || !address || !email || !phone) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    alert("🎉 Đặt hàng thành công!");

    // Sau khi đặt → xóa giỏ hàng
    localStorage.removeItem("cart");
    location.href = "../index.html";
});
