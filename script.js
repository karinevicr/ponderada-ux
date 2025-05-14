document.addEventListener('DOMContentLoaded', function() {
    const browseButton = document.getElementById('browse-button');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const uploadForm = document.getElementById('upload-form');
    const uploadProgress = document.getElementById('upload-progress');
    const progressBar = document.querySelector('.progress-bar');
    const submitButton = document.getElementById('submit-button');
    
    // Abrir seletor de arquivos quando clicar no botão Browse
    browseButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Atualizar lista de arquivos selecionados
    fileInput.addEventListener('change', function() {
        fileList.innerHTML = '';
        
        if (this.files.length > 0) {
            submitButton.style.display = 'block';
            
            Array.from(this.files).forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                
                // Ícone baseado no tipo de arquivo
                let fileIcon = '📄';
                if (file.type.startsWith('image/')) fileIcon = '🖼️';
                else if (file.type.includes('pdf')) fileIcon = '📑';
                else if (file.type.includes('word')) fileIcon = '📝';
                
                // Tamanho formatado
                const fileSize = file.size < 1024 * 1024 
                    ? Math.round(file.size / 1024) + ' KB' 
                    : Math.round(file.size / (1024 * 1024) * 10) / 10 + ' MB';
                
                fileItem.innerHTML = `
                    <span class="file-icon">${fileIcon}</span>
                    <div class="file-info">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${fileSize}</span>
                    </div>
                    <button class="remove-file" data-index="${Array.from(this.files).indexOf(file)}">×</button>
                `;
                
                fileList.appendChild(fileItem);
            });
            
            // Adicionar eventos para remover arquivos
            document.querySelectorAll('.remove-file').forEach(button => {
                button.addEventListener('click', function() {
                    // Nota: Não podemos realmente remover arquivos do FileList
                    // Mas podemos esconder visualmente
                    this.closest('.file-item').style.display = 'none';
                    
                    // Se todos os arquivos foram removidos visualmente
                    if (Array.from(document.querySelectorAll('.file-item')).every(item => item.style.display === 'none')) {
                        submitButton.style.display = 'none';
                    }
                });
            });
        } else {
            submitButton.style.display = 'none';
        }
    });
    
    // Função para enviar arquivos
    submitButton.addEventListener('click', function() {
        if (fileInput.files.length === 0) return;
        
        const formData = new FormData();
        
        // Adicionar todos os arquivos que não foram "removidos" visualmente
        Array.from(fileInput.files).forEach((file, index) => {
            const fileItem = document.querySelectorAll('.file-item')[index];
            if (fileItem && fileItem.style.display !== 'none') {
                formData.append('files', file);
            }
        });
        
        // Mostrar barra de progresso
        uploadProgress.style.display = 'block';
        progressBar.style.width = '0%';
        
        // Simular upload com progresso
        // Em um caso real, você usaria XMLHttpRequest ou fetch para enviar ao servidor
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                
                // Mostrar mensagem de sucesso
                setTimeout(() => {
                    fileList.innerHTML = '<div class="upload-success">✅ Upload completed successfully!</div>';
                    uploadProgress.style.display = 'none';
                    submitButton.style.display = 'none';
                    
                    // Resetar depois de 3 segundos
                    setTimeout(() => {
                        fileList.innerHTML = '';
                        fileInput.value = '';
                    }, 3000);
                }, 500);
            }
        }, 100);
        
        /* 
        // Em um caso real, seria algo assim:
        fetch('/upload-endpoint', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Tratar resposta do servidor
        })
        .catch(error => {
            // Tratar erro de upload
        }); 
        */
    });
    
    // Permitir arrastar e soltar arquivos na área de upload
    const uploadBox = document.querySelector('.upload-box');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadBox.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadBox.classList.add('highlight');
    }
    
    function unhighlight() {
        uploadBox.classList.remove('highlight');
    }
    
    uploadBox.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        // Passar os arquivos arrastados para o input de arquivo
        fileInput.files = files;
        
        // Disparar evento change manualmente
        const event = new Event('change');
        fileInput.dispatchEvent(event);
    }
});