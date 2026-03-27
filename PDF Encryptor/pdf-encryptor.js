// pdf-encryptor.js - Core PDF encryptor functionality

class PDFEncryptor {
    constructor(apiUrl, options = {}) {
        this.apiUrl = apiUrl;
        this.options = {
            containerId: 'pdf-encryptor-container',
            ...options
        };
        this.init();
    }
    
    async encryptPDF(file, password) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('password', password);
        formData.append('password_confirm', password);
        
        try {
            const response = await fetch(`${this.apiUrl}/encrypt`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                let errorMessage;
                try {
                    const error = await response.json();
                    errorMessage = error.detail || `HTTP ${response.status}: ${response.statusText}`;
                } catch {
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `LOCKED_${file.name}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            
            return { success: true };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        const form = document.getElementById(`${this.options.containerId}-form`);
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        const dropZone = document.getElementById(`${this.options.containerId}-dropzone`);
        const fileInput = document.getElementById(`${this.options.containerId}-file`);
        
        if (dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', () => this.handleFileSelect());
            
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });
            
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });
            
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                fileInput.files = e.dataTransfer.files;
                this.handleFileSelect();
            });
        }
        
        const password = document.getElementById(`${this.options.containerId}-password`);
        const confirm = document.getElementById(`${this.options.containerId}-confirm`);
        
        if (password) {
            password.addEventListener('input', () => this.checkStrength(password.value));
        }
        
        if (password && confirm) {
            password.addEventListener('input', () => this.updateMatchStatus(password.value, confirm.value));
            confirm.addEventListener('input', () => this.updateMatchStatus(password.value, confirm.value));
        }
    }
    
    handleFileSelect() {
        const fileInput = document.getElementById(`${this.options.containerId}-file`);
        const file = fileInput.files[0];
        if (!file) return;
        
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            this.showToast('Please select a PDF file', 'error');
            this.clearFile();
            return;
        }
        
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showToast('File too large. Maximum size is 50MB', 'error');
            this.clearFile();
            return;
        }
        
        document.getElementById(`${this.options.containerId}-drop-text`).classList.add('hidden');
        document.getElementById(`${this.options.containerId}-selected`).classList.remove('hidden');
        document.getElementById(`${this.options.containerId}-filename`).textContent = file.name;
        document.getElementById(`${this.options.containerId}-filesize`).textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
    }
    
    clearFile() {
        const fileInput = document.getElementById(`${this.options.containerId}-file`);
        fileInput.value = '';
        document.getElementById(`${this.options.containerId}-drop-text`).classList.remove('hidden');
        document.getElementById(`${this.options.containerId}-selected`).classList.add('hidden');
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        const fileInput = document.getElementById(`${this.options.containerId}-file`);
        const password = document.getElementById(`${this.options.containerId}-password`).value;
        const confirm = document.getElementById(`${this.options.containerId}-confirm`).value;
        const file = fileInput.files[0];
        
        if (!file) {
            this.showToast('Please select a PDF file', 'error');
            return;
        }
        
        if (!password) {
            this.showToast('Please enter a password', 'error');
            return;
        }
        
        if (password !== confirm) {
            this.showToast('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 8) {
            this.showToast('Password must be at least 8 characters', 'error');
            return;
        }
        
        const btn = document.getElementById(`${this.options.containerId}-btn`);
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> ENCRYPTING...';
        
        try {
            await this.encryptPDF(file, password);
            this.showToast('✅ PDF encrypted successfully!', 'success');
        } catch (error) {
            this.showToast(`❌ Encryption failed: ${error.message}`, 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
    
    checkStrength(password) {
        const bar = document.getElementById(`${this.options.containerId}-strength-bar`);
        if (!bar) return;
        
        let strength = 0;
        if (password.length >= 8) strength += 30;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;
        
        bar.style.width = strength + '%';
        bar.style.backgroundColor = strength > 70 ? '#22c55e' : strength > 40 ? '#FFCC00' : '#ef4444';
    }
    
    updateMatchStatus(pwd, confirm) {
        const status = document.getElementById(`${this.options.containerId}-match-status`);
        if (!status) return;
        
        if (!confirm) {
            status.classList.add('hidden');
            return;
        }
        
        status.classList.remove('hidden');
        if (pwd === confirm) {
            status.innerHTML = '✅ Passwords match';
            status.style.color = '#22c55e';
        } else {
            status.innerHTML = '❌ Passwords do not match';
            status.style.color = '#ef4444';
        }
    }
    
    showToast(message, type = 'info') {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('pdf-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'pdf-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #1F160F;
                color: white;
                padding: 12px 24px;
                border-radius: 12px;
                border-left: 4px solid #FFCC00;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                z-index: 1000;
            `;
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.borderLeftColor = type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#FFCC00';
        toast.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
        }, 5000);
    }
}

// Initialize when the DOM is ready
window.PDFEncryptor = PDFEncryptor;
