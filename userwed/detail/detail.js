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

// lấy dữ liệu từ  local stotage
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
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const orderBtn = document.getElementById("orderBtn");
    if (orderBtn) {
        orderBtn.href = `../order/order.html?id=${productId}`;
    }
});
// tho
document.getElementById("orderBtn").addEventListener("click", function (e) {
    e.preventDefault(); // chặn chuyển trang ngay lập tức
    
    alert("🎉 Đặt hàng thành công!");

    // chuyển trang sau khi OK
    window.location.href = "../order/order.html";
});
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
    alert("Không tìm thấy sản phẩm!");
    history.back();
}

fetch(`http://localhost:3000/product/${id}`)
    .then(res => res.json())
    .then(p => {
        document.getElementById("pImg").src = p.img;
        document.getElementById("pName").textContent = p.name;
        document.getElementById("pPrice").textContent = Number(p.price).toLocaleString() + "₫";

        // GẮN ID SẢN PHẨM CHO NÚT ĐẶT HÀNG
        document.getElementById("orderBtn").href = `../order/order.html?id=${id}`;
    })
    .catch(err => console.error("Lỗi tải sản phẩm:", err));

    // giỏ hang
    function addToCart() {
    const product = {
        id: p.id,                 // ID sản phẩm
        name: p.name,             // Tên
        img: p.img,               // Ảnh
        price: p.price,           // Giá
        qty: 1                    // Mặc định 1 sản phẩm
    };

    // Lấy giỏ hàng hiện tại
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra nếu sản phẩm đã tồn tại → tăng số lượng
    const index = cart.findIndex(item => item.id === product.id);
    if (index !== -1) {
        cart[index].qty++;
    } else {
        cart.push(product);
    }

    // Lưu vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Popup thông báo
    alert("✔ Đã thêm vào giỏ hàng!");

    // KHÔNG chuyển trang
}
