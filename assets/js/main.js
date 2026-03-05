/**
 * Main JavaScript for the blog
 * Handles: theme toggle, mobile menu, TOC, back-to-top, scroll effects
 */

(function () {
  'use strict';

  /* ============================================================
     Theme Toggle
     ============================================================ */
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  function getCurrentTheme() {
    return html.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = getCurrentTheme();
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ============================================================
     Mobile Menu Toggle
     ============================================================ */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = !mobileNav.hidden;
      mobileNav.hidden = isOpen;
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.classList.toggle('open', !isOpen);
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!mobileNav.hidden && !menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
      }
    });
  }

  /* ============================================================
     Header Scroll Effect
     ============================================================ */
  const header = document.getElementById('site-header');

  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ============================================================
     Back to Top Button
     ============================================================ */
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     Table of Contents Generator
     ============================================================ */
  const tocContent = document.getElementById('toc-content');
  const postBody = document.getElementById('post-body');

  if (tocContent && postBody) {
    const headings = postBody.querySelectorAll('h2, h3, h4');

    if (headings.length > 0) {
      const tocList = buildTocList(headings);
      tocContent.appendChild(tocList);
      observeHeadings(headings);
    } else {
      const tocSidebar = document.getElementById('toc-sidebar');
      if (tocSidebar) tocSidebar.hidden = true;
    }
  }

  function buildTocList(headings) {
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';

    let currentH2List = null;
    let currentH3List = null;

    headings.forEach(function (heading) {
      const id = getOrCreateId(heading);
      const link = document.createElement('a');
      link.href = '#' + id;
      link.textContent = heading.textContent;
      link.setAttribute('data-heading-id', id);

      link.addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
      });

      const li = document.createElement('li');
      li.appendChild(link);

      if (heading.tagName === 'H2') {
        currentH2List = ul;
        currentH3List = null;
        ul.appendChild(li);
      } else if (heading.tagName === 'H3') {
        if (!currentH3List) {
          currentH3List = document.createElement('ul');
          currentH3List.style.listStyle = 'none';
          const lastH2Li = ul.lastElementChild;
          if (lastH2Li) {
            lastH2Li.appendChild(currentH3List);
          } else {
            ul.appendChild(currentH3List);
          }
        }
        currentH3List.appendChild(li);
      } else if (heading.tagName === 'H4') {
        const target = currentH3List || ul;
        const lastLi = target.lastElementChild;
        let h4List = lastLi ? lastLi.querySelector('ul') : null;
        if (!h4List) {
          h4List = document.createElement('ul');
          h4List.style.listStyle = 'none';
          if (lastLi) lastLi.appendChild(h4List);
          else target.appendChild(h4List);
        }
        h4List.appendChild(li);
      }
    });

    return ul;
  }

  function getOrCreateId(heading) {
    if (heading.id) return heading.id;
    const id = heading.textContent
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    heading.id = id;
    return id;
  }

  function observeHeadings(headings) {
    if (!window.IntersectionObserver) return;

    var headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
      10
    ) || 64;
    var topOffset = headerHeight + 24;
    var rootMarginTop = '-' + topOffset + 'px';

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        var tocLink = tocContent.querySelector('[data-heading-id="' + id + '"]');
        if (tocLink) {
          tocLink.classList.toggle('active', entry.isIntersecting);
        }
      });
    }, {
      rootMargin: rootMarginTop + ' 0px -70% 0px',
      threshold: 0
    });

    headings.forEach(function (h) { observer.observe(h); });
  }

  /* ============================================================
     Smooth Anchor Links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     Reading Progress Bar (Post pages)
     ============================================================ */
  if (document.querySelector('.post-layout')) {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'height:3px',
      'background:var(--accent)',
      'z-index:9999',
      'transition:width 0.1s ease',
      'width:0%'
    ].join(';');
    document.body.prepend(progressBar);

    window.addEventListener('scroll', function () {
      const scrollTop = document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(progress, 100) + '%';
    }, { passive: true });
  }

})();
