<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Dashboard - Win Town</title>

<!-- Bootstrap CSS (CDN) -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

  <!-- Font Awesome (for icons) -->
  <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <link href="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/style.min.css" rel="stylesheet" />
  <link href="bootstrap/css/styles.css" rel="stylesheet" />
  
  <!-- Tabulator CSS -->
  <link href="/css/styles.css" rel="stylesheet">
  <link href="css/tabulator.min.css" rel="stylesheet">
  <!-- Tabulator JS UMD đầy đủ -->
  <script src="js/tabulator.min.js"></script>

  <script src="js/Salary.js"></script>

  <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>

  <style>
     /* Card visual */
    .card {
      border-radius: 12px;
      overflow: hidden;
      border: 0;
    }
    .card .card-header {
      font-weight: 700;
    }
    /* Make carousel images crop nicely */
    .card img {
      width: 100%;
      max-height: 250px;
      object-fit: cover;
      display: block;
    }
    /* smaller controls so they don't dominate */
    .carousel-control-prev-icon,
    .carousel-control-next-icon {
      width: 2rem;
      height: 2rem;
      background-size: 2rem 2rem;
    }
  
    main.container-fluid {
      padding-top: 24px;
      padding-bottom: 24px;
    }
    :root {
      --primary-color: #2c52ed;
      --secondary-color: #6c757d;
      --success-color: #1cc88a;
      --info-color: #36b9cc;
      --warning-color: #f6c23e;
      --danger-color: #e74a3b;
      --dark-bg: #212529;
      --sidebar-width: 250px;
      --sidebar-collapsed-width: 80px;
      --transition-speed: 0.3s;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Poppins', sans-serif;
            background: linear-gradient(180deg, var(--dark-bg) 0%, #132633ff 100%);

      overflow-x: hidden;
      transition: all var(--transition-speed) ease;
    }

    /* Top Navigation */
    .sb-topnav {
      background: linear-gradient(90deg, var(--dark-bg) 0%, #1b2436ff 100%);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      z-index: 1030;
      padding: 0;
      transition: all var(--transition-speed) ease;
    }

    .sb-topnav .navbar-brand {
      font-weight: 600;
      color: white;
      padding: 1rem 1.5rem;
      transition: all var(--transition-speed) ease;
    }

    .sb-topnav .navbar-brand i {
      margin-right: 10px;
      color: var(--primary-color);
    }

    #sidebarToggle {
      color: white;
      border: none;
      background: transparent;
      font-size: 1.2rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all var(--transition-speed) ease;
    }

    #sidebarToggle:hover {
      color: var(--primary-color);
      transform: rotate(90deg);
    }

    /* Search Form */
    .sb-topnav .form-inline {
      padding: 0.5rem 0;
    }

    .sb-topnav .input-group {
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .sb-topnav .form-control {
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      padding: 0.5rem 1rem;
    }

    .sb-topnav .form-control::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .sb-topnav .btn {
      background: var(--primary-color);
      border: none;
      padding: 0.5rem 1rem;
    }

    /* User Dropdown */
    .sb-topnav .navbar-nav .nav-link {
      color: white;
      padding: 1rem;
      transition: all 0.2s ease;
    }

    .sb-topnav .navbar-nav .nav-link:hover {
      color: var(--primary-color);
    }

    .sb-topnav .dropdown-menu {
      border: none;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      padding: 0.5rem;
    }

    .sb-topnav .dropdown-item {
      padding: 0.5rem 1rem;
      border-radius: 5px;
      transition: all 0.2s ease;
    }

    .sb-topnav .dropdown-item:hover {
      background-color: var(--dark-bg);
    }

    /* Sidebar */
    #layoutSidenav {
      display: flex;
      position: relative;
    }

    #layoutSidenav_nav {
      position: fixed;
      top: 56px;
      left: 0;
      height: calc(100vh - 56px);
      width: var(--sidebar-width);
      z-index: 1020;
      transition: all var(--transition-speed) ease;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .sb-sidenav {
      background: linear-gradient(180deg, var(--dark-bg) 0%, #2c3e50 100%);
      height: 100%;
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      transition: all var(--transition-speed) ease;
    }

    .sb-sidenav-menu {
      flex-grow: 1;
    }

    .sb-sidenav-menu-heading {
      color: rgba(255, 255, 255, 0.6);
      padding: 1rem 1.5rem 0.5rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all var(--transition-speed) ease;
    }

    .sb-sidenav .nav {
      flex-direction: column;
    }

    .sb-sidenav .nav-link {
      color: rgba(255, 255, 255, 0.8);
      padding: 0.75rem 1.5rem;
      position: relative;
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
    }

    .sb-sidenav .nav-link:hover {
      color: white;
      background: rgba(255, 255, 255, 0.05);
      border-left-color: var(--primary-color);
    }

    .sb-sidenav .nav-link.active {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      border-left-color: var(--primary-color);
    }

    .sb-sidenav .nav-link .sb-nav-link-icon {
      margin-right: 0.75rem;
      font-size: 1.1rem;
      width: 24px;
      text-align: center;
      transition: all var(--transition-speed) ease;
    }

    .sb-sidenav .nav-link.active .sb-nav-link-icon,
    .sb-sidenav .nav-link:hover .sb-nav-link-icon {
      color: var(--primary-color);
    }

    .sb-sidenav .nav-link.collapsed .sb-sidenav-collapse-arrow {
      transform: rotate(0deg);
    }

    .sb-sidenav .nav-link .sb-sidenav-collapse-arrow {
      margin-left: auto;
      transition: transform var(--transition-speed) ease;
    }

    .sb-sidenav-menu-nested {
      margin-left: 1.5rem;
      padding-left: 0.5rem;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sb-sidenav-menu-nested .nav-link {
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
    }

    .collapse {
      transition: height var(--transition-speed) ease;
    }

    /* Sidebar Footer */
    .sb-sidenav-footer {
      background: rgba(0, 0, 0, 0.2);
      padding: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
    }

    .sb-sidenav-footer .small {
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    }

    /* Main Content */
    #layoutSidenav_content {
      margin-left: var(--sidebar-width);
      transition: all var(--transition-speed) ease;
      width: calc(100% - var(--sidebar-width));
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    main#app {
      flex: 1;
      padding: 1.5rem;
      opacity: 1;
      transition: opacity 0.4s ease-in-out;
    }

    /* Footer */
    footer {
      background: white;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
      padding: 1rem;
      margin-top: auto;
    }

    /* Cards */
    .card {
      border: none;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      background: white;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      font-weight: 600;
      padding: 1rem 1.5rem;
      border-radius: 10px 10px 0 0 !important;
    }

    .card-body {
      padding: 1.5rem;
    }

    /* Breadcrumb */
    .breadcrumb {
      background: transparent;
      padding: 0.5rem 0;
      margin-bottom: 1.5rem;
    }

    .breadcrumb-item a {
      color: var(--primary-color);
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .breadcrumb-item a:hover {
      text-decoration: underline;
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .fade-in {
      animation: fadeIn 0.5s ease forwards;
    }

    .card {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeIn 0.5s ease forwards;
    }

    .row > div:nth-child(1) .card { animation-delay: 0.1s; }
    .row > div:nth-child(2) .card { animation-delay: 0.2s; }
    .row > div:nth-child(3) .card { animation-delay: 0.3s; }
    .row > div:nth-child(4) .card { animation-delay: 0.4s; }

    /* Toggle sidebar state */
    .sb-sidenav-toggled #layoutSidenav_nav {
      width: var(--sidebar-collapsed-width);
    }

    .sb-sidenav-toggled #layoutSidenav_content {
      margin-left: var(--sidebar-collapsed-width);
      width: calc(100% - var(--sidebar-collapsed-width));
    }

    .sb-sidenav-toggled .sb-sidenav .nav-link {
      padding: 0.75rem;
      justify-content: center;
    }

    .sb-sidenav-toggled .sb-sidenav .nav-link .sb-nav-link-icon {
      margin-right: 0;
      font-size: 1.25rem;
    }

    .sb-sidenav-toggled .sb-sidenav .nav-link .sb-nav-link-text,
    .sb-sidenav-toggled .sb-sidenav .sb-sidenav-collapse-arrow,
    .sb-sidenav-toggled .sb-sidenav-menu-heading,
    .sb-sidenav-toggled .sb-sidenav-menu-nested,
    .sb-sidenav-toggled .sb-sidenav-footer {
      display: none;
    }

    .sb-sidenav-toggled .sb-sidenav .nav-link {
      border-left: none;
      border-radius: 8px;
      margin: 0.25rem 0.5rem;
      width: calc(var(--sidebar-collapsed-width) - 1rem);
    }

    .sb-sidenav-toggled .sb-sidenav .nav-link:hover {
      background: var(--primary-color);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      #layoutSidenav_nav {
        width: var(--sidebar-collapsed-width);
        transform: translateX(-var(--sidebar-collapsed-width));
      }

      #layoutSidenav_content {
        margin-left: 0;
        width: 100%;
      }

      .sb-sidenav-mobile-toggled #layoutSidenav_nav {
        transform: translateX(0);
        box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
      }

      .sb-sidenav-mobile-toggled #layoutSidenav_content::before {
        content: '';
        position: fixed;
        top: 56px;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1019;
      }
    }
  </style>
