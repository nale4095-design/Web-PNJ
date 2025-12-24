// Lấy id sản phẩm trên URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
    alert("Không tìm thấy sản phẩm!");
}

// Fetch sản phẩm từ JSON Server
fetch(`http://localhost:3000/product/${productId}`)
    .then(res => res.json())
    .then(product => renderOrder(product))
    .catch(() => alert("Không thể lấy dữ liệu sản phẩm"));


// Hiển thị sản phẩm
function renderOrder(p) {
    document.getElementById("productImg").src = p.img;
    document.getElementById("productName").textContent = p.name;
    document.getElementById("productPrice").textContent = Number(p.price).toLocaleString();

    const qtyInput = document.getElementById("qty");
    const totalEl = document.getElementById("total");

    function updateTotal() {
        totalEl.textContent = (p.price * qtyInput.value).toLocaleString();
    }

    qtyInput.addEventListener("input", updateTotal);
    updateTotal();
}
