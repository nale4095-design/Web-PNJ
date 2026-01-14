<?php
$conn = mysqli_connect("localhost", "root", "", "ql_admin");
if (!$conn) die("Lỗi kết nối CSDL");
mysqli_set_charset($conn, "utf8");

/* ĐƠN HÀNG GẦN ĐÂY */
$recent = mysqli_query($conn, "
    SELECT 
        dh.ma_don,
        kh.ten_kh,
        kh.email
    FROM donhang dh
    JOIN khachhang kh ON dh.ma_kh = kh.ma_kh
    ORDER BY dh.ma_don DESC
    LIMIT 5
");


/* ================== THỐNG KÊ ================== */
$doanhthu = mysqli_fetch_assoc(
    mysqli_query($conn,"
        SELECT IFNULL(SUM(so_tien),0) AS t 
        FROM thanhtoan 
        WHERE trang_thai='success'
    ")
)['t'];

$tongdon = mysqli_fetch_assoc(
    mysqli_query($conn,"SELECT COUNT(*) AS c FROM donhang")
)['c'];

$don_tc = mysqli_fetch_assoc(
    mysqli_query($conn,"
        SELECT COUNT(*) AS c 
        FROM donhang 
        WHERE trang_thai='success'
    ")
)['c'];

$khach = mysqli_fetch_assoc(
    mysqli_query($conn,"
        SELECT COUNT(*) AS c 
        FROM khachhang 
        WHERE trang_thai='active'
    ")
)['c'];

/* ================== GIAO DỊCH MỚI ================== */
$gd = mysqli_query($conn,"
    SELECT 
        dh.ma_don,
        kh.ten_kh,
        tt.ngay_gd,
        tt.so_tien,
        tt.trang_thai
    FROM thanhtoan tt
    JOIN donhang dh ON tt.ma_don = dh.ma_don
    JOIN khachhang kh ON dh.ma_kh = kh.ma_kh
    ORDER BY tt.ngay_gd DESC
    LIMIT 10
");

/* ================== BIỂU ĐỒ ================== */
$ngay = [];
$tien = [];

$q = mysqli_query($conn,"
    SELECT DATE(ngay_gd) d, SUM(so_tien) t
    FROM thanhtoan
    WHERE trang_thai='success'
    GROUP BY DATE(ngay_gd)
    ORDER BY d ASC
    LIMIT 7
");

while($r=mysqli_fetch_assoc($q)){
    $ngay[] = date('d/m', strtotime($r['d']));
    $tien[] = (int)$r['t'];
}
?>

<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dashboard</title>

<link rel="stylesheet" href="StyleAdmin.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
.dashboard-grid{
  display:grid;
  grid-template-columns:2fr 1fr;
  gap:16px;
  margin-bottom:20px;
}
.chart-wrap,.recent-box{
  background:#fff;
  padding:16px;
  border-radius:12px;
  box-shadow:var(--shadow);
}
.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  
  background: linear-gradient(135deg, #003A70, #0059a8);
  color: #fff;

  box-shadow: 0 6px 15px rgba(0, 58, 112, 0.25);
  transition: all 0.25s ease;
}

/* Hover */
.btn-logout:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #002f5d, #004b90);
  box-shadow: 0 10px 22px rgba(0, 58, 112, 0.35);
}

/* Click */
.btn-logout:active {
  transform: scale(0.96);
}

/* Mobile */
@media (max-width: 600px) {
  .btn-logout {
    padding: 7px 12px;
    font-size: 13px;
  }

}

/* ===== ĐƠN HÀNG GẦN ĐÂY ===== */
.recent-box h3{
  margin-bottom:14px;
  color:#003A70;
  font-weight:700;
}

.recent-item{
  display:flex;
  align-items:center;
  gap:12px;
  padding:10px 12px;
  border-radius:10px;
  transition:all .25s ease;
}

.recent-item:not(:last-child){
  margin-bottom:8px;
}

.recent-item:hover{
  background:#f7faff;
  transform:translateX(4px);
}

/* AVATAR */
.recent-item .avatar{
  width:42px;
  height:42px;
  border-radius:50%;
  background:linear-gradient(135deg,#CFA76E,#E8CFA0);
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:800;
  color:#04121b;
  font-size:16px;
  box-shadow:0 4px 10px rgba(0,0,0,.15);
}

/* TEXT */
.recent-item strong{
  display:block;
  font-size:14px;
  color:#04121b;
}

.recent-item small{
  font-size:12px;
  color:#6c7a89;
}


/* ===== HIỆU ỨNG HOVER DÒNG KHÁCH HÀNG ===== */
.table tbody tr {
  transition: all 0.25s ease;
  cursor: pointer;
}

.table tbody tr:hover {
  background: #f7faff;              /* nền xanh nhạt */
  transform: translateY(-2px);      /* nổi nhẹ */
  box-shadow: 0 6px 14px rgba(0,0,0,0.08);
}

/* viền nhấn bên trái */
.table tbody tr:hover td:first-child {
  border-left: 4px solid #003A70;   /* màu chủ đạo admin */
  padding-left: 12px;
}
</style>
</head>

<body>
<div class="container">

<!-- SIDEBAR -->
<aside class="sidebar">
  <nav class="sidebar-menu">
    <h4>DANH MỤC QUẢN LÝ</h4>
    <a class="active">Dashboard</a>
    <a href="QL.php">Quản lý sản phẩm</a>
    <a href="QLTT.php">Quản lý thanh toán</a>
    <a href="QLDH.php">Quản lý đơn hàng</a>
    <a href="QLKH.php">Quản lý khách hàng</a>
  </nav>
</aside>

<!-- MAIN -->
<main class="main">

<!-- TOPBAR -->
<header class="topbar">
  <div class="topbar-top">
    <div class="avatar-user">
      <div class="icon avatar">👤</div>
      <div class="user-info">NA</div>
    </div>

    <div class="topbar-icons">
      <a href="logout.php" class="btn-logout"
         onclick="return confirm('Bạn có chắc chắn muốn đăng xuất?')">
         Đăng xuất
      </a>
    </div>
  </div>
</header>

<!-- CARDS -->
<section class="cards">
  <div class="card">
    <div class="card-title">Doanh thu</div>
    <div class="card-value"><?= number_format($doanhthu,0,',','.') ?> VNĐ</div>
  </div>

  <div class="card">
    <div class="card-title">Đơn đặt hàng</div>
    <div class="card-value"><?= $tongdon ?></div>
  </div>

  <div class="card">
    <div class="card-title">Đơn đã bán</div>
    <div class="card-value"><?= $don_tc ?></div>
  </div>

  <div class="card">
    <div class="card-title">Khách hàng</div>
    <div class="card-value"><?= $khach ?></div>
  </div>
</section>

<!-- BIỂU ĐỒ + ĐƠN GẦN ĐÂY -->
<section class="dashboard-grid">
  <div class="chart-wrap">
    <h3>Doanh thu 7 ngày gần nhất</h3>
    <canvas id="chart"></canvas>
  </div>

  <div class="recent-box">
  <h3>Đơn hàng gần đây</h3>

  <?php if(mysqli_num_rows($recent) > 0): ?>
    <?php while($r = mysqli_fetch_assoc($recent)): ?>
      <div class="recent-item">
        <div class="avatar">
          <?= strtoupper(substr($r['ten_kh'], 0, 1)) ?>
        </div>
        <div>
          <strong><?= $r['ten_kh'] ?></strong><br>
          <small><?= $r['email'] ?></small>
        </div>
      </div>
    <?php endwhile; ?>
  <?php else: ?>
    <p style="color:#999">Chưa có đơn hàng</p>
  <?php endif; ?>

</div>

</section>

<!-- BẢNG GIAO DỊCH -->
<section class="table-wrap">
<h3 style="margin:10px 0">Giao dịch mới nhất</h3>
<table class="table">
<thead>
<tr>
  <th>Mã đơn</th>
  <th>Tên khách hàng</th>
  <th>Ngày</th>
  <th>Tổng thanh toán</th>
  <th>Trạng thái</th>
</tr>
</thead>
<tbody>
<?php while($row = mysqli_fetch_assoc($gd)) { ?>
<tr>
  <td><?= $row['ma_don'] ?></td>
  <td><?= $row['ten_kh'] ?></td>
  <td><?= date('d/m/Y', strtotime($row['ngay_gd'])) ?></td>
  <td><?= number_format($row['so_tien'],0,',','.') ?> VNĐ</td>
  <td><?= $row['trang_thai'] ?></td>
</tr>
<?php } ?>
</tbody>
</table>
</section>

</main>
</div>

<script>
new Chart(document.getElementById("chart"),{
  type:'bar',
  data:{
    labels:<?= json_encode($ngay) ?>,
    datasets:[{
      data:<?= json_encode($tien) ?>,
      backgroundColor:'#CFA76E',
      borderRadius:8
    }]
  },
  options:{plugins:{legend:{display:false}}}
});
</script>

</body>
</html>
