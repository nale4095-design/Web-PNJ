// Lấy giỏ hàng từ localStorage
let cart = (JSON.parse(localStorage.getItem("cart")) || [])
    .filter(item => item && item.id !== undefined && item.id !== null)
    .map(item => ({
        ...item,
        id: item.id.toString()
    }));

// Render giỏ hàng
function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems || !cartTotal) return;
    if(cart.length === 0){
        cartItems.innerHTML = "<p>Giỏ hàng trống!</p>";
        cartTotal.textContent = "0";
        return;
    }

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-img">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.price.toLocaleString()} đ</p>
            </div>
            <div class="quantity-control">
                <button class="decreaseBtn" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increaseBtn" data-id="${item.id}">+</button>
            </div>
            <button class="removeBtn" data-id="${item.id}">Xóa</button>
        `;
        cartItems.appendChild(div);
    });

    cartTotal.textContent = total.toLocaleString();
}

// Tăng/Giảm/Xóa sản phẩm
document.addEventListener("click", function(e){
    const btn = e.target.closest(".increaseBtn, .decreaseBtn, .removeBtn");
    if(!btn) return;

    const id = btn.dataset.id; // KHÔNG toString ở đây

    if(btn.classList.contains("increaseBtn")){
        cart = cart.map(item =>
            item.id === id ? {...item, quantity: item.quantity + 1} : item
        );
    }

    if(btn.classList.contains("decreaseBtn")){
        cart = cart.map(item =>
            item.id === id
                ? {...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1}
                : item
        );
    }

    if(btn.classList.contains("removeBtn")){
        cart = cart.filter(item => item.id !== id);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
});


// Lần đầu load trang
renderCart();