</head>

<body class="sb-nav-fixed">
  <!-- Top Navbar -->
  <nav class="sb-topnav navbar navbar-expand navbar-dark">
      <!-- Navbar Brand-->
      <a class="navbar-brand ps-3" href="{{ route('dashboard') }}">
        <img src="{{ asset('frontend/images/logoHR.png') }}" 
                 alt="Avatar" 
                 class="rounded-circle me-2"
                 width="100" height="100">
            <span class="d-none d-lg-inline fw-bold">Win Town</span> 
      </a>
      <!-- Sidebar Toggle-->
      <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle">
        <i class="fas fa-bars"></i>
      </button>
      <!-- Navbar Search-->
      <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
          <div class="input-group">
              <input class="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
              <button class="btn btn-primary" id="btnNavbarSearch" type="button"><i class="fas fa-search"></i></button>
          </div>
      </form>
      <!-- Navbar-->
       <!-- Notification icon inline -->
<i class="fas fa-bell" 
   style="font-size: 22px; color: #d9ff00ff; cursor: pointer;" 
   onclick="alert('You have 3 new notifications!')"></i>

      <!-- Navbar -->
<ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle d-flex align-items-center" id="navbarDropdown" href="#" 
           role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <!-- Avatar -->
            <img src="{{ asset('frontend/images/avatarUser.png') }}" 
                 alt="Avatar" 
                 class="rounded-circle me-2"
                 width="40" height="40">
            <span class="d-none d-lg-inline fw-bold">Kanst</span>
        </a>
        <!-- Dropdown menu -->
        <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="navbarDropdown" style="width: 250px;">
            <!-- User Info -->
            <li class="px-3 py-2 d-flex align-items-center">
                <img src="{{ asset('frontend/images/avatarUser.png') }}" 
                     alt="Avatar" 
                     class="rounded-circle me-2"
                     width="50" height="50">
                <div>
                    <strong>Kanst</strong><br>
                    <small class="text-muted">admin@example.com</small>
                </div>
            </li>
            <li><hr class="dropdown-divider"></li>
            <!-- Menu Items -->
            <li><a class="dropdown-item" href="#">📋 Profile</a></li>
            <li><a class="dropdown-item" href="#">⚙️ Settings</a></li>
            <li><a class="dropdown-item" href="{{ route('login') }}">🔒 Logout</a></li>
        </ul>
    </li>
