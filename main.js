/************************************************
 * BIẾN TOÀN CỤC
 ************************************************/
const searchInput = document.getElementById("searchInput");
const searchBox = document.querySelector(".search-result");

searchInput.addEventListener("input", function () {
    const keyword = this.value.trim().toLowerCase();

    if (!keyword) {
        searchBox.innerHTML = "";
        return;
    }

    const results = allProducts.filter(p =>
        p.name.toLowerCase().includes(keyword)
    );

    if (results.length === 0) {
        searchBox.innerHTML = "<p style='padding:10px'>Không tìm thấy sản phẩm</p>";
        return;
    }

    searchBox.innerHTML = results.map(p => `
        <a href="./userwed/detail/detail.html?id=${p.id}" class="search-item">
            <img src="${p.img}" alt="${p.name}">
            <div class="search-info">
                <h4>${p.name}</h4>
                <p>${Number(p.price).toLocaleString()}₫</p>
            </div>
        </a>
    `).join("");
});


/************************************************
 * HÀM RENDER CAROUSEL (GIỮ NGUYÊN)
 ************************************************/
function renderCarousel(allProducts, selector, filterKeyword, isKeyword = false, itemsCount = 4) {
    const container = document.querySelector(selector);
    if (!container) {
        console.error("Không tìm thấy selector:", selector);
        return;
    }

    let filtered;
    if (isKeyword) {
        filtered = allProducts.filter(p =>
            p.name.toLowerCase().includes(filterKeyword.toLowerCase())
        );
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
            infoHTML = `
                <div class="diamond-info">
                    <ul>${paramsHTML}</ul>
                    <p>${p.desPar.desc}</p>
                </div>`;
        }

        return `
            <div class="item_carosel">
                <img src="${p.img}" alt="${p.name}">
                <a href="./userwed/detail/detail.html?id=${p.id}" target="_blank">
                    <p>${p.name}</p>
                </a>
                <h5>${Number(p.price).toLocaleString()}₫</h5>
                <div class="review">5 sao - lượt bán</div>
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

/************************************************
 * FETCH DATA & RENDER SECTION
 ************************************************/
async function getData() {
    try {
        const res = await axios.get("http://localhost:3000/product");

        allProducts = res.data; // 🔥 SỬA DÒNG NÀY

        console.log("ALL PRODUCTS:", allProducts);

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




/************************************************
 * INIT
 ************************************************/
$(document).ready(function () {
    getData();
  

});
