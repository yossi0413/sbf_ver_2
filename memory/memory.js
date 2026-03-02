document.addEventListener('DOMContentLoaded', () => {
    const worksGrid = document.getElementById('works-grid');
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');

    // Modal Elements
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalImageContainer = document.getElementById('modal-image-container');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalLinks = document.getElementById('modal-links');

    // Fallback Data (For local file:// execution where fetch fails)
    const fallbackData = [
        {
            "title": "冬合宿に行ってきました",
            "date": "2025-03-03",
            "thumbnail": "images/20250303_01.jpg",
            "description": "冬合宿に行ってきました\n2025 年 3 月 03 日～ 05 日の 2 泊 3 日で滋賀県大津市にて合宿を実施しました．\n初日はらじも～んの特別回として，「京言葉クイズ」を実施．2 日目には京都市内で観光地を利用したリアルすごろく対決企画を収録しました．\n※ 写真はオープニング収録の様子．",
            "links": []
        },
        {
            "title": "SMBCLIFE…",
            "date": "2025-08-12",
            "thumbnail": "",
            "description": "冬合宿に行ってきました\n2025 年 3 月 03 日～ 05 日の 2 泊 3 日で滋賀県大津市にて合宿を実施しました．\n初日はらじも～んの特別回として，「京言葉クイズ」を実施．2 日目には京都市内で観光地を利用したリアルすごろく対決企画を収録しました．\n※ 写真はオープニング収録の様子．",
            "links": []
        },
        {
            "title": "夏合宿に行ってきました",
            "date": "2025-03-05",
            "thumbnail": "",
            "description": "冬合宿に行ってきました\n2025 年 3 月 03 日～ 05 日の 2 泊 3 日で滋賀県大津市にて合宿を実施しました．\n初日はらじも～んの特別回として，「京言葉クイズ」を実施．2 日目には京都市内で観光地を利用したリアルすごろく対決企画を収録しました．\n※ 写真はオープニング収録の様子．",
            "links": []
        }
    ];

    // Fetch Data
    fetch('works.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load works.json');
            }
            return response.json();
        })
        .then(data => {
            loadingEl.style.display = 'none';
            if (data.length === 0) {
                errorEl.textContent = 'No works found.';
                errorEl.style.display = 'block';
            } else {
                renderWorks(data);
                showDataSource('works.json (Server)');
            }
        })
        .catch(err => {
            console.warn('Fetch failed (likely file:// protocol), using fallback data:', err);
            // ローカル実行時(file://)はfetchできないため、fallbackDataを表示する
            renderWorks(fallbackData);
            loadingEl.style.display = 'none';
            showDataSource('Internal Data (Local Mode)');
        });

    function showDataSource(sourceLabel) {
        const sourceEl = document.createElement('div');
        sourceEl.style.textAlign = 'center';
        sourceEl.style.fontSize = '0.8rem';
        sourceEl.style.color = '#888';
        sourceEl.style.marginTop = '10px';
        sourceEl.textContent = `Data Source: ${sourceLabel}`;
        // Insert after H1 or grid
        worksGrid.parentNode.insertBefore(sourceEl, worksGrid);
    }

    function renderWorks(works) {
        // Sort: Date Descending, then Title Ascending
        works.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            // Invalid dates go to end
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;

            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;

            return a.title.localeCompare(b.title);
        });

        works.forEach(work => {
            const card = document.createElement('div');
            card.className = 'work-card';

            // Thumbnail
            const imgContainer = document.createElement('div');
            imgContainer.className = 'work-thumbnail';
            if (work.thumbnail) {
                const img = document.createElement('img');
                img.src = work.thumbnail;
                img.alt = work.title;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.onerror = () => {
                    img.style.display = 'none';
                    imgContainer.textContent = 'No Image';
                };
                imgContainer.appendChild(img);
            } else {
                imgContainer.textContent = 'No Image';
            }
            card.appendChild(imgContainer);

            // Info
            const info = document.createElement('div');
            info.className = 'work-info';

            const title = document.createElement('h3');
            title.className = 'work-title';
            title.textContent = work.title;
            info.appendChild(title);

            const date = document.createElement('div');
            date.className = 'work-date';
            date.textContent = work.date || 'Unknown Date';
            info.appendChild(date);

            card.appendChild(info);

            // Click Event
            card.addEventListener('click', () => openModal(work));

            worksGrid.appendChild(card);
        });
    }

    function openModal(work) {
        modalTitle.textContent = work.title;
        modalDate.textContent = work.date || '';

        // Image Rendering
        if (work.thumbnail) {
            modalImage.src = work.thumbnail;
            modalImage.alt = work.title;
            modalImageContainer.style.display = 'block';
        } else {
            modalImage.src = '';
            modalImage.alt = '';
            modalImageContainer.style.display = 'none';
        }

        // Secure Description Rendering
        modalDescription.innerHTML = ''; // Clear previous
        if (work.description) {
            const lines = work.description.split('\n');
            lines.forEach((line, index) => {
                const span = document.createElement('span');
                span.textContent = line;
                modalDescription.appendChild(span);
                if (index < lines.length - 1) {
                    modalDescription.appendChild(document.createElement('br'));
                }
            });
        }

        // Links
        modalLinks.innerHTML = '';
        if (work.links && Array.isArray(work.links)) {
            work.links.forEach(link => {
                if (link.url && (link.url.startsWith('http') || link.url.startsWith('https'))) {
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.textContent = link.label || 'Link';
                    a.className = 'btn btn-primary';
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.style.padding = '8px 20px';
                    a.style.fontSize = '0.9rem';
                    modalLinks.appendChild(a);
                }
            });
        } else {
            // If no links, maybe hide the container or leave empty? 
            // Current CSS handles empty flex container fine.
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    // Modal Close Triggers
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
});
