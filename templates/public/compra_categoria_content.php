<?php
/** @var array $cat  Dados da categoria (ver PublicController::compraCategorias) */
/** @var array $relacionadas  Páginas irmãs [{url,label}] */
$_wpp  = e(get_setting('contact_whatsapp', '5511987756034'));
$_fone = e(get_setting('contact_phone', '(11) 98775-6034'));
$_mail = e(get_setting('contact_email', 'contato@altusci.com.br'));
$_end  = e(get_setting('contact_address', 'Estrada dos Vados, 551'));
$_cid  = e(get_setting('contact_city', 'Guarulhos, SP'));
$waMsg = rawurlencode('Olá Altustec, ' . mb_strtolower($cat['nav']) . ' — gostaria de uma avaliação.');
?>
    <!-- Hero -->
    <section class="hero-notebook">
        <div class="container">
            <div class="hero-notebook__content">
                <nav aria-label="Trilha de navegação" style="font-size:14px; opacity:.85; margin-bottom:16px;">
                    <a href="/" style="color:inherit;">Início</a> ›
                    <a href="/compramos-lote-de-informatica" style="color:inherit;">Compramos Lote de Informática</a> ›
                    <span><?= e($cat['nav']) ?></span>
                </nav>
                <h1 class="hero-notebook__title"><?= e($cat['h1']) ?></h1>
                <p class="hero-notebook__subtitle"><?= e($cat['subtitle']) ?></p>
                <p class="hero-notebook__description"><?= $cat['intro'] ?></p>
                <a href="https://wa.me/<?= $_wpp ?>?text=<?= $waMsg ?>" target="_blank" rel="noopener" class="button button--white">Solicitar avaliação</a>
            </div>
        </div>
    </section>

    <!-- O que compramos -->
    <section class="section section--gray">
        <div class="container">
            <div class="section__header">
                <h2 class="section__title"><?= e($cat['itens_titulo']) ?></h2>
                <p class="section__description">Avaliamos desde poucas unidades até grandes volumes de equipamentos corporativos.</p>
            </div>

            <div class="services__grid">
                <?php foreach ($cat['itens'] as $item): ?>
                <article class="service__card">
                    <div class="service__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <h3 class="service__title"><?= e($item[0]) ?></h3>
                    <p class="service__description"><?= e($item[1]) ?></p>
                </article>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Como funciona -->
    <section class="section">
        <div class="container">
            <div class="section__header">
                <h2 class="section__title">Como vender para a Altustec</h2>
                <p class="section__description">O mesmo processo simples da nossa página de <a href="/compramos-lote-de-informatica" class="contact-link">compra de lotes de informática</a>.</p>
            </div>

            <div class="steps__grid">
                <div class="step__card">
                    <div class="step__number">1</div>
                    <div class="step__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </div>
                    <h3 class="step__title">Envie a lista pelo WhatsApp</h3>
                    <p class="step__description">Informe os equipamentos e a quantidade aproximada disponível.</p>
                </div>
                <div class="step__card">
                    <div class="step__number">2</div>
                    <div class="step__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                    </div>
                    <h3 class="step__title">Informe os detalhes</h3>
                    <p class="step__description">Marca, modelo, configuração, estado de conservação e fotos, quando possível.</p>
                </div>
                <div class="step__card">
                    <div class="step__number">3</div>
                    <div class="step__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                    </div>
                    <h3 class="step__title">Análise e proposta</h3>
                    <p class="step__description">Analisamos as condições do lote e apresentamos uma proposta sem compromisso.</p>
                </div>
                <div class="step__card">
                    <div class="step__number">4</div>
                    <div class="step__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <h3 class="step__title">Retirada e pagamento</h3>
                    <p class="step__description">Retirada no local em toda a São Paulo e pagamento à vista, com recibo.</p>
                </div>
            </div>

            <div class="cta-whatsapp">
                <p class="cta-whatsapp__text">Pronto para vender?</p>
                <a href="https://wa.me/<?= $_wpp ?>?text=<?= $waMsg ?>" target="_blank" rel="noopener" class="button button--primary button--large">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    Falar no WhatsApp agora
                </a>
            </div>
        </div>
    </section>

    <!-- Conteúdo SEO -->
    <section class="section section--gray">
        <div class="container">
            <div class="safe-sale__content">
                <div class="safe-sale__text">
                    <?php foreach ($cat['seo'] as $block): ?>
                    <h2 style="font-size:28px; font-weight:800; color:var(--text-dark); margin:8px 0 12px;"><?= e($block[0]) ?></h2>
                    <p><?= $block[1] ?></p>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="contact-cta" style="margin-top:40px;">
                <p class="contact-cta__text">
                    Fale com a Altustec pelo WhatsApp
                    <a href="https://wa.me/<?= $_wpp ?>" target="_blank" rel="noopener" class="contact-link">(clique aqui)</a>
                    ou ligue para <a href="tel:+<?= $_wpp ?>" class="contact-link"><?= $_fone ?></a>.
                    E-mail: <a href="mailto:<?= $_mail ?>" class="contact-link"><?= $_mail ?></a>.
                    Base em <?= $_end ?> &ndash; <?= $_cid ?>, com atendimento em toda a São Paulo.
                </p>
            </div>
        </div>
    </section>

    <!-- Páginas relacionadas (links internos do silo) -->
    <section class="section">
        <div class="container">
            <div class="section__header">
                <h2 class="section__title">Também compramos</h2>
                <p class="section__description">A Altustec avalia lotes de todos os tipos de equipamento de informática.</p>
            </div>

            <div class="conditions__grid">
                <a href="/compramos-lote-de-informatica" class="condition__card" style="text-decoration:none; display:block;">
                    <div class="condition__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                    <h3 class="condition__title">Compramos Lote de Informática</h3>
                    <p class="condition__description">Página principal: computadores, notebooks, monitores, servidores e peças em lote.</p>
                </a>
                <?php foreach ($relacionadas as $rel): ?>
                <a href="<?= e($rel['url']) ?>" class="condition__card" style="text-decoration:none; display:block;">
                    <div class="condition__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <h3 class="condition__title"><?= e($rel['label']) ?></h3>
                    <p class="condition__description">Ver o que a Altustec compra nesta categoria.</p>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- FAQ -->
    <section class="section section--gray" itemscope itemtype="https://schema.org/FAQPage">
        <div class="container">
            <div class="section__header">
                <h2 class="section__title">Perguntas frequentes</h2>
            </div>

            <div class="faq__list">
                <?php foreach ($cat['faq'] as $item): ?>
                <article class="faq__item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <div class="faq__question">
                        <h3 itemprop="name"><?= e($item[0]) ?></h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="faq__icon"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                    <div class="faq__answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <p itemprop="text"><?= e($item[1]) ?></p>
                    </div>
                </article>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- CTA Final -->
    <section class="cta section">
        <div class="container">
            <div class="cta__content">
                <h2 class="cta__title"><?= e($cat['nav']) ?>?</h2>
                <p class="cta__description">Envie a relação dos equipamentos para avaliação da Altustec. Atendimento em toda a São Paulo.</p>
                <div class="cta__buttons">
                    <a href="https://wa.me/<?= $_wpp ?>?text=<?= $waMsg ?>" target="_blank" rel="noopener" class="button button--white">Enviar pelo WhatsApp</a>
                    <a href="/contato" class="button button--outline-white">Fale conosco</a>
                </div>
            </div>
        </div>
    </section>
