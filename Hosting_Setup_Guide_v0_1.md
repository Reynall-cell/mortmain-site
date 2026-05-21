# Hosting Setup Guide V0.1
## Mortmain Studio — Domain, Hosting, Email

> **Назначение:** провести Юрия от «есть HTML-файлы локально» до «mortmain.studio работает в интернете, email принимается, всё бесплатно или почти бесплатно».
> **Время:** 60-90 минут общего активного времени. + ожидание DNS-распространения (до 24 часов, обычно меньше часа).
> **Стоимость:** ~$20-25/год за домен `.studio`. Хостинг и email — бесплатно.

---

## Что мы строим

```
        твоя машина
            |
            ▼
       ┌────────┐                            ┌────────────┐
       │  Git   │ ◄───── push ───────────────│  GitHub /  │
       │  LFS   │                            │  GitLab    │
       └────────┘                            └─────┬──────┘
                                                   │
                                            connect│
                                                   ▼
       ┌─────────────────────┐         ┌──────────────────┐
       │  mortmain.studio    │ ◄─────► │  Cloudflare      │
       │  (your domain)      │   DNS   │  Pages           │
       └─────────────────────┘         │  (site hosting)  │
                  │                    └──────────────────┘
                  │
                  ▼
       ┌─────────────────────┐
       │  contact@mortmain.  │
       │  press@mortmain.    │  ───── forwards to ──→  your.gmail@gmail.com
       │  (your emails)      │
       └─────────────────────┘
       Cloudflare Email Routing
```

---

## Часть 1 — Регистрация и домен (20 минут)

### 1.1 Создать аккаунт Cloudflare

1. Зайти на **cloudflare.com**
2. Нажать **Sign Up** (правый верхний угол)
3. Email + надёжный пароль. Включить 2FA сразу после первого входа (Account → Security → Two-Factor Authentication)

**Проверка:** ты вошёл в Cloudflare Dashboard.

### 1.2 Проверить и купить домен

1. В Dashboard слева — **Domain Registration** → **Register Domains**
2. В поле поиска ввести: `mortmain.studio`
3. Если **свободен** — рядом будет кнопка **Purchase**
4. Если **занят** — поробовать `mortmain.games` или `mortmainstudio.com`

**Цены на 2026:**
- `.studio` — ~$20-25/год
- `.games` — ~$30-35/год
- `.com` — ~$10/год

**Важно:** Cloudflare продаёт домены **по at-cost цене**, то есть **без накруток**. То же доменное имя у GoDaddy или Namecheap стоит на 20-50% дороже. Покупать у Cloudflare разумно.

5. **Регистрация:** заполни контактные данные (твоё имя и адрес). Можно включить **WHOIS privacy** — бесплатно у Cloudflare. Это скрывает твои персональные данные в публичной WHOIS-базе.
6. Оплата картой. Получишь домен через 1-5 минут.

**Проверка:** в Cloudflare Dashboard в разделе **Websites** появился `mortmain.studio` со статусом `Active`.

---

## Часть 2 — Хостинг сайта (30 минут)

### 2.1 Создать репозиторий с сайтом

Если у тебя уже есть GitHub/GitLab аккаунт для основного проекта (мы говорили про это в Setup_Guide для UE5) — используй его. Если нет — создай аккаунт **на GitHub** (он лучше интегрирован с Cloudflare Pages, чем GitLab).

1. На GitHub: **New repository**
2. **Repository name:** `mortmain-site`
3. **Visibility:** Public (для сайта — нормально; основной проект игры останется приватным)
4. **Initialize with README:** оставь галку
5. **Create**

### 2.2 Загрузить файлы сайта

Самый простой способ для первой загрузки — через веб-интерфейс GitHub:

1. На странице нового репо нажать **Add file → Upload files**
2. Перетащить **все** файлы из папки с сайтом:
   - `index.html`
   - `about.html`
   - `faq.html`
   - `press.html`
   - `privacy.html`
   - `terms.html`
   - `shared.css`
   - `shared.js`
   - `ambient.mp3`
