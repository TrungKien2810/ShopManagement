// Global Toast Helper
window.showToast = function (message, type = 'info', duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-toast-enter`;

    let icon = 'ℹ';
    if (type === 'success') icon = '✓';
    else if (type === 'error') icon = '✗';
    else if (type === 'warning') icon = '⚠';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">${message}</div>
        <button type="button" class="toast-close">&times;</button>
    `;
    container.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = function () {
        if (!toast.parentNode) return;
        toast.classList.remove('animate-toast-enter');
        toast.classList.add('animate-toast-exit');
        setTimeout(function () {
            toast.remove();
        }, 150);
    };

    closeBtn.onclick = dismiss;
    
    if (duration > 0) {
        setTimeout(dismiss, duration);
    }
};

(function () {
    // Sidebar Esc handler
    var shell = document.getElementById('app-shell');
    var toggle = document.getElementById('sidebar-toggle');
    var backdrop = document.getElementById('sidebar-backdrop');

    if (shell && toggle && backdrop) {
        var setOpen = function (open) {
            shell.classList.toggle('sidebar-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        };

        toggle.addEventListener('click', function () {
            setOpen(!shell.classList.contains('sidebar-open'));
        });
        backdrop.addEventListener('click', function () {
            setOpen(false);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && shell.classList.contains('sidebar-open')) {
                setOpen(false);
            }
        });
    }

    // Intercept forms with data-confirm or classic confirm submit
    document.addEventListener('submit', function (event) {
        var form = event.target;
        var confirmMessage = form.getAttribute('data-confirm');
        if (!confirmMessage) return;

        event.preventDefault();

        var modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'modal-backdrop animate-fade-in';
        modalBackdrop.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        var modal = document.createElement('div');
        modal.className = 'linear-card animate-modal-enter';
        modal.style.cssText = `
            max-width: 480px;
            width: 90vw;
            padding: 24px;
            border-radius: 16px;
            position: relative;
        `;

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h2 class="font-display" style="margin: 0; font-size: 20px;">Xác nhận</h2>
                <button type="button" class="modal-close-btn" style="background: none; border: none; color: var(--color-warm-white); font-size: 24px; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
            </div>
            <p style="color: var(--color-warm-gray); margin: 16px 0; font-size: 15px; line-height: 1.5;">${confirmMessage}</p>
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
                <button type="button" class="btn-secondary modal-cancel-btn" style="min-height: 40px; padding: 8px 16px; font-size: 14px;">Hủy</button>
                <button type="button" class="btn-primary modal-confirm-btn" style="min-height: 40px; padding: 8px 16px; font-size: 14px; background-image: linear-gradient(135deg, var(--color-ember) 0%, var(--color-clay) 100%);">Xác nhận</button>
            </div>
        `;

        modalBackdrop.appendChild(modal);
        document.body.appendChild(modalBackdrop);

        function closeModal() {
            modal.classList.remove('animate-modal-enter');
            modal.classList.add('animate-modal-exit');
            modalBackdrop.style.animation = 'fade-out 0.15s forwards';
            setTimeout(function () {
                modalBackdrop.remove();
            }, 150);
        }

        modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
        modal.querySelector('.modal-cancel-btn').addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', function (e) {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });

        function handleEsc(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        }
        document.addEventListener('keydown', handleEsc);

        modal.querySelector('.modal-confirm-btn').addEventListener('click', function () {
            document.removeEventListener('keydown', handleEsc);
            closeModal();
            HTMLFormElement.prototype.submit.call(form);
        });
    });
})();
