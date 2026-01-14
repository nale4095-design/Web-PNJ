<?php
$conn = mysqli_connect("localhost", "root", "", "ql_admin");
if (!$conn) die("Lỗi kết nối CSDL");
mysqli_set_charset($conn, "utf8");

/* ================== XUẤT CSV ================== */
if (isset($_GET['export']) && $_GET['export'] === 'csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=donhang.csv');

    $out = fopen("php://output", "w");
    fputcsv($out, ['Mã đơn', 'Tên KH', 'Số lượng', 'Tổng tiền', 'Trạng thái', 'Ngày đặt']);

    $q = mysqli_query($conn, "
        SELECT dh.ma_don, kh.ten_kh, dh.so_luong, dh.tong_tien, dh.trang_thai, dh.ngay_don
        FROM donhang dh
        JOIN khachhang kh ON dh.ma_kh = kh.ma_kh
        ORDER BY dh.ngay_don DESC
    ");

    while ($r = mysqli_fetch_assoc($q)) {
        fputcsv($out, [
            $r['ma_don'],
            $r['ten_kh'],
            $r['so_luong'],
            $r['tong_tien'],
            $r['trang_thai'],
            $r['ngay_don']
        ]);
    }
    fclose($out);
    exit;
}

/* ================== BUILD FILTER ================== */
$where = [];

if (!empty($_GET['keyword'])) {
    $kw = mysqli_real_escape_string($conn, $_GET['keyword']);
    $where[] = "(dh.ma_don LIKE '%$kw%' OR kh.ten_kh LIKE '%$kw%')";
}

if (!empty($_GET['status'])) {
    $st = mysqli_real_escape_string($conn, $_GET['status']);
    $where[] = "dh.trang_thai = '$st'";
}

if (!empty($_GET['from'])) {
    $from = $_GET['from'];
    $where[] = "DATE(dh.ngay_dat) >= '$from'";
}

if (!empty($_GET['to'])) {
    $to = $_GET['to'];
    $where[] = "DATE(dh.ngay_dat) <= '$to'";
}

$where_sql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

/* ================== DANH SÁCH ĐƠN ================== */
$sql = "
SELECT 
  dh.ma_don,
  kh.ten_kh,
  dh.so_luong,
  dh.tong_tien,
  dh.trang_thai,
  dh.ngay_dat
FROM donhang dh
JOIN khachhang kh ON dh.ma_kh = kh.ma_kh
$where_sql
ORDER BY dh.ngay_dat DESC
";
$result = mysqli_query($conn, $sql);

/* ================== THỐNG KÊ ================== */
$total = mysqli_fetch_assoc(mysqli_query($conn,
    "SELECT COUNT(*) c FROM donhang"))['c'];

$pending = mysqli_fetch_assoc(mysqli_query($conn,
    "SELECT COUNT(*) c FROM donhang WHERE trang_thai='pending'"))['c'];

$success = mysqli_fetch_assoc(mysqli_query($conn,
    "SELECT COUNT(*) c FROM donhang WHERE trang_thai='success'"))['c'];

$fail = mysqli_fetch_assoc(mysqli_query($conn,
    "SELECT COUNT(*) c FROM donhang WHERE trang_thai='fail'"))['c'];
?>

<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Quản lý đơn hàng</title>
<link rel="stylesheet" href="StyleAdmin.css">
<style>
  .status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.status.success {
  background: #e6f7f0;
  color: #0a8f5b;
}

.status.pending {
  background: #fff4e5;
  color: #d48806;
}

.status.fail {
  background: #fdecea;
  color: #cf1322;
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


/* ===== NÚT XUẤT CSV ===== */
.btn-export {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #003A70, #0059a8);
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0, 58, 112, 0.25);
  transition: all 0.25s ease;
}

.btn-export i {
  font-style: normal;
  font-size: 16px;
}

/* Hover */
.btn-export:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 58, 112, 0.35);
  background: linear-gradient(135deg, #002f5d, #004b90);
}

/* Click */
.btn-export:active {
  transform: scale(0.96);
}