3. Commit message: `Initial site upload — v1.0`
4. **Commit changes**

Альтернатива через командную строку (предпочтительнее на долгий срок):
```bash
cd path/to/site/folder
git init
git add .
git commit -m "Initial site upload — v1.0"
git branch -M main
git remote add origin https://github.com/ТВОЙ_USERNAME/mortmain-site.git
git push -u origin main
```

**Проверка:** на странице репо в GitHub видны все файлы.

### 2.3 Подключить Cloudflare Pages к репозиторию

1. В Cloudflare Dashboard слева — **Workers & Pages**
2. Нажать **Create application** → вкладка **Pages** → **Connect to Git**
3. Авторизоваться через GitHub. Дать Cloudflare доступ **только к этому одному репо** (`mortmain-site`).
4. Выбрать репо `mortmain-site`
5. **Set up builds and deployments:**
   - **Project name:** `mortmain-site`
   - **Production branch:** `main`
   - **Framework preset:** None (это plain HTML, не Next.js/React)
   - **Build command:** оставить пустым
   - **Build output directory:** оставить `/` (root)
6. **Save and Deploy**

Cloudflare соберёт и развернёт сайт за 30-60 секунд. Получишь временный URL вида `mortmain-site.pages.dev`.

**Проверка:** открой `mortmain-site.pages.dev` в браузере. Сайт работает.

### 2.4 Привязать домен mortmain.studio к Pages

1. На странице проекта Pages → вкладка **Custom domains**
2. **Set up a custom domain**
3. Ввести: `mortmain.studio`
4. Cloudflare автоматически создаст нужные DNS-записи (CNAME), потому что и домен, и сайт на их инфраструктуре.
5. Подождать 1-15 минут — DNS должен распространиться.
6. Дополнительно настроить **www** редирект:
   - Custom domains → **Set up a custom domain** → `www.mortmain.studio`
   - Это автоматически перенаправит `www.mortmain.studio` на `mortmain.studio`

**Проверка:** через 5-15 минут — открой `https://mortmain.studio` в браузере. Сайт работает. SSL-сертификат (зелёный замок) — автоматический от Cloudflare.

---

## Часть 3 — Email (20 минут)

### 3.1 Включить Cloudflare Email Routing

1. В Cloudflare Dashboard → **Websites** → `mortmain.studio` → **Email** (левое меню)
2. **Get started** (или **Enable Email Routing**)
3. Cloudflare автоматически добавит нужные DNS MX-записи. Подтверди.

### 3.2 Создать почтовые адреса

1. **Routes** → **Create address**
2. Создать два:

| Custom address | Action | Destination |
|---|---|---|
| `contact@mortmain.studio` | Send to an email | твоя_рабочая@gmail.com |
| `press@mortmain.studio` | Send to an email | твоя_рабочая@gmail.com |

3. Cloudflare отправит проверочное письмо на твой Gmail. Подтверди ссылку в письме.

### 3.3 (Опционально) Catch-all

Если хочешь, чтобы письма на **любой** адрес `@mortmain.studio` (например, `john@mortmain.studio` или `hello@mortmain.studio`) тоже приходили — включи **Catch-all address**: Settings → Catch-all → Send to → твоя_почта.

Это удобно: журналист может написать на `info@mortmain.studio`, и письмо не потеряется.

**Проверка:** отправь себе письмо с другого ящика на `contact@mortmain.studio`. Должно прийти на твой Gmail через несколько секунд.

### 3.4 Отвечать с domain-email (важное)

Cloudflare Email Routing **только пересылает** письма — он не позволяет напрямую отправлять с `@mortmain.studio`. Если ответишь с Gmail — получатель увидит твой Gmail, не `@mortmain.studio`.

**Простой обход** через Gmail: настроить **Send mail as** в Gmail.

