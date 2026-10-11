/**
 * IntelligentEV - Academic Research Website JavaScript
 * Interactive navigation, milestone dropdown filters, domain tabs,
 * research component simulators, document/presentation modals, and contact handler.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initDomainTabs();
  initMilestonesSelector();
  initComponentSimulator();
  initModals();
  initContactForm();
  initArchLightbox();
});

/* ==========================================================================
   1. NAVIGATION & SCROLL HIGHLIGHTING
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });

    // Close mobile menu on click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show');
      });
    });
  }

  // Active link on scroll
  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   2. DOMAIN SUB-TABS SWITCHER
   ========================================================================== */
function initDomainTabs() {
  const tabButtons = document.querySelectorAll('.domain-tab-btn');
  const tabPanes = document.querySelectorAll('.domain-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      button.classList.add('active');
      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. MILESTONES INTERACTIVE DROPDOWN (Requirement from Slide 11)
   ========================================================================== */
function initMilestonesSelector() {
  const milestoneSelect = document.getElementById('milestoneSelect');
  const milestoneCards = document.querySelectorAll('.milestone-card');

  if (!milestoneSelect) return;

  milestoneSelect.addEventListener('change', (e) => {
    const selectedVal = e.target.value;

    milestoneCards.forEach(card => {
      const cardType = card.getAttribute('data-milestone');
      if (selectedVal === 'all' || cardType === selectedVal) {
        card.style.display = 'block';
        card.style.opacity = '1';
        if (selectedVal !== 'all') {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE RESEARCH SIMULATOR (Methodology Demonstrator)
   ========================================================================== */
function initComponentSimulator() {
  // Sub-tabs in simulator
  const simButtons = document.querySelectorAll('.sim-btn');
  const simPanes = document.querySelectorAll('.sim-content-pane');

  simButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSim = btn.getAttribute('data-sim');
      simButtons.forEach(b => b.classList.remove('active'));
      simPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(`sim-${targetSim}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Module 1: Anomaly Detection Test Case Runner
  const anomalySelect = document.getElementById('anomalyTestCase');
  const scoreDisplay = document.getElementById('resAnomalyScore');
  const classDisplay = document.getElementById('resAnomalyClass');
  const severityDisplay = document.getElementById('resAnomalySeverity');
  const alertDisplay = document.getElementById('resAnomalyAlert');

  if (anomalySelect) {
    const anomalyData = {
      normal: {
        score: '0.08',
        classification: 'NORMAL',
        severity: 'None',
        badgeClass: 'badge-winner',
        alert: 'All 9 electrical, thermal, and dynamic parameters operating within standard nominal envelopes.'
      },
      charging: {
        score: '0.96',
        classification: 'ABNORMAL',
        severity: 'CRITICAL',
        badgeClass: 'badge-danger',
        alert: 'Irregular charging current vs temperature fluctuation detected. Risk of thermal run-up. Immediate safety throttle advised.'
      },
      motor: {
        score: '0.91',
        classification: 'ABNORMAL',
        severity: 'HIGH',
        badgeClass: 'badge-warning',
        alert: 'Motor stator core temperature spikes coupled with elevated auxiliary power consumption. Service diagnostics recommended.'
      }
    };

    anomalySelect.addEventListener('change', (e) => {
      const item = anomalyData[e.target.value] || anomalyData.normal;
      if (scoreDisplay) scoreDisplay.textContent = item.score;
      if (classDisplay) classDisplay.textContent = item.classification;
      if (severityDisplay) {
        severityDisplay.textContent = item.severity;
        severityDisplay.style.color = item.severity === 'None' ? '#10b981' : item.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b';
      }
      if (alertDisplay) alertDisplay.textContent = item.alert;
    });
  }

  // Module 4: Interactive Virtual Assistant Q&A Sandbox
  const askBtn = document.getElementById('askAssistantBtn');
  const assistantInput = document.getElementById('assistantQuery');
  const assistantResponse = document.getElementById('assistantResponse');

  const ragKnowledge = {
    battery: "Based on IntelligentEV's Random Forest battery degradation model, reducing DC Fast Charging sessions and avoiding high-temperature parking helps maintain SOH above 95% across a 12-month horizon.",
    range: "The hybrid LSTM range model estimates available driving range dynamically using current SOC, ambient temperature, elevation profiles, and auxiliary HVAC consumption (Validation RMSE: 4.12 km, MAE: 3.05 km).",
    anomaly: "IntelligentEV continuously monitors 9 multi-dimensional telemetry channels (voltage, current, temps, acceleration, SOC) and applies Isolation Forest and Deep Autoencoders to detect abnormalities before catastrophic failure.",
    charging: "The charging optimizer computes CC-CV curve times and ARIMA-LSTM queue forecasts to schedule optimal charging stops, minimizing wait time (MAE: 2.4 min) and charging costs."
  };

  if (askBtn && assistantInput && assistantResponse) {
    askBtn.addEventListener('click', () => {
      const q = assistantInput.value.toLowerCase();
      let reply = "IntelligentEV Assistant: Grounded in research knowledge base — ";

      if (q.includes('battery') || q.includes('health') || q.includes('soh') || q.includes('degradation')) {
        reply += ragKnowledge.battery;
      } else if (q.includes('range') || q.includes('distance') || q.includes('km')) {
        reply += ragKnowledge.range;
      } else if (q.includes('anomaly') || q.includes('fault') || q.includes('error')) {
        reply += ragKnowledge.anomaly;
      } else if (q.includes('charge') || q.includes('station') || q.includes('queue') || q.includes('cost')) {
        reply += ragKnowledge.charging;
      } else {
        reply += "IntelligentEV MDSS combines four AI components: Operational Anomaly Detection, Battery Health SOH Forecast (Random Forest R²=0.999), Charging/Range Optimization, and Voice-enabled RAG Conversational Guidance.";
      }

      assistantResponse.innerHTML = `<span style="color:#38bdf8; font-weight:bold;">Assistant Response:</span> ${reply}`;
    });
  }
}

/* ==========================================================================
   5. DOCUMENT & PRESENTATION MODALS
   ========================================================================== */
function initModals() {
  const modalOverlay = document.getElementById('docModalOverlay');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalBody = document.getElementById('modalBody');

  const modalTriggers = document.querySelectorAll('[data-modal-doc]');

  const docDatabase = {
    charter: {
      title: "Project Charter: IntelligentEV",
      cat: "Academic Document • Formally Approved",
      body: `
        <h4 style="color:#38bdf8; margin-bottom:8px;">Scope & Objectives</h4>
        <p style="color:#cbd5e1; margin-bottom:12px;">This document authorizes the official commencement of the IntelligentEV research initiative at SLIIT. It outlines project governance, resource allocation, team roles, and milestone deadlines.</p>
        <h4 style="color:#38bdf8; margin-bottom:8px;">Key Deliverables</h4>
        <ul style="color:#cbd5e1; padding-left:20px; margin-bottom:12px;">
          <li>4 AI Core Machine Learning Sub-systems</li>
          <li>Unified Mobile Decision Support System (MDSS) interface</li>
          <li>Empirical evaluation reports and IEEE format conference thesis</li>
        </ul>
        <p style="color:#94a3b8; font-size:0.85rem;">Signed off by Supervisor: Ms. Uthpala Samarakoon &amp; Co-Supervisor: Mr./Ms. Nelum Chathuranga.</p>
      `
    },
    proposal: {
      title: "Research Project Proposal Document",
      cat: "Research Proposal • Evaluated (10%)",
      body: `
        <h4 style="color:#38bdf8; margin-bottom:8px;">Executive Summary</h4>
        <p style="color:#cbd5e1; margin-bottom:12px;">Presents the initial problem formulation, comprehensive literature review of 13 primary citations, methodology design, data collection protocols for NCM batteries, and preliminary validation hypotheses.</p>
        <h4 style="color:#38bdf8; margin-bottom:8px;">Evaluation Assessment</h4>
        <p style="color:#10b981; font-weight:600;">Status: Approved with High Distinction by SLIIT CDAP Academic Committee.</p>
      `
    },
    checklists: {
      title: "Milestone Assessment Checklists",
      cat: "Quality Assurance Documents",
      body: `
        <h4 style="color:#38bdf8; margin-bottom:8px;">Compliance & Milestones Checklists</h4>
        <p style="color:#cbd5e1; margin-bottom:12px;">Comprehensive tracking sheets for proposal submission, Progress Presentation 1 &amp; 2 deliverables, ethics clearance, and software release verification.</p>
        <ul style="color:#cbd5e1; padding-left:20px;">
          <li>Dataset validation checklist (NCM battery telemetry)</li>
          <li>Model evaluation benchmarks checklist (R², RMSE, MAE)</li>
          <li>Mobile UI decision support verification checklist</li>
        </ul>
      `
    },
    final_main: {
      title: "Final Comprehensive Research Thesis (Integrated)",
      cat: "Final Thesis Document • 40% Marks Allocation",
      body: `
        <h4 style="color:#38bdf8; margin-bottom:8px;">Thesis Outline</h4>
        <p style="color:#cbd5e1; margin-bottom:12px;">Complete 6-chapter comprehensive academic thesis encompassing system design, mathematical formulas (SOH calculations, CC-CV charging curves, spatial graph networks), deep evaluation, and future research directions.</p>
        <div style="background:#0f172a; padding:12px; border-radius:8px; border:1px solid rgba(56,189,248,0.2);">
          <strong style="color:#38bdf8;">Authors:</strong> Vidushan A.A.D.D.N, Dias N.T.B.P, Fernando C.T.H.H.D, Jayarathne W.T.D.K<br>
          <strong style="color:#38bdf8;">Affiliation:</strong> Dept. of IT, SLIIT Malabe, Sri Lanka
        </div>
      `
    },
    final_comp1: {
      title: "Individual Report: AI-Based EV Operational Anomaly Detection",
      cat: "Specialized Thesis Chapter • Vidushan A.A.D.D.N",
      body: `
        <p style="color:#cbd5e1; margin-bottom:12px;">Detailed exploration of Isolation Forest, One-Class SVM, and Deep Autoencoder on 9-variable telemetry streams. Demonstrates normal score 0.08, critical charging fault 0.96, and high-severity motor anomaly 0.91.</p>
      `
    },
    final_comp2: {
      title: "Individual Report: Adaptive Battery Health & Recommendation Engine",
      cat: "Specialized Thesis Chapter • Dias N.T.B.P",
      body: `
        <p style="color:#cbd5e1; margin-bottom:12px;">Empirical evaluation of Random Forest vs XGBoost across 3, 6, and 12-month horizons. Random Forest achieved superior accuracy with 12-month R² of 0.99917 and MAE of 0.0246, alongside rule-based behavioral extensions.</p>
      `
    },
    final_comp3: {
      title: "Individual Report: Intelligent Charging Optimization & Range Prediction",
      cat: "Specialized Thesis Chapter • Fernando C.T.H.H.D",
      body: `
        <p style="color:#cbd5e1; margin-bottom:12px;">Integration of Hybrid LSTM dynamic range estimator (RMSE 4.12 km), ARIMA-LSTM queue forecast (MAE 2.4 min), and A*/Dijkstra multi-criteria charging path finder (94.2% score).</p>
      `
    },
    final_comp4: {
      title: "Individual Report: AI-Based EV Virtual Assistant with RAG",
      cat: "Specialized Thesis Chapter • Jayarathne W.T.D.K",
      body: `
        <p style="color:#cbd5e1; margin-bottom:12px;">Implementation of Dense Passage Retrieval (DPR) and Retrieval-Augmented Generation for conversational EV diagnostics, battery maintenance advice, and multimodal voice interaction.</p>
      `
    },
    slide_deck: {
      title: "Academic Presentation Deck Preview",
      cat: "Presentation Slides • Official Defense",
      body: `
        <h4 style="color:#38bdf8; margin-bottom:8px;">Slide Presentation Summary</h4>
        <p style="color:#cbd5e1; margin-bottom:12px;">Includes slide sequence covering Motivation &amp; Background, Literature Survey &amp; Research Gap, 4-Module System Architecture, Experimental Results &amp; Benchmarks, Mobile Application Live Demo, and Conclusion.</p>
        <p style="color:#10b981;">Provisions for future progress reviews and final viva-voce examination preserved.</p>
      `
    }
  };

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const docKey = btn.getAttribute('data-modal-doc');
      const data = docDatabase[docKey] || docDatabase.charter;

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalCategory) modalCategory.textContent = data.cat;
      if (modalBody) modalBody.innerHTML = data.body;

      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   6. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('projectContactForm');
  const toast = document.getElementById('toastNotification');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value;
    const email = document.getElementById('senderEmail').value;
    const subject = document.getElementById('emailSubject').value;
    const message = document.getElementById('emailBody').value;

    // Show feedback toast
    if (toast) {
      toast.textContent = `Thank you, ${name}! Your inquiry regarding "${subject}" has been drafted.`;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }

    // Optional mailto trigger
    const mailtoUri = `mailto:IT22157928@my.sliit.lk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Sender: " + name + " (" + email + ")\n\n" + message)}`;
    window.location.href = mailtoUri;

    contactForm.reset();
  });
}

/* ==========================================================================
   7. ARCHITECTURE DIAGRAM LIGHTBOX & ZOOM HANDLER
   ========================================================================== */
function initArchLightbox() {
  const modal = document.getElementById('archModalOverlay');
  const openBtn = document.getElementById('btnOpenArchModal');
  const archFrame = document.getElementById('archFrame');
  const closeBtn = document.getElementById('archModalClose');
  const zoomInBtn = document.getElementById('archZoomIn');
  const zoomOutBtn = document.getElementById('archZoomOut');
  const zoomResetBtn = document.getElementById('archZoomReset');
  const zoomContainer = document.getElementById('archZoomContainer');

  if (!modal) return;

  let currentZoom = 1;

  function updateZoom(newZoom) {
    currentZoom = Math.min(Math.max(newZoom, 0.6), 3.0);
    if (zoomContainer) {
      zoomContainer.style.transform = `scale(${currentZoom})`;
    }
  }

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateZoom(1);
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (archFrame) archFrame.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('arch-modal-body')) {
        closeModal();
      }
    });
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateZoom(currentZoom + 0.25);
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateZoom(currentZoom - 0.25);
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateZoom(1);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  const modalBody = document.getElementById('archModalBody');
  if (modalBody) {
    modalBody.addEventListener('wheel', (e) => {
      if (!modal.classList.contains('active')) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      updateZoom(currentZoom + delta);
    }, { passive: false });
  }
}
