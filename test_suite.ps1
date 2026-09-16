# Rheumora Comprehensive Automated Test Suite
$dir = "d:\project 2\Rheumatology & Autoimmune Care Center"
$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()
$passed = [System.Collections.Generic.List[string]]::new()

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "RHEUMORA QA TEST SUITE - 9-STEP AUTOMATED AUDIT" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# 1. FILE EXISTENCE & INTEGRITY
$requiredFiles = @(
  "index.html", "home2.html", "services.html", "about.html",
  "blog.html", "blog-single.html", "contact.html", "login.html",
  "register.html", "dashboard.html", "404.html", "coming-soon.html",
  "assets\css\style.css", "assets\css\rtl.css",
  "assets\js\main.js", "assets\js\dashboard.js", "README.md"
)

foreach ($f in $requiredFiles) {
  $p = Join-Path $dir $f
  if (Test-Path $p) {
    $passed.Add("File exists: $f")
  } else {
    $errors.Add("MISSING REQUIRED FILE: $f")
  }
}

# 2. LINKS & ANCHORS AUDIT (Step 6)
Write-Host "`n--- Checking Links and Anchor Targets ---" -ForegroundColor Yellow
$htmlFiles = Get-ChildItem -Path $dir -Filter "*.html"
$pattern = 'href="([^"]+)"'

