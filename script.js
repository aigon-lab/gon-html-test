const header = document.querySelector('#header');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 70);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
const nav = document.querySelector('[data-nav]');
const toggle = document.querySelector('[data-menu-toggle]');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.classList.toggle('is-active', open);
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle.classList.remove('is-active');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

/* 2026-09-27 追加：資格の証書を、どれも同じ大きさの枠で拡大表示する */
(() => {
  const links = document.querySelectorAll('.certificate-gallery a');
  if (!links.length) return;
  const box = document.createElement('div');
  box.className = 'cert-lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<button type="button" class="cert-lightbox-close" aria-label="閉じる">×</button><img alt="">';
  document.body.appendChild(box);
  const img = box.querySelector('img');
  const close = () => { box.classList.remove('is-open'); img.removeAttribute('src'); };
  links.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const thumb = a.querySelector('img');
    img.src = a.getAttribute('href');
    img.alt = thumb ? thumb.alt : '';
    box.classList.add('is-open');
    box.querySelector('.cert-lightbox-close').focus();
  }));
  box.addEventListener('click', e => { if (e.target !== img) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
