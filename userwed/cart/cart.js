const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Lấy dữ liệu từ JSON Server
fetch(`http://localhost:3000/product?id=${id}`)
    .then(res => res.json())
    .then(data => {

        const p = data[0];

        document.getElementById("pImg").src = p.img;
        document.getElementById("pName").textContent = p.name;
        document.getElementById("pPrice").textContent = Number(p.price).toLocaleString() + "₫";

    });

// Chuyển sang trang Order
function goOrder() {
    window.location.href = `../order/order.html?id=${id}`;
}
