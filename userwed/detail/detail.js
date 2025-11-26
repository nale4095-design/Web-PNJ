// lấy giá trị của tham số id từ URL
function getId() {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}
async function getData() {
  let id = getId();
  try {

   let res = await axios.get(`http://localhost:3000/product/${id}`);
    let product = res.data;

    if (!product) return;

    // Render ảnh chính (mặc định)
    document.querySelector(".detail__img").innerHTML = `
      <img src="${product.img}" alt="Ảnh chính" width="300">
    `;

    // Render ảnh phụ
    renderNavImg(product);

    // Render thông tin sản phẩm
    document.querySelector(".detail__name").textContent = product.name;
    document.querySelector(".detail__price").textContent = `Giá: ${Number(product.price).toLocaleString()} VND`;
    document.querySelector(".detail__saleInfo").textContent = `Sale Info: ${product.saleInfo}`;
    document.querySelector(".detail__type").textContent = `Loại: ${product.type}`;

    // Render thông số chi tiết
    const ulParams = document.querySelector(".detail__params");
    ulParams.innerHTML = "";
    product.desPar.params.forEach(param => {
      const li = document.createElement("li");
      li.textContent = param;
      ulParams.appendChild(li);
    });

    // Render mô tả
    document.querySelector(".detail__desc").textContent = product.desPar.desc;

  } catch (err) {
    console.error("Lỗi khi load dữ liệu:", err);
  }
}

// Render ảnh phụ
function renderNavImg(product) {
  const navContainer = document.querySelector(".nav__img");
  navContainer.innerHTML = "";
  product.subImgs.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.width = 80;
    img.style.cursor = "pointer";
    img.style.marginRight = "5px";

    img.addEventListener("click", () => {
      console.log("Ảnh được click:", url);
      document.querySelector(".detail__img").innerHTML = `<img src="${url}" alt="Ảnh chính" width="300">`;
    });

    navContainer.appendChild(img);
  });
}

getData();

// lấy dữ lieeujtuwf local stotage
function getCarts() {
  let data = localStorage.getItem("cart")
  return data ? JSON.parse(data) : []
}

// luu dữ liệu vào local storgate
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// hàm adđtocats
function addToCart() {
  let Cart = getCarts()
  let id = getId()
  let newCart = {
    id: Date.now(),
    idProduct: id,
    qlty: 1
  };
  let findIndex = Cart.findIndex((item) => {
    return id == item.idProduct
  })

 if (findIndex === -1) {
  Cart.push(newCart); 
} else {
  Cart[findIndex].qlty++; 
}

  saveCart(Cart)
  //  console.log("Đã lưu giỏ hàng:", cart);
}
