const API = "http://localhost:3000/product";

// Load sản phẩm
fetch(API)
    .then(res => res.json())
    .then(data => {
        console.log("Dữ liệu trả về:", data);
        render(data);
    })
    .catch(err => console.log("Lỗi API:", err));

// Render bảng
function render(list) {
    const tbody = document.getElementById("productBody");
    tbody.innerHTML = "";

    list.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td><img src="${item.img}" alt=""></td>
                <td>${item.price}</td>
                <td>
                 <button class="btn-edit" onclick="editProduct('${item.id}')">Sửa</button>
<button class="btn-delete" onclick="deleteProduct('${item.id}')">Xóa</button>

                </td>
            </tr>
        `;
    });
}

// Xóa sản phẩm
function deleteProduct(id) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    fetch(`${API}/${id}`, { method: "DELETE" })
        .then(() => location.reload());
}


// Sửa sản phẩm
function editProduct(id) {
    window.location.href = "../edit/edit.html?id=" + id;


}