1. В Gmail: **Settings → Accounts → Send mail as → Add another email address**
2. Name: `Mortmain Studio`
3. Email: `contact@mortmain.studio`
4. SMTP Server: `smtp.gmail.com` · Port: `587` · твоя_рабочая@gmail.com / app-password (нужно сгенерировать app password в Google Account → Security → 2-Step → App passwords)
5. Подтверди.

После этого в Gmail при ответе можно выбрать «From: Mortmain Studio <contact@mortmain.studio>». Получатель увидит правильный адрес.

Это **costless workaround**. Для серьёзной переписки в будущем — Google Workspace ($6/мес/пользователь) даст полноценный домен-email без хаков.

---

## Часть 4 — Обновление сайта в будущем

Когда захочешь обновить сайт (новая страница, поправка текста, новые лор-фрагменты):

1. Изменить файлы локально
2. `git add .` + `git commit -m "..."` + `git push`
3. Cloudflare Pages **автоматически** перевыкатит сайт за 30-60 секунд

Никакого FTP, никакого ручного аплоада. Только git.

---

## Часть 5 — Backup и безопасность

### 5.1 Бэкапы

- **GitHub** — основной бэкап сайта (исходники)
- **Cloudflare Pages** — хранит историю деплоев, можно откатиться к любому предыдущему деплою в один клик
- **Локальная копия** — у тебя на машине

Это **три независимых копии**. Достаточно.

### 5.2 Безопасность

- **2FA на Cloudflare** — обязательно
- **2FA на GitHub** — обязательно
- **2FA на Gmail** — обязательно (если ещё нет)
- **WHOIS privacy** — включить при покупке домена
- **Cloudflare DDoS protection** — включён по умолчанию, ничего не делать

---

## Стоимость (итого в год)

| Позиция | Стоимость |
|---|---|
| Домен `mortmain.studio` | $20-25/год |
| Cloudflare Pages (хостинг) | $0 |
| Cloudflare Email Routing | $0 |
| Cloudflare DDoS/SSL | $0 |
| GitHub (публичный репо) | $0 |
| **Итого** | **~$25/год** |

Сравнение с типичным «инди-студийным стеком» (Squarespace + Google Workspace + поддержка): $200-400/год. Мы делаем **профессиональный stack** за 1/15 от этой суммы.

---

## Что делать, если что-то не работает

| Проблема | Решение |
|---|---|
| Сайт не открывается по mortmain.studio после 30 минут | Проверить DNS в Cloudflare → Websites → Overview → должны быть Cloudflare nameservers активны |
| Email не приходит | Проверить Email Routing → Destinations → твой Gmail подтверждён? Проверить spam-папку |
| Cloudflare Pages показывает старую версию сайта | Hard refresh браузера (Ctrl+Shift+R). Или Cloudflare Cache → Purge Everything |
| SSL-сертификат "not secure" | Подождать 15 минут после первой настройки. Если не помогает — SSL/TLS → Edge Certificates → Always Use HTTPS = ON |
| Просто не получается на каком-то шаге | Не стесняйся — приходи в чат со скриншотом ошибки. Я разберу |

---

## Что **не** входит в этот гайд (на потом)

- **Newsletter backend.** Сейчас форма на сайте ничего никуда не отправляет. Когда понадобится реально собирать emails — подключим **Buttondown** (~$9/мес) или **MailerLite** (бесплатно до 1000 подписчиков).
- **Аналитика.** Когда сайт пойдёт в маркетинг — добавим **Plausible** (privacy-friendly, $9/мес) или **Cloudflare Web Analytics** (бесплатно, privacy-friendly).
- **Trademark регистрация.** Когда подойдёт ближе к релизу EA — отдельно.
- **Юрлицо.** Когда подойдёт ближе к приёму денег — отдельно.

---

## История версий

| Версия | Дата | Изменения |
|--------|------|-----------|
| V0.1 | 2026-05-21 | Первая версия гайда по хостингу. |

> Когда сайт развёрнут и email работает — напиши «сайт в эфире», и мы переходим обратно к UE5: ждём твой SSD и идём в Setup_Guide V0.2.
