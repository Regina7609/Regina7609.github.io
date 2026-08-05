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

// Рекурсивное построение вложенного меню
function buildSubmenu(items, parentElement) {
    const ul = document.createElement('ul');

    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.path;
        a.textContent = item.title;
        li.appendChild(a);

        // Если есть вложенное подменю — строим рекурсивно
        if (item.submenu && item.submenu.length > 0) {
            const nestedDiv = document.createElement('div');
            nestedDiv.className = 'mega-menu';
            buildSubmenu(item.submenu, nestedDiv);
            li.appendChild(nestedDiv);
        }

        ul.appendChild(li);
    });

    parentElement.appendChild(ul);
}

// Построение главной навигации
function buildNavigation(items) {
    const nav = document.getElementById('main-nav');

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'nav-item';

        const mainLink = document.createElement('a');
        mainLink.href = item.path;
        mainLink.textContent = item.title;
        mainLink.className = 'main-link';
        li.appendChild(mainLink);

        // Если есть подменю — строим рекурсивно
        if (item.submenu && item.submenu.length > 0) {
            const subDiv = document.createElement('div');
            subDiv.className = 'mega-menu';
            buildSubmenu(item.submenu, subDiv);
            li.appendChild(subDiv);
        }

        nav.appendChild(li);
    });

    setupMobileMenu();
}

// Подсветка текущей страницы
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

// Мобильное меню
function setupMobileMenu() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const mainLink = item.querySelector('.main-link');

        mainLink.addEventListener('click', function (e) {
            const megaMenu = item.querySelector('.mega-menu');
            if (!megaMenu) return;

            if (window.innerWidth <= 768) {
                e.preventDefault();
                navItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            }
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-item')) {
            navItems.forEach(item => item.classList.remove('active'));
        }
    });
}
