<?php
// Carregar configurações dinâmicas
$_logo = get_setting('site_logo', '/logo.png');
$_phone = get_setting('contact_phone', '(11) 98775-6034');
$_whatsapp = get_setting('contact_whatsapp', '5511987756034');
$_email = get_setting('contact_email', 'contato@altusci.com.br');
$_address = get_setting('contact_address', 'Estrada dos Vados, 551');
$_city = get_setting('contact_city', 'Guarulhos, SP');
$_hours = get_setting('contact_hours', '');
$_instagram = get_setting('social_instagram');
$_facebook = get_setting('social_facebook');
$_youtube = get_setting('social_youtube');
$_linkedin = get_setting('social_linkedin');
$_adsense = get_setting('adsense_code', 'ca-pub-2935633410371712');
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?= e($pageDescription ?? 'Altustec - Suporte de TI, manutenção de notebooks e computadores em Guarulhos. Soluções profissionais em tecnologia para sua empresa.') ?>">
    <meta name="keywords" content="<?= e($pageKeywords ?? 'suporte TI Guarulhos, manutenção notebook, manutenção computador, assistência técnica, TI empresarial') ?>">
    <meta name="author" content="Altustec">
    <?php if ($_adsense): ?>
    <meta name="google-adsense-account" content="<?= e($_adsense) ?>">
    <?php endif; ?>
    <meta property="og:title" content="<?= e($pageTitle ?? SITE_NAME) ?>">
    <meta property="og:description" content="<?= e($pageDescription ?? 'Especialistas em suporte de TI, manutenção de notebooks e computadores em Guarulhos, SP') ?>">
    <meta property="og:type" content="<?= $ogType ?? 'website' ?>">
    <?php if (!empty($ogImage)): ?>
    <meta property="og:image" content="<?= e($ogImage) ?>">
    <?php endif; ?>
    <meta property="og:url" content="<?= e(SITE_URL . ($_SERVER['REQUEST_URI'] ?? '/')) ?>">
    <meta property="og:site_name" content="Altustec">
    <link rel="canonical" href="<?= e($canonicalUrl ?? SITE_URL . ($_SERVER['REQUEST_URI'] ?? '/')) ?>">
    <title><?= e($pageTitle ?? SITE_NAME) ?></title>
    <link rel="stylesheet" href="/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <?php if (!empty($extraHead)): ?>
    <?= $extraHead ?>
    <?php endif; ?>
