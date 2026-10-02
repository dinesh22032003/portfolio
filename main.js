/**
 * Dinesh Rajkumar Developer Portfolio - Core JavaScript
 * Features: Three.js 3D Code Matrix Sphere, Scrollspy, Modals, Dynamic Project Details & WhatsApp Direct Connect
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Set Current Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Initialize Interactive 3D Three.js Hero Canvas
  initThreeJsHero();

  // 4. Header Scroll State & ScrollSpy
  initHeaderAndScrollspy();

  // 5. Mobile Menu Drawer
  initMobileMenu();

  // 6. Resume Modal & Download
  initResumeModal();

  // 7. Project Architecture Modals
  initProjectModals();

  // 8. Contact Form Handler & Toast System
  initContactForm();
});

/* ==========================================================================
   3D Three.js Code Matrix Sphere & Particle Engine
   ========================================================================== */
function initThreeJsHero() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  
  // Perspective Camera
  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 28;

  // WebGL Renderer with antialiasing and alpha
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Main 3D Group
  const sphereGroup = new THREE.Group();
  scene.add(sphereGroup);

  // 1. Outer Geodesic Icosahedron Wireframe
  const sphereGeometry = new THREE.IcosahedronGeometry(11, 2);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x94A3B8,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereGroup.add(sphereMesh);

  // 2. Glowing Nodes on Vertices
  const nodeCount = sphereGeometry.attributes.position.count;
  const nodeGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(nodeCount * 3);

  for (let i = 0; i < nodeCount * 3; i++) {
    positions[i] = sphereGeometry.attributes.position.array[i];
  }
  nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const nodeMaterial = new THREE.PointsMaterial({
    color: 0x2563EB, // Sapphire Accent
    size: 0.6,
    transparent: true,
    opacity: 0.85
  });
  const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
  sphereGroup.add(nodePoints);

  // 3. Inner Rotating Core Matrix
  const innerGeometry = new THREE.OctahedronGeometry(6, 1);
  const innerMaterial = new THREE.MeshBasicMaterial({
    color: 0x0F172A,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
  sphereGroup.add(innerMesh);

  // 4. Floating Orbital Particle Cloud
  const particleCount = 140;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = 14 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i + 2] = radius * Math.cos(phi);
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x10B981, // Emerald Accent
    size: 0.45,
    transparent: true,
    opacity: 0.65
  });
  const particleCloud = new THREE.Points(particleGeo, particleMat);
  sphereGroup.add(particleCloud);

  // Mouse Interaction & Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.0008;
    mouseY = (event.clientY - windowHalfY) * 0.0008;

    if (isDragging) {
      const deltaX = event.clientX - prevMouseX;
      const deltaY = event.clientY - prevMouseY;
      sphereGroup.rotation.y += deltaX * 0.008;
      sphereGroup.rotation.x += deltaY * 0.008;
      prevMouseX = event.clientX;
      prevMouseY = event.clientY;
    }
  }

  function onMouseDown(event) {
    isDragging = true;
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
  }

  function onMouseUp() {
    isDragging = false;
  }

  // Touch Support for Mobile
  function onTouchMove(event) {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      mouseX = (touch.clientX - windowHalfX) * 0.0008;
      mouseY = (touch.clientY - windowHalfY) * 0.0008;
    }
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mousedown', onMouseDown, { passive: true });
  window.addEventListener('mouseup', onMouseUp, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  // Resize Handler
  function onResize() {
    if (!canvas) return;
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);
  onResize();

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Constant smooth rotation
    if (!isDragging) {
      sphereGroup.rotation.y += 0.0025;
      sphereGroup.rotation.x += 0.001;
      innerMesh.rotation.y -= 0.004;
      particleCloud.rotation.y += 0.0015;
    }

    // Parallax easing toward mouse
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    sphereGroup.position.x = targetX * 12;
    sphereGroup.position.y = -targetY * 12;

    renderer.render(scene, camera);
  }

  animate();
}

