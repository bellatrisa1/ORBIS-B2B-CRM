# 🪐 Orbis B2B CRM

<div align="center">

**Современная B2B CRM-система для управления клиентами, заказами и задачами**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![Vitest](https://img.shields.io/badge/Tests-7/7-green?logo=vitest)](https://vitest.dev/)
[![SCSS](https://img.shields.io/badge/SCSS-Custom_Design-CC6699?logo=sass)](https://sass-lang.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

</div>

---

📸 Демо: https://orbis-b2-b-crm-kb48.vercel.app/

<div align="center">

| | | |
|:---:|:---:|:---:|
| **🏠 Лендинг** | **🔐 Авторизация** | **👥 Клиенты** |
| Современная посадочная страница | Логин / Регистрация | Таблица с поиском и фильтрами |
| **📋 Заказы** | **✅ Задачи** | **🔍 Детализация** |
| Статусы, суммы, дедлайны | Приоритеты, исполнители | Адреса, комментарии, позиции |

</div>

---

## ✨ Возможности

| 🚀 Функция | 💡 Описание |
|------------|-------------|
| **👥 Управление клиентами** | Единая база клиентов с контактами, адресами и заметками |
| **📋 Управление заказами** | Контроль статусов, сумм, позиций и дедлайнов |
| **✅ Управление задачами** | Отслеживание приоритетов, исполнителей и сроков |
| **🔐 Авторизация** | Session-based аутентификация с cookie |
| **🔍 Поиск и фильтрация** | Поиск по названию, фильтрация по статусу |
| **📱 Адаптивный дизайн** | Корректное отображение на всех устройствах |
| **🧪 Автоматические тесты** | Unit-тесты серверных функций на Vitest |
| **🎨 Кастомный дизайн** | Собственная дизайн-система на SCSS |

---

## 🛠 Технологический стек

<div align="center">

| Категория | Технологии |
|-----------|------------|
| **Framework** | ![Next.js](https://img.shields.io/badge/-Next.js_16-000?logo=next.js) |
| **Language** | ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) |
| **UI** | ![React](https://img.shields.io/badge/-React_19-61DAFB?logo=react) ![SCSS](https://img.shields.io/badge/-SCSS-CC6699?logo=sass&logoColor=white) |
| **State** | ![Zustand](https://img.shields.io/badge/-Zustand-433E38) ![React Query](https://img.shields.io/badge/-TanStack_Query-FF4154?logo=reactquery) |
| **Validation** | ![Zod](https://img.shields.io/badge/-Zod-3E67B1) ![React Hook Form](https://img.shields.io/badge/-React_Hook_Form-EC5990?logo=reacthookform) |
| **Testing** | ![Vitest](https://img.shields.io/badge/-Vitest-6E9F18?logo=vitest) |
| **Data** | JSON Mock Database (демо-режим) |

</div>

---

## 🚀 Быстрый старт

### 1. Клонируй репозиторий

```bash
git clone https://github.com/bellatrisa1/ORBIS-B2B-CRM.git
cd orbis-crm
```

### 2. Установи зависимости

```bash
npm install
```

### 3. Запусти dev-сервер

```bash
npm run dev
```

Открой [**http://localhost:3000**](http://localhost:3000) в браузере.

### 4. Войди в систему

| 🔑 Поле | 📝 Значение |
|---------|-------------|
| **Email** | `admin@orbis.com` |
| **Пароль** | `admin123` |

---

## 📂 Структура проекта

```
orbis-crm/
├── src/
│   ├── app/                        # 📄 Страницы и API-роуты (App Router)
│   │   ├── api/auth/               #   🔐 Логин, регистрация, выход
│   │   ├── clients/                #   👥 Список и детали клиентов
│   │   ├── orders/                 #   📋 Список и детали заказов
│   │   ├── tasks/                  #   ✅ Список и детали задач
│   │   ├── login/                  #   🔑 Страница входа
│   │   ├── register/               #   📝 Страница регистрации
│   │   ├── layout.tsx              #   🏗 Корневой layout
│   │   └── globals.scss            #   🎨 Глобальные стили
│   │
│   ├── features/                   # 🧠 Бизнес-логика
│   │   ├── clients/                #   Компоненты клиентов
│   │   ├── orders/                 #   Компоненты заказов
│   │   ├── tasks/                  #   Компоненты задач
│   │   └── server/                 #   Серверные функции (data layer)
│   │
│   ├── shared/                     # 🔧 Переиспользуемое
│   │   ├── lib/                    #   Утилиты (auth, db)
│   │   └── ui/                     #   UI-компоненты (AppShell, Header, Sidebar)
│   │
│   ├── types/                      # 📐 TypeScript-типы
│   └── __tests__/                  # 🧪 Тесты
│
├── vitest.config.ts                # ⚙️ Конфиг Vitest
├── package.json
└── README.md                       # 📖 Ты здесь!
```

---

## 🧪 Тестирование

```bash
# Запуск тестов
npm test

# Запуск в режиме UI
npm run test:ui
```

### Результаты тестов

```
✓ Auth helpers (1)
  ✓ encodeSession и decodeSession работают
✓ getUserByEmail (2)
  ✓ находит админа
  ✓ возвращает null для несуществующего
✓ getClients (2)
  ✓ возвращает всех клиентов
  ✓ фильтрует по статусу active
✓ getOrders (1)
  ✓ возвращает заказы
✓ getTasks (1)
  ✓ возвращает задачи

Test Files  2 passed
Tests       7 passed
```

---

## 🎨 Дизайн-система

| 🎯 Принцип | ✨ Реализация |
|------------|---------------|
| **Светлая тема** | Чистый фон `#fafbfc`, белые карточки |
| **Акцентный синий** | `#2563eb` для кнопок и ссылок |
| **Типографика** | Inter, крупный шрифт, хорошая читаемость |
| **Адаптивность** | Mobile-first, брейкпоинты на 768/1024/1280px |
| **Микровзаимодействия** | Hover-эффекты, плавные переходы |

---

## 🔮 Roadmap (что можно добавить)

- [ ] 📊 **Дашборд** с графиками и статистикой
- [ ] 🌙 **Тёмная тема** (переключатель)
- [ ] 🖼 **Загрузка аватаров** клиентов
- [ ] ✏️ **CRUD-операции** (создание/редактирование/удаление)
- [ ] 📧 **Email-уведомления**
- [ ] 🔐 **Роли и permissions** (админ/менеджер/поддержка)
- [ ] 📄 **Пагинация** для больших списков
- [ ] 🗄 **Подключение PostgreSQL** (Prisma/Drizzle)
- [ ] 🧪 **E2E тесты** (Playwright)

---

## 👩‍💻 Автор

<div align="center">

**Белла Манкиева**

[![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github)](https://github.com/bellatrisa1)
[![Telegram](https://img.shields.io/badge/-Telegram-26A5E4?logo=telegram)](https://t.me/bellatrix_bb)

</div>

---

## 📄 Лицензия

MIT © 2026 Orbis CRM

---

<div align="center">

### ⭐ Поставь звезду, если проект понравился!

**Сделано с 💙 для портфолио**

</div>
```
