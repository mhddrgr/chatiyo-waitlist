import { validateEntry } from './validation.mjs';
const form = document.querySelector('#waitlist-form');
const status = document.querySelector('#form-status');
const button = document.querySelector('#submit');
const label = document.querySelector('#button-label');
let busy = false;
function showStatus(message, kind) { status.textContent = message; status.dataset.kind = kind; }
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  showStatus('', '');
  const entry = validateEntry(form.elements.name.value, form.elements.phone.value);
  for (const field of ['name', 'phone']) {
    const error = entry[field + 'Error'];
    document.querySelector('#' + field + '-error').textContent = error;
    form.elements[field].setAttribute('aria-invalid', String(Boolean(error)));
  }
  if (entry.nameError || entry.phoneError) { form.elements[entry.nameError ? 'name' : 'phone'].focus(); return; }
  const endpoint = window.CHATIYO_CONFIG?.endpoint;
  if (!endpoint) { showStatus('ثبت‌نام به‌زودی فعال می‌شه. لطفاً کمی بعد دوباره سر بزن.', 'error'); return; }
  busy = true; button.disabled = true; form.setAttribute('aria-busy', 'true'); label.textContent = 'در حال ثبت…';
  try {
    const response = await fetch(endpoint, { method: 'POST', redirect: 'follow',
      body: new URLSearchParams({ name: entry.name, phone: entry.phone, website: form.elements.website.value }),
      signal: AbortSignal.timeout(25000) });
    if (!response.ok) throw new Error('http');
    const result = await response.json();
    if (!result.ok) throw new Error('rejected');
    form.reset();
    showStatus('ثبت‌نامت انجام شد! وقتی چتیو آماده شد، برای دسترسی رایگان بهت خبر می‌دیم.', 'success');
    label.textContent = 'ثبت‌نام انجام شد';
  } catch {
    showStatus('ثبت‌نام انجام نشد. لطفاً دوباره تلاش کن.', 'error');
    label.textContent = 'تلاش دوباره';
  } finally { busy = false; button.disabled = false; form.removeAttribute('aria-busy'); }
});
