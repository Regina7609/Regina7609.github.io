// Загрузка меню из JSON
fetch('/data/navigation.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Не удалось загрузить меню');
        }
        return response.json();
    })
    .then(data => {
        buildNavigation(data);
        highlightCurrentPage();
    })
    .catch(error => {
        console.error('Ошибка загрузки навигации:', error);
        document.getElementById('main-nav').innerHTML = '<li>Ошибка загрузки меню</li>';
    });

// Построение навигации
function buildNavigation(items) {
    const nav = document.getElementById('main-nav');

    items.forEach(item => {
        // Создаём элемент списка
        const li = document.createElement('li');
        li.className = 'nav-item';

        // Основная ссылка раздела
        const mainLink = document.createElement('a');
        mainLink.href = item.path;
        mainLink.textContent = item.title;
        mainLink.className = 'main-link';
        li.appendChild(mainLink);

        // Подменю
        if (item.submenu && item.submenu.length > 0) {
            const subDiv = document.createElement('div');
            subDiv.className = 'mega-menu';

            const ul = document.createElement('ul');
            item.submenu.forEach(sub => {
                const subLi = document.createElement('li');
                const subA = document.createElement('a');
                subA.href = sub.path;
                subA.textContent = sub.title;
                subLi.appendChild(subA);
                ul.appendChild(subLi);
            });

            subDiv.appendChild(ul);
            li.appendChild(subDiv);
        }

        nav.appendChild(li);
    });

    // Добавляем обработчики для мобильных устройств
    setupMobileMenu();
}

// Подсветка текущей страницы в меню
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const allLinks = document.querySelectorAll('#main-nav a');

    allLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (currentPath === linkPath) {
            link.style.backgroundColor = '#1abc9c';
            link.style.color = 'white';
        }
    });
}

// Мобильное меню (открытие по клику)
function setupMobileMenu() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const mainLink = item.querySelector('.main-link');

        mainLink.addEventListener('click', function (e) {
            // Проверяем, есть ли подменю
            const megaMenu = item.querySelector('.mega-menu');
            if (!megaMenu) return; // Если нет подменю, просто переходим по ссылке

            // На мобильных устройствах предотвращаем переход
            if (window.innerWidth <= 768) {
                e.preventDefault();
                // Закрываем все остальные открытые меню
                navItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Переключаем текущее
                item.classList.toggle('active');
            }
        });
    });

    // Закрываем меню при клике вне его
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-item')) {
            navItems.forEach(item => item.classList.remove('active'));
        }
    });
}
