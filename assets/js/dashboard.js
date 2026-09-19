/**
 * ==========================================================================
 * RHEUMORA — RHEUMATOLOGY & AUTOIMMUNE CARE CENTER
 * Patient Portal & Health Records Dashboard Logic
 * ==========================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Tab Switching
    const menuButtons = document.querySelectorAll('.dash-menu-btn');
    const panels = document.querySelectorAll('.dashboard-panel');

    menuButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        if (!targetId) return;

        menuButtons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });

    // 2. Interactive Flare-Up Logger
    const flareForm = document.getElementById('flareLogForm');
    const flareAlert = document.getElementById('flareAlert');
    const flareHistoryList = document.getElementById('flareHistoryList');

    if (flareForm) {
      flareForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const joint = document.getElementById('flareJoint') ? document.getElementById('flareJoint').value : 'Joints';
        const painScore = document.getElementById('flarePainLevel') ? document.getElementById('flarePainLevel').value : '5';
        const stiffness = document.getElementById('flareStiffness') ? document.getElementById('flareStiffness').value : '30';
        const notes = document.getElementById('flareNotes') ? document.getElementById('flareNotes').value : '';

        // Add new card to history
        if (flareHistoryList) {
          const item = document.createElement('div');
          item.className = 'card';
          item.style.padding = '16px';
          item.style.alignItems = 'flex-start';
          item.style.textAlign = 'start';
          item.style.marginBottom = '12px';
          item.innerHTML = `
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 8px;">
              <strong style="color: var(--color-primary); font-size: 1.05rem;">${joint} — Pain: ${painScore}/10</strong>
              <span class="section-badge" style="margin: 0;">Just logged</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 4px;"><strong>Stiffness Duration:</strong> ${stiffness} minutes</p>
            <p style="font-size: 0.9rem; color: var(--color-text-muted);">${notes ? `"${notes}"` : 'No additional notes provided.'}</p>
          `;
          flareHistoryList.prepend(item);
        }

        if (flareAlert) {
          flareAlert.className = 'alert-box success show';
          flareAlert.textContent = 'Flare-up logged successfully! Your clinical care team has been notified for triage review.';
        }

        flareForm.reset();
        setTimeout(() => {
          if (flareAlert) flareAlert.classList.remove('show');
        }, 5000);
      });
    }

    // 3. Appointment Booking Simulation
    const apptForm = document.getElementById('bookApptForm');
    const apptAlert = document.getElementById('apptAlert');
    if (apptForm) {
      apptForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (apptAlert) {
          apptAlert.className = 'alert-box success show';
          apptAlert.textContent = 'Infusion chair reserved successfully! A confirmation SMS and calendar invite have been dispatched.';
        }
        apptForm.reset();
      });
    }

    // Dashboard Mobile Sidebar Toggle
    const dashSidebarToggleBtn = document.getElementById('dashSidebarToggleBtn');
    const dashboardSidebar = document.getElementById('dashboardSidebar');

    if (dashSidebarToggleBtn && dashboardSidebar) {
      dashSidebarToggleBtn.addEventListener('click', () => {
        dashboardSidebar.classList.toggle('active');
      });
      
      // Close sidebar when clicking a menu link on mobile
      menuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (window.innerWidth <= 1024) {
            dashboardSidebar.classList.remove('active');
          }
        });
      });
    }

  });
})();