/* Mobile */
@media (max-width: 600px) {
  .btn-export {
    padding: 9px 14px;
    font-size: 13px;
  }
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
    <div class="sidebar-top">
      <nav class="sidebar-menu">
        <h4>DANH MỤC QUẢN LÝ</h4>
        <a href="Dashboard.php">Dashboard</a>
        <a href="QL.php">Quản lý sản phẩm</a>
        <a href="QLTT.php">Quản lý thanh toán</a>
        <a href="QLDH.php" class="active">Quản lý đơn hàng</a>
        <a href="QLKH.php">Quản lý khách hàng</a>
      </nav>
    </div>
    <div class="sidebar-bottom">
      <small>© 2025 • Hệ thống admin</small>
    </div>
  </aside>

  <main class="main">

<!-- TOPBAR -->
<header class="topbar">

  <!-- TOP -->
  <div class="topbar-top">
    <div class="avatar-user">
      <div class="icon avatar">👤</div>
      <div class="user-info">NA</div>
    </div>

    <div class="topbar-icons">
      <a href="logout.php"
         class="btn-logout"
         onclick="return confirm('Bạn có chắc chắn muốn đăng xuất?')">
        Đăng xuất
      </a>
    </div>
  </div>

  <!-- BOTTOM -->
  <div class="topbar-bottom">
    <form method="GET" class="search-box">
      <input
        type="text"
        name="keyword"
        placeholder="🔍 Tìm mã GD, mã đơn, tên khách..."
        value="<?= isset($_GET['keyword']) ? htmlspecialchars($_GET['keyword']) : '' ?>"
      />
    </form>
  </div>
    </header>

    <section class="cards">
  <div class="card"><div class="card-title">Tổng đơn</div><div class="card-value"><?= $total ?></div></div>
  <div class="card"><div class="card-title">Đang xử lý</div><div class="card-value pending"><?= $pending ?></div></div>
  <div class="card"><div class="card-title">Hoàn thành</div><div class="card-value success"><?= $success ?></div></div>
  <div class="card"><div class="card-title">Hủy</div><div class="card-value fail"><?= $fail ?></div></div>
</section>


    <section class="controls">
    <form method="GET">
  <select name="status">
    <option value="">-- Tất cả trạng thái --</option>
    <option value="success" <?= ($_GET['status'] ?? '')=='success'?'selected':'' ?>>Hoàn thành</option>
    <option value="pending" <?= ($_GET['status'] ?? '')=='pending'?'selected':'' ?>>Đang xử lý</option>
    <option value="fail" <?= ($_GET['status'] ?? '')=='fail'?'selected':'' ?>>Hủy</option>
  </select>

  <input type="date" name="from_date" value="<?= $_GET['from_date'] ?? '' ?>">
  <input type="date" name="to_date" value="<?= $_GET['to_date'] ?? '' ?>">

  <button class="btn-pnj">Lọc</button>
  <a href="QLDH.php" class="btn">Làm mới</a>
</form>

<a href="?export=csv" class="btn-export">Xuất CSV</a>

    </section>

    <section class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Tên khách hàng</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày đặt</th>
          </tr>
        </thead>
        <tbody>
<?php if (mysqli_num_rows($result) > 0): ?>
  <?php while ($row = mysqli_fetch_assoc($result)): ?>
    <tr>
      <td><?= $row['ma_don'] ?></td>
      <td><?= htmlspecialchars($row['ten_kh']) ?></td>
      <td style="text-align:center"><?= $row['so_luong'] ?></td>
      <td><?= number_format($row['tong_tien'], 0, ',', '.') ?> đ</td>
      <td>
        <span class="status <?= $row['trang_thai'] ?>">
          <?= ucfirst($row['trang_thai']) ?>
        </span>
      </td>
      <td><?= date('d/m/Y H:i', strtotime($row['ngay_dat'])) ?></td>
      
    </tr>
  <?php endwhile; ?>
<?php else: ?>
  <tr>
    <td colspan="7" style="text-align:center;color:#999">
      Không có đơn hàng nào
    </td>
  </tr>
<?php endif; ?>
</tbody>


        
      </table>
    </section>
  </main>
</div>
</body>
</html>
