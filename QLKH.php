<?php
$conn = mysqli_connect("localhost", "root", "", "ql_admin");
if (!$conn) {
    die("Lỗi kết nối CSDL");
}
mysqli_set_charset($conn, "utf8");

/* ================== XUẤT CSV ================== */
if (isset($_GET['export']) && $_GET['export'] === 'csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=khachhang.csv');

    $output = fopen("php://output", "w");
    fputcsv($output, ['Tên KH', 'Email', 'SDT', 'Ngày tạo', 'Số đơn', 'Tổng chi tiêu']);

    $q = mysqli_query($conn, "
    SELECT 
        kh.ten_kh,
        kh.email,
        kh.sdt,
        kh.ngay_tao,
        COUNT(dh.ma_don) AS so_don_hang,
        IFNULL(SUM(dh.tong_tien),0) AS tong_chi_tieu
    FROM khachhang kh
    LEFT JOIN donhang dh ON kh.ma_kh = dh.ma_kh
    GROUP BY kh.ma_kh
");
    while ($row = mysqli_fetch_assoc($q)) {
        fputcsv($output, [
            $row['ten_kh'],
            $row['email'],
            $row['sdt'],
            $row['ngay_tao'],
            $row['so_don_hang'],
            $row['tong_chi_tieu']
        ]);
    }
    fclose($output);
    exit;
}

/* ================== KHÓA / MỞ KHÓA KHÁCH HÀNG ================== */
if (isset($_GET['action'], $_GET['id'])) {
  $id = (int)$_GET['id'];

  if ($_GET['action'] === 'lock') {
      mysqli_query($conn, "UPDATE khachhang SET trang_thai='inactive' WHERE ma_kh=$id");
  }

  if ($_GET['action'] === 'unlock') {
      mysqli_query($conn, "UPDATE khachhang SET trang_thai='active' WHERE ma_kh=$id");
  }


  header("Location: QLKH.php");
  exit;
}


/* ================== LOAD TRANG BÌNH THƯỜNG ================== */
$where = [];

/* ===== TÌM KIẾM ===== */
if (!empty($_GET['keyword'])) {
    $keyword = mysqli_real_escape_string($conn, $_GET['keyword']);
    $where[] = "(ten_kh LIKE '%$keyword%' 
              OR email LIKE '%$keyword%' 
              OR sdt LIKE '%$keyword%')";
}

/* ===== LỌC TRẠNG THÁI ===== */
if (isset($_GET['status']) && $_GET['status'] !== '') {
  $st = $_GET['status'] == '1' ? 'active' : 'inactive';
  $where[] = "kh.trang_thai = '$st'";
}

/* ===== LỌC TỪ NGÀY ===== */
if (!empty($_GET['from_date'])) {
    $from = $_GET['from_date'];
    $where[] = "DATE(ngay_dangky) >= '$from'";
}

/* ===== LỌC ĐẾN NGÀY ===== */
if (!empty($_GET['to_date'])) {
    $to = $_GET['to_date'];
    $where[] = "DATE(ngay_dangky) <= '$to'";
}

/* ===== GHÉP SQL ===== */
$where_sql = '';
if (!empty($where)) {
    $where_sql = 'WHERE ' . implode(' AND ', $where);
}

$sql = "
SELECT 
  kh.ma_kh,
  kh.ten_kh,
  kh.email,
  kh.sdt,
  kh.trang_thai,
  kh.ngay_tao,
  COUNT(dh.ma_don) AS so_don_hang,
  IFNULL(SUM(dh.tong_tien),0) AS tong_chi_tieu
FROM khachhang kh
LEFT JOIN donhang dh ON kh.ma_kh = dh.ma_kh
$where_sql
GROUP BY kh.ma_kh
ORDER BY kh.ngay_tao DESC
";
$result = mysqli_query($conn, $sql);



?>

