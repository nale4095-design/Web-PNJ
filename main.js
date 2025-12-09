// =========================
// 1. Cập nhật số lượng giỏ hàng
// =========================
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) cartCountEl.textContent = total;
}

// chạy khi mở trang
updateCartCount();


// =========================
// 2. Xử lý THÊM VÀO GIỎ HÀNG
// =========================
document.addEventListener("click", function (e) {

    // Nếu bấm vào icon hoặc text bên trong nút → lấy button cha
    const btn = e.target.closest(".addToCartBtn");
    if (!btn) return;

    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);
    const img = btn.dataset.img;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let find = cart.find(p => p.id === id);

    if (find) {
        find.quantity++;
    } else {
        cart.push({
            id, name, price, img, quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    alert("Đã thêm vào giỏ hàng!");
});


// =========================
// 3. Render Carousel sản phẩm
// =========================
function renderCarousel(allProducts, selector, filterKeyword, isKeyword = false, itemsCount = 4) {
    const container = document.querySelector(selector);
    if (!container) {
        console.error("Không tìm thấy selector:", selector);
        return;
    }

    let filtered;
    if (isKeyword) {
        filtered = allProducts.filter(p => p.name.toLowerCase().includes(filterKeyword.toLowerCase()));
    } else {
        filtered = allProducts.filter(p =>
            (p.saleInfo || "").trim().toLowerCase().includes(filterKeyword.toLowerCase())
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = "<p>Không có sản phẩm</p>";
        return;
    }

    container.innerHTML = filtered.map(p => {
        let infoHTML = "";
        if (filterKeyword.toLowerCase() === "diamond" && p.desPar) {
            const paramsHTML = p.desPar.params.map(param => `<li>${param}</li>`).join("");
            infoHTML = `<div class="diamond-info"><ul>${paramsHTML}</ul><p>${p.desPar.desc}</p></div>`;
        }

        return `
        <div class="item_carosel">
            <img src="${p.img}" alt="${p.name}">
            <a href="./userwed/detail/detail.html?id=${p.id}" target="_blank">
                <p>${p.name}</p>
            </a>
            <h5>${Number(p.price).toLocaleString()}₫</h5>
            <div class="review">5 sao - lượt bán</div>

            <button class="addToCartBtn"
                    data-id="${p.id}"
                    data-name="${p.name}"
                    data-price="${p.price}"
                    data-img="${p.img}">
                Thêm vào giỏ
            </button>

            ${infoHTML}
        </div>
        `;
    }).join("");

    $(selector).owlCarousel({
        loop: true,
        margin: 10,
        nav: true,

        responsive: {
            0: { items: 1 },
            600: { items: Math.min(2, itemsCount) },
            1000: { items: itemsCount }
        }
    });
}


// =========================
// 4. Lấy dữ liệu và render
// =========================
async function getData() {
    try {
        const res = await axios.get("http://localhost:3000/product");
        const allProducts = res.data;

        renderCarousel(allProducts, ".topProduct__content", "bestSaler");
        renderCarousel(allProducts, ".newCollection__carosel", "newCollection", false, 3);
        renderCarousel(allProducts, ".diamond__carosel", "diamond");
        renderCarousel(allProducts, ".ECZ__carosel", "ECZ");
        renderCarousel(allProducts, ".necklace__owl-carousel", "necklace");
        renderCarousel(allProducts, ".pearl__owl-carousel", "pearl");
        renderCarousel(allProducts, ".wedding__owl-carousel", "married");
        renderCarousel(allProducts, ".shui__owl-carousel", "shui");
        renderCarousel(allProducts, ".Disney__owl-carousel", "Disney");
        renderCarousel(allProducts, ".PNJ__owl-carousel", "PNJ");
        renderCarousel(allProducts, ".Watch__owl-carousel", "Watch");

    } catch (err) {
        console.error("Lỗi load dữ liệu:", err);
    }
}


// =========================
// 5. Chuyển sang trang giỏ hàng
// =========================
$(document).ready(function () {
    getData();
});

// CHỈ GẮN SỰ KIỆN NẾU CÓ NÚT .btn-cart
const btnCart = document.querySelector(".btn-cart");
if (btnCart) {
    btnCart.addEventListener("click", function () {
        window.location.href = "cart.html";
    });
}
