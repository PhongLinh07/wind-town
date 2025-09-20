<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Dashboard - Win Town</title>

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

  <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>

  <style>
    :root {
      --primary-color: #2c52ed;
      --secondary-color: #6c757d;
      --success-color: #1cc88a;
      --info-color: #36b9cc;
      --warning-color: #f6c23e;
      --danger-color: #e74a3b;
      --light-bg: #f8f9fa;
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
      background-color: var(--light-bg);
      overflow-x: hidden;
      transition: all var(--transition-speed) ease;
    }

    /* Top Navigation */
    .sb-topnav {
      background: linear-gradient(90deg, var(--dark-bg) 0%, #2c3e50 100%);
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
      background-color: var(--light-bg);
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
      <a class="navbar-brand ps-3" href="index.html">
        <i class="fas fa-city"></i> Win Town
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
      <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li><a class="dropdown-item" href="#!">Settings</a></li>
                  <li><a class="dropdown-item" href="#!">Activity Log</a></li>
                  <li><hr class="dropdown-divider" /></li>
                  <li><a class="dropdown-item" href="#!">Logout</a></li>
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
              Dashboard
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
              Contracts & Payroll
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

  <!-- SPA JS -->
  <script>
    const app = document.getElementById('app');

    // --- Tab modules (lazy load) ---
    const TabModules = 
    {
      employee_information: null, // Singleton sẽ tạo khi click lần đầu
      employee_hierarchy: null,
      employee_bank_information: null,

      hierachy: null,
      payroll_rule:null,

      contract: null,
      salary_detail: null,

      attendance:null,
      
      leave: null,
    };

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

        default: content.innerHTML = `<p>Page not found: ${page}</p>`; break;
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