</head>
<body>
    <!-- Header -->
    <header class="header" id="header">
        <nav class="nav container">
            <a href="/" class="nav__logo">
                <img src="<?= e($_logo) ?>" alt="Altustec Logo" class="logo-img">
            </a>

            <div class="nav__menu" id="nav-menu">
                <ul class="nav__list">
                    <li class="nav__item">
                        <a href="/" class="nav__link <?= ($currentPage ?? '') === 'home' ? 'active' : '' ?>">Início</a>
                    </li>
                    <li class="nav__item">
                        <a href="/servicos" class="nav__link <?= ($currentPage ?? '') === 'servicos' ? 'active' : '' ?>">Serviços</a>
                    </li>
                    <li class="nav__item nav__item--dropdown">
                        <a href="/compramos-lote-de-informatica" class="nav__link <?= ($currentPage ?? '') === 'compramos' || ($currentPage ?? '') === 'compramos-lote' ? 'active' : '' ?>">
                            Compramos
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </a>
                        <ul class="nav__dropdown">
                            <li><a href="/compramos-lote-de-informatica">Lote de Informática</a></li>
                            <li><a href="/compramos-notebooks-usados">Notebooks Usados</a></li>
                            <li><a href="/compramos-computadores-usados">Computadores Usados</a></li>
                            <li><a href="/compramos-servidores-usados">Servidores Usados</a></li>
                            <li><a href="/compramos-equipamentos-de-informatica-de-empresas">Equipamentos de Empresas</a></li>
                            <li><a href="/compramos-seu-notebook-usado">Seu Notebook (1 unidade)</a></li>
                        </ul>
                    </li>
                    <li class="nav__item">
                        <a href="/blog" class="nav__link <?= ($currentPage ?? '') === 'blog' ? 'active' : '' ?>">Blog</a>
                    </li>
                    <li class="nav__item nav__item--dropdown">
                        <a href="#" class="nav__link">
                            Links Úteis
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </a>
                        <ul class="nav__dropdown">
                            <li><a href="/como-criar-um-pendrive-bootavel-do-mac-no-windows">Pendrive Bootável Mac</a></li>
                        </ul>
                    </li>
                    <li class="nav__item">
                        <a href="/contato" class="nav__link <?= ($currentPage ?? '') === 'contato' ? 'active' : '' ?>">Contato</a>
                    </li>
                </ul>
                <div class="nav__close" id="nav-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            </div>

            <div class="nav__toggle" id="nav-toggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </div>
        </nav>
    </header>

    <!-- Content -->
    <main>
        <?php include $contentTemplate; ?>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer__grid" style="grid-template-columns: 1.8fr 1fr 1.2fr 1fr 1.3fr;">
                <div class="footer__column">
                    <a href="/" class="footer__logo">
                        <img src="<?= e($_logo) ?>" alt="Altustec Logo" class="logo-img">
                    </a>
                    <p class="footer__description">
                        Soluções profissionais em TI para sua empresa. Suporte técnico, manutenção e consultoria em <?= e($_city) ?>.
                    </p>
                    <?php if ($_instagram || $_facebook || $_youtube || $_linkedin): ?>
                    <div style="display:flex; gap:12px; margin-top:16px;">
                        <?php if ($_instagram): ?>
                        <a href="<?= e($_instagram) ?>" target="_blank" rel="noopener" style="color:#9ca3af;" aria-label="Instagram">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </a>
                        <?php endif; ?>
                        <?php if ($_facebook): ?>
                        <a href="<?= e($_facebook) ?>" target="_blank" rel="noopener" style="color:#9ca3af;" aria-label="Facebook">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <?php endif; ?>
                        <?php if ($_youtube): ?>
                        <a href="<?= e($_youtube) ?>" target="_blank" rel="noopener" style="color:#9ca3af;" aria-label="YouTube">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                        <?php endif; ?>
                        <?php if ($_linkedin): ?>
                        <a href="<?= e($_linkedin) ?>" target="_blank" rel="noopener" style="color:#9ca3af;" aria-label="LinkedIn">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>
                </div>

                <div class="footer__column">
                    <h3 class="footer__title">Links Rápidos</h3>
                    <ul class="footer__links">
                        <li><a href="/">Início</a></li>
                        <li><a href="/servicos">Serviços</a></li>
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/contato">Contato</a></li>
                        <li><a href="/politica-de-privacidade">Privacidade</a></li>
                    </ul>
                </div>

                <div class="footer__column">
                    <h3 class="footer__title">Compra de Equipamentos</h3>
                    <ul class="footer__links">
                        <li><a href="/compramos-lote-de-informatica">Compramos Lote de Informática</a></li>
                        <li><a href="/compramos-notebooks-usados">Notebooks Usados</a></li>
                        <li><a href="/compramos-computadores-usados">Computadores Usados</a></li>
                        <li><a href="/compramos-servidores-usados">Servidores Usados</a></li>
                        <li><a href="/compramos-equipamentos-de-informatica-de-empresas">Equipamentos de Empresas</a></li>
                        <li><a href="/compramos-seu-notebook-usado">Compramos seu Notebook</a></li>
                    </ul>
                </div>

                <div class="footer__column">
                    <h3 class="footer__title">Blog</h3>
                    <ul class="footer__links">
                        <?php
                        $footerPosts = get_db()->query("SELECT title, slug FROM blog_posts WHERE active = 1 ORDER BY created_at DESC LIMIT 5")->fetchAll();
                        foreach ($footerPosts as $fp): ?>
                        <li><a href="/blog/<?= e($fp['slug']) ?>"><?= e(truncate($fp['title'], 40)) ?></a></li>
                        <?php endforeach; ?>
                    </ul>
                </div>

                <div class="footer__column">
                    <h3 class="footer__title">Contato</h3>
                    <ul class="footer__contact">
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <?= e($_address) ?><br><?= e($_city) ?>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <?= e($_email) ?>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                            <?= e($_phone) ?>
                        </li>
                        <?php if ($_hours): ?>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <?= e($_hours) ?>
                        </li>
                        <?php endif; ?>
                    </ul>
                </div>
            </div>

            <div class="footer__bottom" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <p>&copy; <?= date('Y') ?> Altustec. Todos os direitos reservados.</p>
                <a href="/politica-de-privacidade" style="color:#9ca3af; font-size:13px; text-decoration:none;">Política de Privacidade</a>
            </div>
        </div>
    </footer>

    <!-- WhatsApp Floating Button -->
    <?php if ($_whatsapp): ?>
    <a href="https://wa.me/<?= e($_whatsapp) ?>" class="whatsapp-float" target="_blank" aria-label="WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
    </a>
    <?php endif; ?>

    <!-- Cookie Consent Banner -->
    <div id="cookie-banner" style="display:none; position:fixed; bottom:0; left:0; right:0; background:#1a1a2e; color:#fff; padding:16px 24px; z-index:9999; box-shadow:0 -2px 10px rgba(0,0,0,0.2);">
        <div style="max-width:1200px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
            <p style="margin:0; font-size:14px; line-height:1.5; flex:1; min-width:280px;">
                Utilizamos cookies para melhorar sua experiência e analisar o tráfego do site. Ao continuar navegando, você concorda com o uso de cookies.
                <a href="/politica-de-privacidade" style="color:#60a5fa; text-decoration:underline;">Política de Privacidade</a>
            </p>
            <div style="display:flex; gap:8px;">
                <button onclick="setCookieConsent('accepted')" style="background:#002C87; color:#fff; border:none; padding:8px 20px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">Aceitar</button>
                <button onclick="setCookieConsent('denied')" style="background:transparent; color:#9ca3af; border:1px solid #4b5563; padding:8px 20px; border-radius:8px; font-size:13px; cursor:pointer;">Recusar</button>
            </div>
        </div>
    </div>
    <script>
    (function() {
        if (!document.cookie.includes('_alt_consent=')) {
            document.getElementById('cookie-banner').style.display = 'block';
        }
    })();
    function setCookieConsent(value) {
        document.cookie = '_alt_consent=' + value + ';path=/;max-age=' + (365*24*60*60) + ';SameSite=Lax';
        document.getElementById('cookie-banner').style.display = 'none';
    }
    </script>

    <script src="/script.js"></script>
</body>
</html>
