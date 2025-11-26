// Hàm render các sản phẩm theo saleInfo hoặc keyword
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
        <a href="./userwed/detail/detail.html?id=${p.id}"target="_blank">
            <p>${p.name}</p>
        </a>
        <h5>${Number(p.price).toLocaleString()}₫</h5>
        <div class="review">5 sao - lượt bán</div>
        ${infoHTML}
    </div>
`;
    }).join("");

    // Init Owl Carousel
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

// Lấy dữ liệu và render tất cả section
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

// Gọi hàm khi DOM sẵn sàng
$(document).ready(function () {
    getData();
});