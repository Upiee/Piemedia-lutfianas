let currentPage = 1;
let pageSize = 10;
let sortBy = '-published_at';

const header = document.getElementById('header');
const sortSelect = document.getElementById('sort');
const perPageSelect = document.getElementById('perPage');
const postsContainer = document.getElementById('posts-container');
const pageNumber = document.getElementById('page-number');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');

let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        header.style.top = '-100px';
    } else {
        header.style.top = '0';
    }
    lastScrollY = window.scrollY;
});

function fetchPosts() {
    fetch(`https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${currentPage}&page[size]=${pageSize}&append[]=small_image&append[]=medium_image&sort=${sortBy}`)
        .then(response => response.json())
        .then(data => {
            renderPosts(data.data);
            updatePagination(data.meta.pagination);
        })
        .catch(error => console.error('Error:', error));
}

function renderPosts(posts) {
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');
        postCard.innerHTML = `
            <img src="${post.medium_image}" alt="${post.title}" loading="lazy">
            <h2>${post.title}</h2>
        `;
        postsContainer.appendChild(postCard);
    });
}

function updatePagination(pagination) {
    pageNumber.textContent = currentPage;
    prevPageButton.disabled = pagination.current_page === 1;
    nextPageButton.disabled = pagination.current_page === pagination.total_pages;
}

sortSelect.addEventListener('change', (e) => {
    sortBy = e.target.value === 'newest' ? '-published_at' : 'published_at';
    fetchPosts();
});

perPageSelect.addEventListener('change', (e) => {
    pageSize = e.target.value;
    fetchPosts();
});

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchPosts();
    }
});

nextPageButton.addEventListener('click', () => {
    currentPage++;
    fetchPosts();
});

fetchPosts();
