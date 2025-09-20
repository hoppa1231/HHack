const API_BASE_URL = (() => {
  if (window.location.origin && window.location.origin !== 'null') {
    const url = new URL(window.location.href);
    return `${url.protocol}//${url.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
})();

const state = {
  token: null,
  currentUser: null,
};

const elements = {
  authStatus: document.getElementById('auth-status'),
  activeToken: document.getElementById('active-token'),
  logoutButton: document.getElementById('logout'),
  message: document.getElementById('message'),
  registerForm: document.getElementById('register-form'),
  loginForm: document.getElementById('login-form'),
  newsForm: document.getElementById('news-form'),
  newsResults: document.getElementById('news-results'),
};

function updateAuthView() {
  if (state.token) {
    elements.authStatus.textContent = state.currentUser
      ? `Авторизованы как ${state.currentUser}`
      : 'Авторизованы';
    elements.activeToken.textContent = state.token;
    elements.logoutButton.disabled = false;
  } else {
    elements.authStatus.textContent = 'Не авторизованы';
    elements.activeToken.textContent = '';
    elements.logoutButton.disabled = true;
  }
}

function showMessage(message, type = 'info') {
  elements.message.textContent = message;
  elements.message.className = `toast toast--${type}`;
  elements.message.hidden = false;
  clearTimeout(elements.message.hideTimeout);
  elements.message.hideTimeout = setTimeout(() => {
    elements.message.hidden = true;
  }, 5000);
}

function collectPreferences(formData) {
  return formData.getAll('preferences');
}

async function apiRequest(path, payload, { requiresAuth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (requiresAuth && state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let detail = '';
    try {
      const errorBody = await response.json();
      detail = errorBody?.detail || JSON.stringify(errorBody);
    } catch (error) {
      detail = await response.text();
    }
    throw new Error(detail || 'Неизвестная ошибка сервера');
  }

  return response.json();
}

function renderNews(news) {
  elements.newsResults.replaceChildren();

  if (!news?.length) {
    const emptyState = document.createElement('p');
    emptyState.className = 'news-empty';
    emptyState.textContent = 'Новости не найдены для выбранных параметров.';
    elements.newsResults.append(emptyState);
    return;
  }

  news.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'news-card';
    article.setAttribute('role', 'listitem');

    const header = document.createElement('div');
    header.className = 'news-card__header';

    const title = document.createElement('h3');
    title.textContent = item.header;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary-button';
    button.textContent = 'Получить сводку';

    header.append(title, button);

    const body = document.createElement('p');
    body.className = 'news-card__description';
    body.textContent = item.mini_description;

    const footer = document.createElement('div');
    footer.className = 'news-card__footer';

    const preview = document.createElement('img');
    preview.src = item.img_url;
    preview.alt = `Иллюстрация новости ${item.header}`;

    const summary = document.createElement('div');
    summary.className = 'news-card__summary';
    summary.textContent = 'Сводка пока не загружена.';

    button.addEventListener('click', async () => {
      summary.textContent = 'Загружаем сводку…';
      button.disabled = true;
      try {
        const data = await apiRequest('/summary', { news_id: item.news_id }, {
          requiresAuth: true,
        });
        summary.textContent = data.summary;
        showMessage('Сводка успешно загружена', 'success');
      } catch (error) {
        summary.textContent = 'Не удалось получить сводку.';
        showMessage(error.message, 'error');
      } finally {
        button.disabled = false;
      }
    });

    footer.append(preview, summary);
    article.append(header, body, footer);
    elements.newsResults.append(article);
  });
}

function attachEventListeners() {
  elements.registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get('name'),
      password: formData.get('password'),
      preferences: collectPreferences(formData),
    };

    try {
      const data = await apiRequest('/register', payload);
      state.token = data.access_token;
      state.currentUser = payload.name;
      updateAuthView();
      showMessage('Регистрация прошла успешно', 'success');
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });

  elements.loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get('name'),
    };

    try {
      const data = await apiRequest('/login', payload);
      state.token = data.access_token;
      state.currentUser = payload.name;
      updateAuthView();
      showMessage('Авторизация выполнена', 'success');
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });

  elements.newsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.token) {
      showMessage('Сначала выполните вход или регистрацию.', 'error');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      user_id: Number(formData.get('userId')),
      news_period: formData.get('period'),
    };

    try {
      const data = await apiRequest('/news', payload, { requiresAuth: true });
      renderNews(data.news);
      showMessage('Новости обновлены', 'success');
    } catch (error) {
      renderNews([]);
      showMessage(error.message, 'error');
    }
  });

  elements.logoutButton.addEventListener('click', () => {
    state.token = null;
    state.currentUser = null;
    updateAuthView();
    renderNews([]);
    showMessage('Вы вышли из приложения', 'info');
  });
}

function init() {
  attachEventListeners();
  updateAuthView();
  renderNews([]);
}

init();
