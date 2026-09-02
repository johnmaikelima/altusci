<?php
$_wpp   = e(get_setting('contact_whatsapp', '5511987756034'));
$_fone  = e(get_setting('contact_phone', '(11) 98775-6034'));
$_mail  = e(get_setting('contact_email', 'contato@altusci.com.br'));
$_end   = e(get_setting('contact_address', 'Estrada dos Vados, 551'));
$_cid   = e(get_setting('contact_city', 'Guarulhos, SP'));
$loteFaq = $loteFaq ?? [];
?>
    <!-- Hero -->
    <section class="hero-notebook">
        <div class="container">
            <div class="hero-notebook__content">
                <h1 class="hero-notebook__title">Compramos Lote de Informática em São Paulo</h1>
                <p class="hero-notebook__subtitle">Computadores, notebooks, monitores, servidores, peças e equipamentos de TI usados</p>
                <p class="hero-notebook__description">
                    A <strong>Altustec compra lotes de informática</strong> de empresas, escritórios e revendas em São Paulo e região.
                    Sua empresa vai renovar o parque de TI ou tem equipamentos parados ocupando espaço? Envie a relação dos itens e receba
                    uma avaliação rápida, com retirada no local e pagamento à vista.
                </p>
                <a href="https://wa.me/<?= $_wpp ?>?text=Ol%C3%A1%20Altustec,%20tenho%20um%20lote%20de%20inform%C3%A1tica%20para%20vender."
                   target="_blank" rel="noopener" class="button button--white">Solicitar avaliação do lote</a>
            </div>
        </div>
    </section>

    <!-- O que compramos -->
    <section class="section section--gray">
        <div class="container">
            <div class="section__header">
                <h2 class="section__title">Quais equipamentos de informática compramos?</h2>
                <p class="section__description">Avaliamos desde pequenas quantidades até grandes volumes de equipamentos corporativos.</p>
            </div>

            <div class="services__grid">
                <article class="service__card">
                    <div class="service__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    </div>
                    <h3 class="service__title">Lotes de notebooks</h3>
                    <p class="service__description">Notebooks usados, seminovos, corporativos, equipamentos fora de linha e máquinas de renovação de parque de TI.</p>
                </article>

                <article class="service__card">
                    <div class="service__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </div>
                    <h3 class="service__title">Computadores e desktops</h3>
                    <p class="service__description">Computadores completos, desktops corporativos, estações de trabalho e máquinas de escritório.</p>
                </article>

                <article class="service__card">
                    <div class="service__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    </div>
                    <h3 class="service__title">Monitores</h3>
                    <p class="service__description">Lotes de monitores LCD e LED de diferentes tamanhos, marcas e modelos.</p>
                </article>

                <article class="service__card">
                    <div class="service__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"></rect><rect x="2" y="14" width="20" height="8" rx="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                    </div>
                    <h3 class="service__title">Servidores e storages</h3>
                    <p class="service__description">Servidores de rack e torre, storages e ativos de datacenter e infraestrutura.</p>
                </article>

                <article class="service__card">
                    <div class="service__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v18"></path><path d="M15 3v18"></path><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg>
                    </div>
                    <h3 class="service__title">Equipamentos de rede</h3>
                    <p class="service__description">Switches, roteadores, access points, racks e outros equipamentos de redes corporativas.</p>
                </article>

                <article class="service__card">
                    <div class="service__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                    </div>
                    <h3 class="service__title">Peças e componentes</h3>
                    <p class="service__description">Memórias RAM, processadores, placas-mãe, SSDs, HDs, fontes e placas de vídeo.</p>
                </article>

                <article class="service__card">
                    <div class="service__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="10" rx="2"></rect><path d="M6 18h12"></path><path d="M8 22h8"></path></svg>
                    </div>
                    <h3 class="service__title">Periféricos e acessórios</h3>
                    <p class="service__description">Teclados, mouses, docks, fontes, carregadores e acessórios de informática.</p>
                </article>

                <article class="service__card">
                    <div class="service__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                    <h3 class="service__title">Ativos corporativos de TI</h3>
                    <p class="service__description">Equipamentos de substituição, upgrade ou desmobilização do parque tecnológico de empresas.</p>
                </article>
            </div>

            <div class="section__cta">
                <p style="margin-bottom:16px; color:var(--text-gray);">Veja as páginas por tipo de equipamento:</p>
                <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center;">
                    <a href="/compramos-notebooks-usados" class="button button--secondary">Compramos Notebooks Usados</a>
                    <a href="/compramos-computadores-usados" class="button button--secondary">Compramos Computadores Usados</a>
                    <a href="/compramos-servidores-usados" class="button button--secondary">Compramos Servidores Usados</a>
                    <a href="/compramos-equipamentos-de-informatica-de-empresas" class="button button--secondary">Equipamentos de Empresas</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Para empresas -->
    <section class="section">
        <div class="container">
            <div class="section__header">
                <h2 class="section__title">Sua empresa vai renovar os computadores?</h2>
                <p class="section__description">Transforme equipamentos parados em capital de giro.</p>
            </div>
            <div class="safe-sale__content">
                <div class="safe-sale__text">
                    <p>
                        Empresas frequentemente acumulam equipamentos após substituições, upgrades, fechamento de unidades ou
                        renovação do parque de informática. Em vez de manter tudo ocupando espaço no estoque, você pode enviar
                        o lote para avaliação da <strong>Altustec</strong>.
                    </p>
                    <p>
                        Trabalhamos com a compra de <strong>computadores, notebooks e equipamentos de informática em lote</strong>,
                        oferecendo uma alternativa prática e segura para equipamentos que não estão mais em uso. Todos os lotes
                        adquiridos são registrados com recibo de compra e venda.
                    </p>
                </div>
            </div>

            <div class="conditions__grid" style="margin-top:40px;">
                <div class="condition__card">
                    <div class="condition__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"></path><polyline points="17 6 23 6 23 12"></polyline></svg>
                    </div>
                    <h3 class="condition__title">Renovação de parque de TI</h3>
                    <p class="condition__description">Compramos os equipamentos antigos quando sua empresa troca por máquinas novas.</p>
                </div>
                <div class="condition__card">
                    <div class="condition__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </div>
                    <h3 class="condition__title">Desmobilização e fechamento</h3>
                    <p class="condition__description">Escritórios ou unidades sendo desativados, com equipamentos e mobiliário de TI.</p>
                </div>
                <div class="condition__card">
                    <div class="condition__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                    </div>
                    <h3 class="condition__title">Estoques e lotes mistos</h3>
                    <p class="condition__description">Equipamentos sem utilização, sobras de projetos e lotes com itens variados.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Como funciona -->
    <section class="section section--gray">
        <div class="container">
            <div class="section__header">
                <h2 class="section__title">Como vender seu lote de informática</h2>
                <p class="section__description">Um processo simples, do primeiro contato à retirada dos equipamentos.</p>
            </div>

            <div class="steps__grid">
                <div class="step__card">
                    <div class="step__number">1</div>
                    <div class="step__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </div>
                    <h3 class="step__title">Envie o lote pelo WhatsApp</h3>
                    <p class="step__description">Informe quais equipamentos você tem e a quantidade aproximada disponível.</p>
                </div>
                <div class="step__card">
                    <div class="step__number">2</div>
                    <div class="step__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                    </div>
                    <h3 class="step__title">Informe os detalhes</h3>
                    <p class="step__description">Sempre que possível, envie marca, modelo, configuração, estado de conservação e fotos.</p>
                </div>
                <div class="step__card">
                    <div class="step__number">3</div>
                    <div class="step__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                    </div>
                    <h3 class="step__title">Análise e proposta</h3>
                    <p class="step__description">Nossa equipe analisa as características e condições do lote e apresenta uma proposta.</p>
                </div>
                <div class="step__card">
                    <div class="step__number">4</div>
                    <div class="step__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <h3 class="step__title">Retirada e pagamento</h3>
                    <p class="step__description">Fechado o negócio, combinamos a retirada no local e o pagamento à vista, com recibo.</p>
                </div>
            </div>

            <div class="cta-whatsapp">
                <p class="cta-whatsapp__text">Pronto para vender seu lote de informática?</p>
                <a href="https://wa.me/<?= $_wpp ?>?text=Ol%C3%A1%20Altustec,%20gostaria%20de%20uma%20avalia%C3%A7%C3%A3o%20do%20meu%20lote%20de%20inform%C3%A1tica."
                   target="_blank" rel="noopener" class="button button--primary button--large">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    Falar no WhatsApp agora
                </a>
            </div>
        </div>
    </section>

    <!-- Segurança -->
    <section class="section">
        <div class="container">
            <div class="important-info__alert">
                <div class="alert__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <div class="alert__content">
                    <h3 class="alert__title">Compra registrada e transparente</h3>
                    <p class="alert__text">
                        <strong>Todos os lotes adquiridos são formalizados com recibo de compra e venda e cópia dos documentos</strong>,
                        para garantir a procedência dos equipamentos e a segurança de ambas as partes. Não compramos equipamentos
                        de origem duvidosa.
                    </p>
                </div>
            </div>

            <div class="contact-cta">
                <p class="contact-cta__text">
                    Fale com a Altustec pelo WhatsApp
                    <a href="https://wa.me/<?= $_wpp ?>" target="_blank" rel="noopener" class="contact-link">(clique aqui)</a>
                    ou ligue para
                    <a href="tel:+<?= $_wpp ?>" class="contact-link"><?= $_fone ?></a>.
                    Também atendemos por e-mail: <a href="mailto:<?= $_mail ?>" class="contact-link"><?= $_mail ?></a>.
                    Atendimento em <?= $_end ?> &ndash; <?= $_cid ?>.
                </p>
            </div>
        </div>
    </section>

    <!-- Conteúdo SEO -->
    <section class="section section--gray">
        <div class="container">
            <div class="safe-sale__content">
                <h2 class="safe-sale__title">Empresa que compra lote de informática em São Paulo</h2>
                <div class="safe-sale__text">
                    <p>
                        Se você procura uma <strong>empresa que compra lote de informática</strong>, a Altustec avalia equipamentos
                        de tecnologia vindos de empresas, escritórios, estoques e revendas na capital, na Grande São Paulo
                        e em cidades do interior. São avaliados lotes com computadores, notebooks, monitores, servidores,
                        periféricos, peças e componentes usados em ambientes corporativos.
                    </p>

                    <h3>Compramos computadores usados em lote</h3>
                    <p>
                        A Altustec compra <strong>computadores usados em lote</strong>, principalmente equipamentos de renovação de
                        parque tecnológico, substituição de máquinas e computadores que deixaram de ser utilizados. Para agilizar a
                        análise, informe a quantidade aproximada, marca, modelo, processador, memória RAM, armazenamento e estado
                        de conservação.
                    </p>

                    <h3>Compramos notebooks usados em lote</h3>
                    <p>
                        Também avaliamos <strong>lotes de notebooks usados</strong>: notebooks corporativos, equipamentos de leasing,
                        máquinas de home office e lotes de renovação tecnológica. Havendo modelos e configurações diferentes no mesmo
                        lote, basta enviar uma relação simples com as quantidades aproximadas.
                    </p>

                    <h3>Venda os equipamentos de TI que sua empresa não usa</h3>
                    <p>
                        Computadores e equipamentos de TI costumam ficar guardados por meses ou anos depois de uma troca. Vender esse
                        material reduz o volume de ativos sem uso, libera espaço e recupera parte do valor investido. A retirada é feita
                        no endereço da sua empresa e o pagamento é à vista.
                    </p>

                    <h3>Como enviar a lista de equipamentos</h3>
                    <p>
                        Monte uma relação com quantidade, marca, modelo, configuração e condição dos itens. Fotos do lote ajudam na
                        avaliação inicial. Envie tudo pelo <a href="https://wa.me/<?= $_wpp ?>" target="_blank" rel="noopener" class="contact-link">WhatsApp</a>
                        e nossa equipe retorna com uma proposta.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ -->
    <section class="section" itemscope itemtype="https://schema.org/FAQPage">
        <div class="container">
            <div class="section__header">
                <h2 class="section__title">Dúvidas sobre a compra de lotes de informática</h2>
            </div>

            <div class="faq__list">
                <?php foreach ($loteFaq as $item): ?>
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
                <h2 class="cta__title">Tem um lote de informática parado?</h2>
                <p class="cta__description">
                    Envie agora as informações dos seus computadores, notebooks, monitores, servidores ou outros equipamentos
                    para avaliação da Altustec.
                </p>
                <div class="cta__buttons">
                    <a href="https://wa.me/<?= $_wpp ?>?text=Ol%C3%A1%20Altustec,%20tenho%20um%20lote%20de%20equipamentos%20de%20inform%C3%A1tica%20para%20vender."
                       target="_blank" rel="noopener" class="button button--white">Enviar lote pelo WhatsApp</a>
                    <a href="/contato" class="button button--outline-white">Fale conosco</a>
                </div>
            </div>
        </div>
    </section>