/* ==========================================================================
   Header Scroll State & Scrollspy
   ========================================================================== */
function initHeaderAndScrollspy() {
  const header = document.getElementById('site-header');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  function updateHeader() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy
    let currentSection = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

/* ==========================================================================
   Mobile Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item');

  if (!toggleBtn || !mobileNav) return;

  toggleBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const isOpen = mobileNav.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  });
}

/* ==========================================================================
   Resume Modal & Download
   ========================================================================== */
function initResumeModal() {
  const resumeBtn = document.getElementById('resume-btn');
  const mobileResumeBtn = document.getElementById('mobile-resume-btn');
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('close-resume-modal');
  const downloadBtn = document.getElementById('download-resume-btn');

  function openResume() {
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResume() {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (resumeBtn) resumeBtn.addEventListener('click', openResume);
  if (mobileResumeBtn) mobileResumeBtn.addEventListener('click', openResume);
  if (closeBtn) closeBtn.addEventListener('click', closeResume);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeResume();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeResume();
    }
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      showToast('Opening Resume Print View / PDF Export...');
      window.print();
    });
  }
}

/* ==========================================================================
   Project Architecture Modals
   ========================================================================== */
const projectData = {
  digitalcake: {
    title: 'Digitalcake — AI-Driven Prototype & Full-Stack System',
    html: `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:18px; border-radius:12px;">
          <h4 style="font-family:var(--font-display); font-size:1.1rem; color:#0F172A; margin-bottom:8px;">Executive Architecture Overview</h4>
          <p style="font-size:0.95rem; color:#475569; line-height:1.6;">
            <strong>Digitalcake</strong> is a next-generation software prototype engineered to demonstrate modern AI orchestration. It incorporates a structured Python backend powered by LLM inference APIs with strict schema validation, paired with dynamic web components for real-time interaction.
          </p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:16px; border-radius:12px;">
            <h5 style="font-weight:700; color:#0F172A; margin-bottom:8px;">⚙️ Backend & AI Pipeline</h5>
            <ul style="font-size:0.88rem; color:#475569; padding-left:18px; line-height:1.6;">
              <li>Python core with modular service architecture.</li>
              <li>LLM reasoning loop with JSON schema response enforcement.</li>
              <li>Async request routing & rate-limiting.</li>
              <li>Local cache layer to optimize token consumption.</li>
            </ul>
          </div>
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:16px; border-radius:12px;">
            <h5 style="font-weight:700; color:#0F172A; margin-bottom:8px;">🌐 Frontend & UX</h5>
            <ul style="font-size:0.88rem; color:#475569; padding-left:18px; line-height:1.6;">
              <li>Interactive interface with sub-100ms UI responsiveness.</li>
              <li>Live state feedback during heavy AI compute cycles.</li>
              <li>Mobile-optimized responsive layouts.</li>
            </ul>
          </div>
        </div>

        <div style="display:flex; gap:12px; margin-top:8px;">
          <a href="https://wa.me/919894141152?text=Hi%20Dinesh,%20let's%20discuss%20the%20Digitalcake%20architecture!" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="btn-primary-wa">
            Discuss Digitalcake on WhatsApp
          </a>
          <a href="https://github.com/dinesh22032003/portfolio" target="_blank" rel="noopener noreferrer" class="btn-outline">
            View on GitHub
          </a>
        </div>
      </div>
    `
  },
  analytics: {
    title: 'Smart Insights — Streamlit & Pandas Data Suite',
    html: `
      <div style="display:flex; flex-direction:column; gap:18px;">
        <p style="font-size:0.95rem; color:#475569; line-height:1.6;">
          An automated business data analysis application built with <strong>Python, Pandas, and Streamlit</strong>. Built to solve repetitive manual reporting by reading CSV/SQL streams, executing null imputation and statistical grouping, and rendering high-impact charts.
        </p>
        <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:16px; border-radius:12px;">
          <h5 style="font-weight:700; color:#0F172A; margin-bottom:6px;">Key Capabilities</h5>
          <p style="font-size:0.88rem; color:#475569;">• Automated anomaly detection across high-dimensional numerical data.</p>
          <p style="font-size:0.88rem; color:#475569;">• Instant export to CSV, PDF summaries, and interactive Plotly visual graphs.</p>
          <p style="font-size:0.88rem; color:#475569;">• SQL query playground for ad-hoc business data exploration.</p>
        </div>
      </div>
    `
  },
  'genai-copilot': {
    title: 'Contextual GenAI Assistant & Copilot',
    html: `
      <div style="display:flex; flex-direction:column; gap:18px;">
        <p style="font-size:0.95rem; color:#475569; line-height:1.6;">
          Engineered to demonstrate enterprise-grade retrieval and conversational reasoning using modern Large Language Models.
        </p>
        <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:16px; border-radius:12px;">
          <h5 style="font-weight:700; color:#0F172A; margin-bottom:6px;">Core Features</h5>
          <p style="font-size:0.88rem; color:#475569;">• Zero-shot & Few-shot prompt templates tailored for domain synthesis.</p>
          <p style="font-size:0.88rem; color:#475569;">• Markdown formatting and code extraction support in real-time chat.</p>
        </div>
      </div>
    `
  },
  'web-portal': {
    title: 'Modern Commercial Portal & Web Platform',
    html: `
      <div style="display:flex; flex-direction:column; gap:18px;">
        <p style="font-size:0.95rem; color:#475569; line-height:1.6;">
          High-performance web architecture engineered for speed, SEO excellence, and cross-device fluidity.
        </p>
        <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:16px; border-radius:12px;">
          <h5 style="font-weight:700; color:#0F172A; margin-bottom:6px;">Highlights</h5>
          <p style="font-size:0.88rem; color:#475569;">• 100/100 Google Lighthouse Core Web Vitals target.</p>
          <p style="font-size:0.88rem; color:#475569;">• Seamless Vercel static Edge hosting with global CDN caching.</p>
        </div>
      </div>
    `
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const titleEl = document.getElementById('modal-project-title');
  const contentEl = document.getElementById('modal-project-content');
  const closeBtn = document.getElementById('close-project-modal');
  const previewBtns = document.querySelectorAll('.preview-project-btn');

  function openProject(projectId) {
    const data = projectData[projectId];
    if (!data || !modal) return;

    titleEl.textContent = data.title;
    contentEl.innerHTML = data.html;
    if (window.lucide) window.lucide.createIcons();

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProject() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  previewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const proj = btn.getAttribute('data-project');
      openProject(proj);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeProject);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProject();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeProject();
    }
  });
}

/* ==========================================================================
   Contact Form & Toast Notification Engine
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const contact = form.contact.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();

    if (!name || !contact || !message) {
      showToast('Please complete all required fields.');
      return;
    }

    // Set Loading State
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i data-lucide="check"></i> <span>Message Prepared</span>`;
        if (window.lucide) window.lucide.createIcons();
      }

      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `
          <strong>Thank you, ${name}!</strong> Your message regarding "<em>${subject}</em>" has been recorded.
          <br />
          <a href="https://wa.me/919894141152?text=Hi%20Dinesh,%20I%20sent%20a%20message%20via%20your%20portfolio.%20Name:%20${encodeURIComponent(name)}%20Subject:%20${encodeURIComponent(subject)}" 
             target="_blank" 
             style="color:#047857; font-weight:700; text-decoration:underline; display:inline-block; margin-top:6px;">
            Click here to also ping Dinesh directly on WhatsApp ↗
          </a>
        `;
        feedback.classList.remove('hidden');
      }

      showToast(`Thank you ${name}! You can also reach Dinesh at +91 9894141152`);
      form.reset();
    }, 600);
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