</ul>

  </nav>

  <div id="layoutSidenav">
    <!-- Sidebar -->
    <div id="layoutSidenav_nav">
      <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
        <div class="sb-sidenav-menu">
          <div class="nav">
            <div class="sb-sidenav-menu-heading">Core</div>
            <a class="nav-link" href="#" class_db_page="dashboard">
              <div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
              Statistical
            </a>

            <div class="sb-sidenav-menu-heading">Interface</div>

            <!-- Internal Policies -->
            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapsePolicies" aria-expanded="false">
              <div class="sb-nav-link-icon"><i class="fas fa-gavel"></i></div>
              Internal policies & regulations
              <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
            </a>
            <div class="collapse" id="collapsePolicies" data-bs-parent="#sidenavAccordion">
              <nav class="sb-sidenav-menu-nested nav">
                <a class="nav-link" href="#" class_db_page="hierarchy">Hierarchys</a>
                <a class="nav-link" href="#" class_db_page="payroll_rule">Payroll Rules</a>
              </nav>
            </div>

            <!-- Employees -->
            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseEmployees" aria-expanded="false">
              <div class="sb-nav-link-icon"><i class="fas fa-user"></i></div>
              Employees
              <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
            </a>
            <div class="collapse" id="collapseEmployees" data-bs-parent="#sidenavAccordion">
              <nav class="sb-sidenav-menu-nested nav">
                <a class="nav-link" href="#" class_db_page="employee_information">Personal Information</a>
                <a class="nav-link" href="#" class_db_page="employee_hierarchy">Hierarchy</a>
                <a class="nav-link" href="#" class_db_page="employee_bank_information">Bank Information</a>
              </nav>
            </div>

            <!-- Contracts & Payroll -->
            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseContracts" aria-expanded="false">
              <div class="sb-nav-link-icon"><i class="fas fa-file-invoice-dollar"></i></div>
              Contracts & Salary
              <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
            </a>
            <div class="collapse" id="collapseContracts" data-bs-parent="#sidenavAccordion">
              <nav class="sb-sidenav-menu-nested nav">
                <a class="nav-link" href="#" class_db_page="contract">Contracts</a>
                <a class="nav-link" href="#" class_db_page="salary_detail">Salary Details</a>
              </nav>
            </div>

            <!-- Attendance -->
            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseAttendance" aria-expanded="false">
              <div class="sb-nav-link-icon"><i class="fas fa-calendar-check"></i></div>
              Attendance Management
              <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
            </a>
            <div class="collapse" id="collapseAttendance" data-bs-parent="#sidenavAccordion">
              <nav class="sb-sidenav-menu-nested nav">
                <a class="nav-link" href="#" class_db_page="attendance">Attendances</a>
              </nav>
            </div>

            <!-- Leave Management -->
            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLeaves" aria-expanded="false">
              <div class="sb-nav-link-icon"><i class="fas fa-plane-departure"></i></div>
              Leave Management
              <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
            </a>
            <div class="collapse" id="collapseLeaves" data-bs-parent="#sidenavAccordion">
              <nav class="sb-sidenav-menu-nested nav">
                <a class="nav-link" href="#" class_db_page="leave">Leaves</a>
              </nav>
            </div>

            <!-- Reports & Analytics -->
            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseReports" aria-expanded="false">
              <div class="sb-nav-link-icon"><i class="fas fa-chart-bar"></i></div>
              Reports & Analytics
              <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
            </a>
            <div class="collapse" id="collapseReports" data-bs-parent="#sidenavAccordion">
              <nav class="sb-sidenav-menu-nested nav">
                <a class="nav-link" href="#" class_db_page="charts">Charts</a>
                <a class="nav-link" href="#" class_db_page="tables">Tables</a>
              </nav>
            </div>
          </div>
        </div>
        <div class="sb-sidenav-footer">
          <div class="small">Logged in as:</div>
          Start Bootstrap
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div id="layoutSidenav_content">
      <main id="app" class="container-fluid px-4">
        <h1 class="mt-4">Dashboard</h1>
        <ol class="breadcrumb mb-4"><li class="breadcrumb-item active">Dashboard</li></ol>

        <!-- Cards -->
        <div class="row">
          <div class="col-xl-3 col-md-6">
            <div class="card bg-primary text-white mb-4">
              <div class="card-body">Primary Card</div>
              <div class="card-footer d-flex align-items-center justify-content-between">
                <a class="small text-white stretched-link" href="#">View Details</a>
                <div class="small text-white"><i class="fas fa-angle-right"></i></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="row">
          <div class="col-xl-6">
            <div class="card mb-4">
              <div class="card-header"><i class="fas fa-chart-area me-1"></i>Area Chart Example</div>
              <div class="card-body"><canvas id="myAreaChart" width="100%" height="40"></canvas></div>
            </div>
          </div>
          <div class="col-xl-6">
            <div class="card mb-4">
              <div class="card-header"><i class="fas fa-chart-bar me-1"></i>Bar Chart Example</div>
              <div class="card-body"><canvas id="myBarChart" width="100%" height="40"></canvas></div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="py-4 bg-light mt-auto">
        <div class="container-fluid px-4">
          <div class="d-flex align-items-center justify-content-between small">
            <div class="text-muted">&copy; 2023 Win Town</div>
            <div>
              <a href="#">Privacy Policy</a> &middot; <a href="#">Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
  <script src="bootstrap/js/scripts.js"></script> <!-- open/Close sidebarToggle--> 
  <script src="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js" crossorigin="anonymous"></script>

   <!-- Scripts Page-->
  <script src="/js/employee_information.js"></script>
  <script src="/js/employee_hierarchy.js"></script>
  <script src="/js/employee_bank_information.js"></script>

  <script src="/js/hierarchy.js"></script>
  <script src="/js/payroll_rule.js"></script>

  <script src="/js/contract.js"></script>
  <script src="/js/salary_detail.js"></script>

  <script src="/js/attendance.js"></script>

  <script src="/js/leave.js"></script>
  <script src="/js/report.js"></script>


  <!-- SPA JS -->
  <script>
    const app = document.getElementById('app');

    function loadPage(page)
    {
      const content = app;
      // Highlight active menu
      document.querySelectorAll('[class_db_page]').forEach(el => el.classList.remove('active'));
      const activeEl = document.querySelector(`[class_db_page="${page}"]`);
      if(activeEl) activeEl.classList.add('active');

      // Load page content
      switch(page)
      {
        case 'Home': { content.innerHTML = `<h1 class="mt-4">Dashboard</h1> <ol class="breadcrumb mb-4"><li class="breadcrumb-item active">Dashboard</li></ol>`; } break;
        case 'employee_information': { Employee_Information.getInstance().render(content); } break;
        case 'employee_hierarchy': { Employee_Hierarchy.getInstance().render(content); } break;
        case 'employee_bank_information': { Employee_Bank_Information.getInstance().render(content)} break;

        case 'hierarchy': { Hierarchy.getInstance().render(content); } break;
        case 'payroll_rule': { Payroll_Rule.getInstance().render(content); } break;

        case 'contract': { Contract.getInstance().render(content); } break;
        case 'salary_detail': { Salary_Detail.getInstance().render(content); } break;

        case 'attendance': { Attendance.getInstance().render(content); } break;

        case 'leave': { Leave.getInstance().render(content); } break;

        case 'report': { Report.getInstance().render(content); } break;


        default: content.innerHTML = `<body class="sb-nav-fixed">


  <!-- Main content: 4 cards (2x2) each with a carousel -->
  <main class="container-fluid px-4 mt-4">
    <div class="row g-4">
      <!-- Card 1 -->
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            Scenery
          </div>
          <div class="card-body p-0">
            <div id="carousel1" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img src="data:image/webp;base64,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" class="d-block w-100" alt="Slide 1">
                </div>
                <div class="carousel-item">
                  <img src="https://www.bing.com/images/search?view=detailV2&ccid=RxEm%2bb0P&id=2DAEB997A3BE96D9B75DB57C96082982BD823829&thid=OIP.RxEm-b0PKnq9mcJv6g3CWwHaEK&mediaurl=https%3a%2f%2fkhoinguonsangtao.vn%2fwp-content%2fuploads%2f2022%2f07%2fhinh-nen-phong-canh-anime-cho-may-tinh.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.471126f9bd0f2a7abd99c26fea0dc25b%3frik%3dKTiCvYIpCJZ8tQ%26pid%3dImgRaw%26r%3d0&exph=1080&expw=1920&q=%e1%ba%a3nh+anime+phong+c%e1%ba%a3nh&FORM=IRPRST&ck=310AF54E254DE97AEA6DF28AEE49A74E&selectedIndex=6&itb=0" class="d-block w-100" alt="Slide 2">
                </div>
                <div class="carousel-item">
                  <img src="https://www.bing.com/images/search?view=detailV2&ccid=NyXnhFOz&id=D2073354A4CE81E50E8ACB6CCB6A8C2E93785AFA&thid=OIP.NyXnhFOzU-uC7Vg1BcvsDgHaDt&mediaurl=https%3a%2f%2fcdn.openart.ai%2fstable_diffusion%2f825d621242b01bd624ac265e9bfab5690a701133_2000x2000.webp&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.3725e78453b353eb82ed583505cbec0e%3frik%3d%252blp4ky6Mastsyw%26pid%3dImgRaw%26r%3d0&exph=512&expw=1024&q=%e1%ba%a2nh+Phong+C%e1%ba%a3nh+N%c3%bai+Anime&FORM=IRPRST&ck=6BD1C92D36E4F7C3B1AE582D12F59E28&selectedIndex=2&itb=0" class="d-block w-100" alt="Slide 3">
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carousel1" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carousel1" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-success text-white">
            Character
          </div>
          <div class="card-body p-0">
            <div id="carousel2" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img src="https://www.bing.com/images/search?view=detailV2&ccid=7WY8V%2fa%2f&id=85F3AA93B346DBF5EAB277B17C24C31D444DB881&thid=OIP.7WY8V_a_3pnhuwwV0j8MUAHaEK&mediaurl=https%3a%2f%2fwallpapers.com%2fimages%2fhd%2feren-yeager-long-black-hair-0634ucaxc1lt7cg1.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.ed663c57f6bfde99e1bb0c15d23f0c50%3frik%3dgbhNRB3DJHyxdw%26pid%3dImgRaw%26r%3d0&exph=1080&expw=1920&q=eren+yeager&FORM=IRPRST&ck=8ED4A0576FF7A510FE55BC2E1FF09D44&selectedIndex=21&itb=0" class="d-block w-100" alt="Slide 1">
                </div>
                <div class="carousel-item">
                  <img src="https://www.bing.com/images/search?view=detailV2&ccid=SKMrK6nN&id=C3AAC3DC83617D1F59B076A30EC8344A551DF7B2&thid=OIP.SKMrK6nNpkR3FuDMvfhDiwHaEK&mediaurl=https%3a%2f%2fwallpaperaccess.com%2ffull%2f2937287.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.48a32b2ba9cda6447716e0ccbdf8438b%3frik%3dsvcdVUo0yA6jdg%26pid%3dImgRaw%26r%3d0&exph=1080&expw=1920&q=aot+backgrounds&FORM=IRPRST&ck=69C3A564D1CE8F4AF5E6C88CDB852686&selectedIndex=10&itb=0" class="d-block w-100" alt="Slide 2">
                </div>
                <div class="carousel-item">
                  <img src="https://www.bing.com/images/search?view=detailV2&ccid=W7SPNMrk&id=E9C73FC8C30DCA924205AF7E4E0DA9D2096F59DF&thid=OIF.WT%2btSluoUOBew%2fz%2f6MGKaw&mediaurl=https%3a%2f%2fi.pinimg.com%2foriginals%2f34%2ff4%2f89%2f34f489296bf6b32439d8ee0251f3b3c6.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.5bb48f34cae4609898af525784086bd4%3frik%3d%26pid%3dImgRaw%26r%3d0&exph=675&expw=1200&q=aot+backgrounds&FORM=IRPRST&ck=593FAD4A5BA850E05EC3FCFFE8C18A6B&selectedIndex=41&itb=0" class="d-block w-100" alt="Slide 3">
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carousel2" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carousel2" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-warning text-white">
            Carousel 3
          </div>
          <div class="card-body p-0">
            <div id="carousel3" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img src="https://www.bing.com/images/search?view=detailV2&ccid=fQ0U9n%2fM&id=D6DADB5BDE0155DCAF7BDB7280A71AB14C9ABB59&thid=OIP.fQ0U9n_MUoRFlFjwvfxKwAHaEK&mediaurl=https%3a%2f%2fkhoinguonsangtao.vn%2fwp-content%2fuploads%2f2022%2f09%2fanh-itachi.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.7d0d14f67fcc5284459458f0bdfc4ac0%3frik%3dWbuaTLEap4By2w%26pid%3dImgRaw%26r%3d0&exph=2160&expw=3840&q=itachi+%c6%b0all&FORM=IRPRST&ck=357F2C3A1546B83508423D9301663082&selectedIndex=3&itb=0" class="d-block w-100" alt="Slide 1">
                </div>
                <div class="carousel-item">
                  <img src="https://www.bing.com/images/search?view=detailV2&ccid=TCmzZx25&id=85141BF9444D4E33519B11572175757BC00F1776&thid=OIP.TCmzZx25wLg6zug4OdqTQAHaEK&mediaurl=https%3a%2f%2fimages.wallpapersden.com%2fimage%2fdownload%2fitachi-uchiha-4k-naruto-fan-art-2022_bWprZ2eUmZqaraWkpJRmbmdlrWZlbWU.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4c29b3671db9c0b83acee83839da9340%3frik%3ddhcPwHt1dSFXEQ%26pid%3dImgRaw%26r%3d0&exph=1080&expw=1920&q=itachi+uchiha+wallpaper&FORM=IRPRST&ck=60194609AE368E941DD2D5E563570D22&selectedIndex=21&itb=0" class="d-block w-100" alt="Slide 2">
                </div>
                <div class="carousel-item">
                  <img src="https://www.bing.com/images/search?view=detailV2&ccid=rFe03NtX&id=DB1565710ABCC7A0B4F908054EDF6A7A2A5E26B7&thid=OIF.%2bC6OB%2f0fVCCN96IOQV983w&mediaurl=https%3a%2f%2ffree-3dtextureshd.com%2fwp-content%2fuploads%2f2025%2f09%2fItachi-Uchiha-Crow-Wallpaper-4K-Akatsuki-HD-Background-Free-Download-for-PC-Mobile-572.jpg.webp&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.ac57b4dcdb5740caf984fdf201da04bd%3frik%3d%26pid%3dImgRaw%26r%3d0&exph=576&expw=1024&q=itachi+uchiha+wallpaper&FORM=IRPRST&ck=F82E8E07FD1F54208DF7A20E415F7CDF&selectedIndex=83&itb=0" class="d-block w-100" alt="Slide 3">
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carousel3" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carousel3" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-danger text-white">
            Carousel 4
          </div>
          <div class="card-body p-0">
            <div id="carousel4" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img src="https://www.bing.com/images/search?view=detailV2&ccid=QN47T4ny&id=33B44618183BFB5316A55E907310C5FB62A011C0&thid=OIP.QN47T4nyOrlSyDqYpX1weQHaEK&mediaurl=https%3a%2f%2frare-gallery.com%2fuploads%2fposts%2f193476-yato-1920x1080.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.40de3b4f89f23ab952c83a98a57d7079%3frik%3dwBGgYvvFEHOQXg%26pid%3dImgRaw%26r%3d0&exph=1080&expw=1920&q=yato+wallpaper&FORM=IRPRST&ck=A0365F2565A1E89E52740AFBA39AFC2D&selectedIndex=46&itb=0" class="d-block w-100" alt="Slide 1">
                </div>
                <div class="carousel-item">
                  <img src="https://www.bing.com/images/search?view=detailV2&ccid=yrI%2bJnU0&id=CCCCBA07958D22D7AD0BED3294D13EFEA8843C0F&thid=OIF.w7TrtfntZjQGPqGg9mkG5w&mediaurl=https%3a%2f%2fimages2.alphacoders.com%2f922%2fthumbbig-922729.webp&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.cab23e267534ac424a7daba43c3bea0d%3frik%3d%26pid%3dImgRaw%26r%3d0&exph=375&expw=600&q=yato+wallpaper&FORM=IRPRST&ck=C3B4EBB5F9ED6634063EA1A0F66906E7&selectedIndex=99&itb=0" class="d-block w-100" alt="Slide 2">
                </div>
                <div class="carousel-item">
                  <img src="https://www.bing.com/images/search?view=detailV2&ccid=VX28sF4E&id=9AF2FB7892DD103FDB3B514E3DB046FFDA1F3B5A&thid=OIP.VX28sF4ECdm1Tay_7rcl-gHaEK&mediaurl=https%3a%2f%2fwallpapercrafter.com%2fdesktop1%2f602556-Anime-Noragami-Yato-Noragami-blue-sky-cloud.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.557dbcb05e0409d9b54dacbfeeb725fa%3frik%3dWjsf2v9GsD1OUQ%26pid%3dImgRaw%26r%3d0&exph=1080&expw=1920&q=yato+wallpaper&FORM=IRPRST&ck=7F4C3ACBB7D3A322342573BE48F4EB11&selectedIndex=70&itb=0" class="d-block w-100" alt="Slide 3">
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carousel4" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carousel4" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
`; break;
      }

      window.location.hash = page;
    }

    document.addEventListener('click', e => {
      const a = e.target.closest('[class_db_page]');
      if(!a) return;
      if(a.getAttribute('data-bs-toggle')) return;
      e.preventDefault();
      const page = a.getAttribute('class_db_page');
      if(page) loadPage(page);
    });

    // --- Load default page ---
    const defaultPage = window.location.hash ? window.location.hash.slice(1) : 'dashboard';
    loadPage('dashboard');
  </script>
</body>
</html>