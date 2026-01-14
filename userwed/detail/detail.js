
// 1. Lấy ID từ URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
    alert("Không tìm thấy sản phẩm!");
    history.back();
}

// =========================
// 2. Load dữ liệu sản phẩm
// =========================
async function loadProduct() {
    try {
      const res = await axios.get(`http://localhost:3000/product/${productId}`);

        const p = res.data;

        // Ảnh chính
        document.querySelector(".detail__img").innerHTML = `<img src="${p.img}" width="300">`;

        // Ảnh phụ
        renderSubImages(p);

        // Thông tin
        document.querySelector(".detail__name").textContent = p.name;
        document.querySelector(".detail__price").textContent = Number(p.price).toLocaleString() + "₫";
        document.querySelector(".detail__saleInfo").textContent = p.saleInfo;
        document.querySelector(".detail__type").textContent = p.type;

        // Thông số
        const ul = document.querySelector(".detail__params");
        ul.innerHTML = "";
        p.desPar.params.forEach(item => {
            let li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);
        });

        // Mô tả
        document.querySelector(".detail__desc").textContent = p.desPar.desc;

        // Gán data cho nút Thêm vào giỏ
        const addBtn = document.getElementById("addToCartBtn");
        if (addBtn) {
            addBtn.dataset.id = p.id;
            addBtn.dataset.name = p.name;
            addBtn.dataset.price = p.price;
            addBtn.dataset.img = p.img;
        }

        // Gắn nút Order
        const orderBtn = document.getElementById("orderBtn");
        if (orderBtn) {
            orderBtn.href = `../order/order.html?id=${p.id}`;
        }

    } catch (err) {
        console.error("Lỗi load sản phẩm:", err);
    }
}

// =========================
// 3. Render ảnh phụ
// =========================
function renderSubImages(product) {
    const nav = document.querySelector(".nav__img");
    nav.innerHTML = "";
    product.subImgs.forEach(url => {
        let img = document.createElement("img");
        img.src = url;
        img.width = 80;
        img.style.cursor = "pointer";
        img.onclick = () => {
            document.querySelector(".detail__img").innerHTML = `<img src="${url}" width="300">`;
        };
        nav.appendChild(img);
    });
}

// ==========================
// 4. Thêm vào giỏ hàng (chỉ 1 listener)
// ==========================
document.addEventListener("click", function(e){
    const btn = e.target.closest("#addToCartBtn");
    if(!btn) return;

    const id = btn.dataset.id.toString(); // nhất quán string
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);
    const img = btn.dataset.img;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(p => p.id === id);

    if(item){
        item.quantity++;
    } else {
        cart.push({id, name, price, img, quantity:1});
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    if(typeof updateCartCount === "function") updateCartCount();
    alert("✔ Đã thêm vào giỏ hàng!");
});


// =========================
// 6. Load sản phẩm
// =========================
loadProduct();
