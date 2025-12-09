const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let product = null;
let quantity = 1;

// Lấy dữ liệu sản phẩm
fetch(`http://localhost:3000/product/${id}`)
    .then(res => res.json())
    .then(data => {
        product = data;

        document.getElementById("orderImg").src = product.img;
        document.getElementById("orderName").textContent = product.name;
        document.getElementById("orderPrice").textContent =
            Number(product.price).toLocaleString() + " ₫";

        updateTotal();
    });

// Cập nhật tổng tiền
function updateTotal() {
    document.getElementById("quantity").textContent = quantity;
    const total = product.price * quantity;
    document.getElementById("totalPrice").textContent =
        total.toLocaleString() + " ₫";
}

// Tăng giảm SL
document.getElementById("plusBtn").onclick = () => {
    quantity++;
    updateTotal();
};

document.getElementById("minusBtn").onclick = () => {
    if (quantity > 1) {
        quantity--;
        updateTotal();
    }
};

// Đặt hàng
function submitOrder() {
    const fullname = document.getElementById("fullname").value.trim();
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!fullname || !address || !email || !phone) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    alert("🎉 Đặt hàng thành công!");
}