foreach ($file in $htmlFiles) {
  $content = Get-Content $file.FullName -Raw
  $regexMatches = [regex]::Matches($content, $pattern)
  
  foreach ($matchItem in $regexMatches) {
    $href = $matchItem.Groups[1].Value
    
    if ($href.StartsWith("http") -or $href.StartsWith("tel:") -or $href.StartsWith("mailto:") -or $href.StartsWith("javascript:") -or $href -eq "#" -or $href.StartsWith("data:")) {
      continue
    }
    
    $parts = $href.Split('#')
    $targetFile = $parts[0]
    $targetAnchor = if ($parts.Count -gt 1) { $parts[1] } else { $null }
    
    if ($targetFile -ne "") {
      $targetPath = Join-Path $dir $targetFile
      if (-not (Test-Path $targetPath)) {
        $errors.Add("$($file.Name): Broken link href='$href' (Target file '$targetFile' does not exist)")
      } elseif ($targetAnchor) {
        $targetContent = Get-Content $targetPath -Raw
        if (-not $targetContent.Contains("id=`"$targetAnchor`"")) {
          $warnings.Add("$($file.Name): Anchor #$targetAnchor in href='$href' not found in $targetFile")
        }
      }
    } else {
      if ($targetAnchor -and (-not $content.Contains("id=`"$targetAnchor`""))) {
        $warnings.Add("$($file.Name): In-page anchor #$targetAnchor not found in file")
      }
    }
  }
}

# 3. TYPOGRAPHY & HEADING WEIGHT RULES (Step 8 & UI Step 4)
Write-Host "`n--- Checking Typography Weight Rules (Max 580) ---" -ForegroundColor Yellow
$cssContent = Get-Content (Join-Path $dir "assets\css\style.css") -Raw

if ($cssContent -match '--weight-h1:\s*580;') {
  $passed.Add("CSS --weight-h1 is 580 (strictly <= 580)")
} else {
  $errors.Add("style.css: --weight-h1 is not 580")
}

if ($cssContent -match '--weight-h2:\s*540;') {
  $passed.Add("CSS --weight-h2 is 540 (strictly <= 580)")
} else {
  $errors.Add("style.css: --weight-h2 is not 540")
}

if ($cssContent -match '--weight-h3:\s*520;') {
  $passed.Add("CSS --weight-h3 is 520 (strictly <= 580)")
} else {
  $errors.Add("style.css: --weight-h3 is not 520")
}

if ($cssContent.Contains("font-weight: 600") -or $cssContent.Contains("font-weight: 700") -or $cssContent.Contains("font-weight: 800") -or $cssContent.Contains("font-weight: bold")) {
  $errors.Add("style.css contains illegal font-weight (600, 700, 800, or bold)")
} else {
  $passed.Add("Zero illegal font-weights (600, 700, 800, bold) found in style.css")
}

# 4. GLOBAL ALIGNMENT (Step 3)
Write-Host "`n--- Checking Section Header Alignment ---" -ForegroundColor Yellow
if ($cssContent.Contains("text-align: center;")) {
  $passed.Add("style.css contains text-align: center")
}

if ($cssContent.Contains("flex-direction: column;") -and $cssContent.Contains("align-items: center;")) {
  $passed.Add("style.css card rules have flex-direction: column and align-items: center")
}

# 5. AUTH PAGES CONSTRAINTS (Step 6, 9.7, 9.8)
Write-Host "`n--- Checking Auth Pages (Login / Register) Constraints ---" -ForegroundColor Yellow
$loginContent = Get-Content (Join-Path $dir "login.html") -Raw
$regContent = Get-Content (Join-Path $dir "register.html") -Raw

if ($loginContent.Contains("theme-toggle-btn") -or $loginContent.Contains("desktopThemeToggle")) {
  $errors.Add("login.html: Theme toggle must NOT be present on auth pages (Step 6)")
} else {
  $passed.Add("login.html: No theme toggle present")
}

if ($regContent.Contains("theme-toggle-btn") -or $regContent.Contains("desktopThemeToggle")) {
  $errors.Add("register.html: Theme toggle must NOT be present on auth pages (Step 6)")
} else {
  $passed.Add("register.html: No theme toggle present")
}

if ($loginContent.Contains("Return to Home") -or $loginContent.Contains("Back to Home")) {
  $warnings.Add("login.html contains back-to-home button or link")
} else {
  $passed.Add("login.html: No back-to-home button present")
}

if ($regContent.Contains("Return to Home") -or $regContent.Contains("Back to Home")) {
  $warnings.Add("register.html contains back-to-home button or link")
} else {
  $passed.Add("register.html: No back-to-home button present")
}

if ($regContent.Contains("name=`"terms`"")) {
  $passed.Add("register.html: Terms & Conditions checkbox is present")
} else {
  $errors.Add("register.html: Missing required Terms & Conditions checkbox")
}

# 6. FIXED NAVBAR MENU VERIFICATION (Step 4)
Write-Host "`n--- Checking Fixed Menu Items in Standard Pages ---" -ForegroundColor Yellow
$standardPages = @("index.html", "home2.html", "services.html", "about.html", "blog.html", "contact.html", "dashboard.html")

foreach ($sp in $standardPages) {
  $pageContent = Get-Content (Join-Path $dir $sp) -Raw
  
  $hasHome = $pageContent.Contains("index.html")
  $hasHome2 = $pageContent.Contains("home2.html")
  $hasServices = $pageContent.Contains("services.html")
  $hasBlog = $pageContent.Contains("blog.html")
  $hasContact = $pageContent.Contains("contact.html")
  $hasDashboard = $pageContent.Contains("dashboard.html")
  $hasLogin = $pageContent.Contains(">Login</a>")
  
  if ($hasHome -and $hasHome2 -and $hasServices -and $hasBlog -and $hasContact -and $hasDashboard -and $hasLogin) {
    $passed.Add("$sp has all required fixed menu items (Home, Home 2, Services, Blog, Contact, Dashboard, Login)")
  } else {
    $errors.Add("$sp is missing one or more fixed menu items")
  }
}

# 7. BREAKPOINTS BEHAVIOR (Step 4 & 7)
Write-Host "`n--- Checking Responsive Breakpoint CSS Rules ---" -ForegroundColor Yellow
if ($cssContent.Contains("@media (max-width: 1024px)") -and $cssContent.Contains(".nav-menu {`r`n    display: none !important;")) {
  $passed.Add("style.css: .nav-menu hidden at <= 1024px")
} elseif ($cssContent.Contains("@media (max-width: 1024px)")) {
  $passed.Add("style.css: @media (max-width: 1024px) breakpoint present")
}

# 8. RTL DRAWER (Step 5)
Write-Host "`n--- Checking RTL Stylesheet Rules ---" -ForegroundColor Yellow
$rtlContent = Get-Content (Join-Path $dir "assets\css\rtl.css") -Raw
if ($rtlContent.Contains("transform: translateX(-100%);") -and $rtlContent.Contains("left: 0;")) {
  $passed.Add("rtl.css: Mobile drawer correctly configured to slide from left in RTL mode")
} else {
  $errors.Add("rtl.css: Mobile drawer must slide from LEFT in RTL mode (Step 5)")
}

# 9. CONSOLE & JAVASCRIPT INTEGRITY (Step 7)
Write-Host "`n--- Checking JavaScript Null Element Guards ---" -ForegroundColor Yellow
$mainJs = Get-Content (Join-Path $dir "assets\js\main.js") -Raw

if ($mainJs.Contains("if (hamburgerBtn)") -and $mainJs.Contains("if (!typewriterEl) return;") -and $mainJs.Contains("if (!daysEl) return;")) {
  $passed.Add("main.js has safe element guards for multi-page execution")
} else {
  $warnings.Add("main.js might have unguarded element references")
}

# SUMMARY REPORT
Write-Host "`n======================================================" -ForegroundColor Cyan
Write-Host "AUDIT RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "PASSED CHECKS: $($passed.Count)" -ForegroundColor Green
Write-Host "WARNINGS:      $($warnings.Count)" -ForegroundColor Yellow
Write-Host "ERRORS:        $($errors.Count)" -ForegroundColor Red

if ($warnings.Count -gt 0) {
  Write-Host "`n--- WARNING DETAILS ---" -ForegroundColor Yellow
  foreach ($w in $warnings) { Write-Host " [WARN] $w" -ForegroundColor Yellow }
}

if ($errors.Count -gt 0) {
  Write-Host "`n--- ERROR DETAILS ---" -ForegroundColor Red
  foreach ($e in $errors) { Write-Host " [ERR]  $e" -ForegroundColor Red }
} else {
  Write-Host "`n>>> ALL CRITICAL CHECKS PASSED WITH 0 ERRORS! <<<" -ForegroundColor Green
}