<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Quản lý khách hàng</title>
  <link rel="stylesheet" href="StyleAdmin.css">

  <style>
    .btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  /* GIỐNG NÚT XUẤT CSV */
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
        <a href="QLDH.php">Quản lý đơn hàng</a>
        <a href="QLKH.php" class="active">Quản lý khách hàng</a>
      </nav>
    </div>
    <div class="sidebar-bottom">
      <small>© 2025 • Hệ thống admin</small>
    </div>
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

        <a href="logout.php" class="btn-logout" onclick="return confirm('Bạn có chắc chắn muốn đăng xuất?')"> Đăng xuất</a>

        </div>
      </div>

      <div class="topbar-bottom">
        <div class="search-box">
        <form method="GET">
  <input 
    type="text" 
    name="keyword"
    placeholder="🔍 Tìm khách hàng theo tên, email, sđt..."
    value="<?= isset($_GET['keyword']) ? htmlspecialchars($_GET['keyword']) : '' ?>"
  />
</form>

        </div>
      </div>
    </header>

    <!-- FILTER -->
    <section class="controls">
  <form method="GET">
    <div class="filter-row">
      <select name="status">
        <option value="">-- Tất cả trạng thái --</option>
        <option value="1" <?= (($_GET['status'] ?? '') === '1') ? 'selected' : '' ?>>Hoạt động</option>
        <option value="0" <?= (($_GET['status'] ?? '') === '0') ? 'selected' : '' ?>>Bị khóa</option>
      </select>

      <input type="date" name="from_date" value="<?= $_GET['from_date'] ?? '' ?>">
      <input type="date" name="to_date" value="<?= $_GET['to_date'] ?? '' ?>">

      <button type="submit" class="btn-pnj">Lọc</button>
      <a href="QLKH.php" class="btn">Làm mới</a>
    </div>
  </form>

  <div class="action-row">
    <a href="?export=csv" class="btn-export">Xuất CSV</a>
  </div>
</section>


    <!-- TABLE -->
    <section class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Tên khách hàng</th>
            <th>Email</th>
            <th>SDT</th>
            <th>Ngày đăng kí</th>
            <th>Số lượng đã đặt</th>
            <th>Tổng chi tiêu</th>
            <th>Trạng thái</th>
            <th>Hành động</th>

          </tr>
        </thead>
        <tbody>
<?php if(mysqli_num_rows($result) > 0): ?>
  <?php while($row = mysqli_fetch_assoc($result)): ?>
    <tr>
  <td><?= $row['ten_kh'] ?></td>
  <td><?= $row['email'] ?></td>
  <td><?= $row['sdt'] ?></td>
  <td><?= date('d/m/Y', strtotime($row['ngay_tao'])) ?></td>
  <td><?= $row['so_don_hang'] ?></td>
  <td><?= number_format($row['tong_chi_tieu'], 0, ',', '.') ?>đ</td>

  <!-- TRẠNG THÁI -->
  <td>
<?php
if ($row['trang_thai'] == 'inactive') {
    echo '<span style="color:red;font-weight:600">Bị khóa</span>';
} else {
    echo '<span style="color:green;font-weight:600">Hoạt động</span>';
}
?>
</td>

  <!-- HÀNH ĐỘNG -->
  <td>
<?php
if ($row['trang_thai'] == 'inactive') {
    echo '<a href="?action=unlock&id='.$row['ma_kh'].'"
        onclick="return confirm(\'Mở khóa khách hàng này?\')"
        style="color:#2e7d32;font-weight:600">
        Mở khóa
    </a>';
} else {
    echo '<a href="?action=lock&id='.$row['ma_kh'].'"
        onclick="return confirm(\'Khóa khách hàng này?\')"
        style="color:red;font-weight:600">
        Khóa
    </a>';
}
?>
</tr>

  <?php endwhile; ?>
<?php else: ?>
  <tr>
    <td colspan="6" style="text-align:center">Chưa có dữ liệu</td>
  </tr>
<?php endif; ?>
</tbody>

      </table>
    </section>

  </main>
</div>

</body>
</html>
