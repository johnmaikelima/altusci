<?php
require_once BASE_PATH . '/config.php';

class PublicController {

    public function home(): void {
        $db = get_db();
        $latestPosts = $db->query("SELECT * FROM blog_posts WHERE active = 1 ORDER BY created_at DESC LIMIT 6")->fetchAll();

        $currentPage = 'home';
        $contentTemplate = BASE_PATH . '/templates/public/home_content.php';
        include BASE_PATH . '/templates/layouts/public.php';
    }

    public function servicos(): void {
        $currentPage = 'servicos';
        $pageTitle = 'Serviços - Altustec | Suporte de TI e Manutenção em Guarulhos';
        $pageDescription = 'Conheça nossos serviços de suporte de TI, manutenção de notebooks e computadores, consultoria técnica e mais.';
        $contentTemplate = BASE_PATH . '/templates/public/servicos_content.php';
        include BASE_PATH . '/templates/layouts/public.php';
    }

    public function contato(): void {
        $currentPage = 'contato';
        $pageTitle = 'Contato - Altustec | Fale Conosco';
        $pageDescription = 'Entre em contato com a Altustec para suporte de TI, manutenção de notebooks e computadores em Guarulhos.';
        $contentTemplate = BASE_PATH . '/templates/public/contato_content.php';
        include BASE_PATH . '/templates/layouts/public.php';
    }

    public function compramosNotebook(): void {
        $currentPage = 'compramos';
        $pageTitle = 'Compramos seu Notebook Usado - Altustec Guarulhos';
        $pageDescription = 'Vendemos seu notebook usado com segurança. Avaliação justa e pagamento rápido em Guarulhos.';
        $contentTemplate = BASE_PATH . '/templates/public/compramos_content.php';
        include BASE_PATH . '/templates/layouts/public.php';
    }

    public function compramosLoteInformatica(): void {
        $currentPage = 'compramos-lote';
        $pageTitle = 'Compramos Lote de Informática | Computadores, Notebooks e Equipamentos de TI | Altustec';
        $pageDescription = 'A Altustec compra lotes de informática em São Paulo e região: computadores, notebooks, monitores, servidores, peças e equipamentos de TI usados. Avaliação rápida, retirada no local e pagamento à vista.';
        $pageKeywords = 'compramos lote de informática, comprar lote de informática, vender computadores usados em lote, vender notebooks usados em lote, empresa que compra informática usada, compra de equipamentos de TI, lote de computadores, lote de notebooks São Paulo, venda de ativos de informática, sucata de informática SP';
        $canonicalUrl = SITE_URL . '/compramos-lote-de-informatica';
        $ogImage = SITE_URL . '/notebook.webp';

        $email = get_setting('contact_email', 'contato@altusci.com.br');
        $city = get_setting('contact_city', 'Guarulhos, SP');

        // FAQ reutilizado na página visível e nos dados estruturados
        $loteFaq = [
            [
                'A Altustec compra computadores usados em lote?',
                'Sim. Avaliamos lotes de computadores, desktops, estações de trabalho e equipamentos corporativos usados, de qualquer marca e configuração.',
            ],
            [
                'Vocês compram lotes de notebooks usados?',
                'Sim. Avaliamos lotes de notebooks corporativos, equipamentos de leasing e máquinas de diferentes marcas, modelos e gerações.',
            ],
            [
                'Vocês compram equipamentos de empresas?',
                'Sim. Atendemos empresas na capital, na Grande São Paulo e em cidades do interior que estão renovando o parque de TI, trocando equipamentos ou desmobilizando ativos sem utilização.',
            ],
            [
                'Qual é a quantidade mínima de equipamentos?',
                'Não trabalhamos com uma quantidade mínima fixa. A avaliação depende do tipo de equipamento, dos modelos, do estado de conservação e da localização do lote. Envie a relação dos itens para verificarmos.',
            ],
            [
                'Vocês compram equipamentos com defeito?',
                'Dependendo do modelo, da quantidade e do tipo de defeito, lotes contendo equipamentos sem funcionamento também podem ser avaliados.',
            ],
            [
                'Como vender um lote de informática para a Altustec?',
                'Envie pelo WhatsApp uma relação dos equipamentos com quantidade, marca, modelo, configuração, estado de conservação e fotos. Nossa equipe analisa o lote e apresenta uma proposta. A retirada é feita no local, em toda a São Paulo, ou por transportadora.',
            ],
        ];

        $faqLd = array_map(fn($f) => [
            '@type' => 'Question',
            'name' => $f[0],
            'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f[1]],
        ], $loteFaq);

        $extraHead = '<script type="application/ld+json">' . json_encode([
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'WebPage',
                    '@id' => $canonicalUrl . '#webpage',
                    'url' => $canonicalUrl,
                    'name' => $pageTitle,
                    'description' => $pageDescription,
                    'inLanguage' => 'pt-BR',
                    'isPartOf' => ['@id' => SITE_URL . '/#website'],
                ],
                [
                    '@type' => 'WebSite',
                    '@id' => SITE_URL . '/#website',
                    'url' => SITE_URL . '/',
                    'name' => 'Altustec',
                    'inLanguage' => 'pt-BR',
                ],
                [
                    '@type' => 'Service',
                    '@id' => $canonicalUrl . '#service',
                    'name' => 'Compra de Lotes de Informática',
                    'serviceType' => 'Compra de lotes de equipamentos de informática usados',
                    'description' => 'Compra de lotes de computadores, notebooks, monitores, servidores, componentes, periféricos e outros equipamentos de informática usados de empresas e revendas.',
                    'provider' => [
                        '@type' => 'LocalBusiness',
                        'name' => 'Altustec',
                        'url' => SITE_URL . '/',
                        'logo' => SITE_URL . '/logo.png',
                        'telephone' => get_setting('contact_phone', '(11) 98775-6034'),
                        'email' => $email,
                        'address' => [
                            '@type' => 'PostalAddress',
                            'streetAddress' => get_setting('contact_address', 'Estrada dos Vados, 551'),
                            'addressLocality' => 'Guarulhos',
                            'addressRegion' => 'SP',
                            'addressCountry' => 'BR',
                        ],
                    ],
                    'areaServed' => [
                        ['@type' => 'State', 'name' => 'São Paulo'],
                        ['@type' => 'City', 'name' => 'São Paulo'],
                        ['@type' => 'City', 'name' => 'Guarulhos'],
                        ['@type' => 'Country', 'name' => 'Brasil'],
                    ],
                ],
                [
                    '@type' => 'FAQPage',
                    '@id' => $canonicalUrl . '#faq',
                    'mainEntity' => $faqLd,
                ],
            ],
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>';

        $contentTemplate = BASE_PATH . '/templates/public/compramos_lote_content.php';
        include BASE_PATH . '/templates/layouts/public.php';
    }

    /**
     * Páginas auxiliares (silo de SEO) que apontam para /compramos-lote-de-informatica.
     * Todas compartilham o template compra_categoria_content.php.
     */
    public function compraNotebooksUsados(): void       { $this->renderCompraCategoria('notebooks'); }
    public function compraComputadoresUsados(): void     { $this->renderCompraCategoria('computadores'); }
    public function compraEquipamentosEmpresas(): void   { $this->renderCompraCategoria('empresas'); }
    public function compraServidoresUsados(): void       { $this->renderCompraCategoria('servidores'); }

    public static function compraCategorias(): array {
        return [
            'notebooks' => [
                'slug' => 'compramos-notebooks-usados',
                'nav' => 'Compramos Notebooks Usados',
                'h1' => 'Compramos Notebooks Usados em São Paulo',
                'title' => 'Compramos Notebooks Usados em Lote e de Empresas em SP | Altustec',
                'description' => 'A Altustec compra notebooks usados em lote e de empresas em São Paulo e região. Notebooks corporativos, de leasing e home office, todas as marcas. Avaliação rápida e pagamento à vista.',
                'keywords' => 'compramos notebooks usados, comprar notebooks usados em lote, vender notebooks usados de empresa, compra de notebooks corporativos, quem compra notebook usado em lote, notebooks usados São Paulo',
                'service' => 'Compra de notebooks usados em lote',
                'subtitle' => 'Lotes de notebooks corporativos, de leasing e home office — todas as marcas',
                'intro' => 'A <strong>Altustec compra notebooks usados em lote</strong> de empresas, revendas e escritórios em São Paulo e região. Compramos desde poucas unidades até grandes volumes de máquinas de renovação de parque de TI, com avaliação rápida, retirada no local e pagamento à vista.',
                'itens_titulo' => 'Que notebooks compramos?',
                'itens' => [
                    ['Notebooks corporativos', 'Máquinas de trabalho de escritórios e empresas de qualquer porte.'],
                    ['Notebooks de leasing', 'Equipamentos ao fim do contrato de locação ou outsourcing.'],
                    ['Notebooks de home office', 'Lotes usados em trabalho remoto que voltaram para a empresa.'],
                    ['Ultrabooks e linha premium', 'Modelos leves e de alto desempenho de todas as marcas.'],
                    ['Notebooks com defeito (em lote)', 'Máquinas com problema de tela, teclado, bateria ou placa, avaliadas por volume.'],
                    ['Workstations móveis', 'Notebooks de engenharia, arquitetura e edição com placa dedicada.'],
                ],
                'seo' => [
                    ['Compra de notebooks usados para empresas', 'Empresas costumam acumular notebooks depois de uma renovação de parque, do fim de um contrato de leasing ou da devolução de equipamentos de home office. Em vez de deixar as máquinas paradas no estoque, sua empresa pode vender o lote para a Altustec e recuperar parte do investimento. A retirada é feita no endereço da empresa, em toda a São Paulo, com recibo de compra e venda.'],
                    ['Compramos notebooks de todas as marcas', 'Avaliamos lotes de notebooks Dell, Lenovo, HP, Acer, Asus, Samsung, Positivo, LG, Apple (MacBook) e outras marcas. Para agilizar a proposta, informe marca, modelo, processador, memória RAM, armazenamento (SSD/HD) e o estado de conservação de cada equipamento ou grupo de equipamentos.'],
                    ['Quanto vale um lote de notebooks usados?', 'O valor depende de modelo, geração do processador, quantidade, estado de conservação e da existência de defeitos. Lotes maiores e homogêneos costumam ter avaliação melhor. Envie a relação dos equipamentos pelo WhatsApp e nossa equipe retorna com uma proposta sem compromisso.'],
                ],
                'faq' => [
                    ['A Altustec compra notebooks usados em lote?', 'Sim. Compramos lotes de notebooks usados de empresas, revendas e escritórios, de qualquer marca e configuração, em São Paulo e região.'],
                    ['Vocês compram notebooks com defeito?', 'Sim, quando fazem parte de um lote. Notebooks com problema de tela, teclado, bateria, carga ou placa são avaliados por volume e condição.'],
                    ['Tenho só um notebook para vender. Vocês compram?', 'Sim. Para uma unidade, use a página Compramos seu Notebook Usado. Esta página é voltada para lotes e equipamentos de empresas.'],
                    ['Como funciona a retirada dos notebooks?', 'Fechada a proposta, combinamos a retirada no endereço da sua empresa em toda a São Paulo, ou o envio por transportadora. O pagamento é à vista, com recibo.'],
                ],
            ],
            'computadores' => [
                'slug' => 'compramos-computadores-usados',
                'nav' => 'Compramos Computadores Usados',
                'h1' => 'Compramos Computadores Usados em São Paulo',
                'title' => 'Compramos Computadores Usados em Lote e de Empresas em SP | Altustec',
                'description' => 'A Altustec compra computadores usados em lote e de empresas em São Paulo e região. Desktops corporativos, all-in-one e workstations, todas as marcas. Avaliação rápida e pagamento à vista.',
                'keywords' => 'compramos computadores usados, comprar computadores usados em lote, vender computadores usados de empresa, compra de desktops corporativos, quem compra computador usado em lote, computadores usados São Paulo',
                'service' => 'Compra de computadores usados em lote',
                'subtitle' => 'Lotes de desktops corporativos, all-in-one e estações de trabalho',
                'intro' => 'A <strong>Altustec compra computadores usados em lote</strong> de empresas e escritórios em São Paulo e região. Compramos desktops de renovação de parque, máquinas de escritórios em mudança e lotes de equipamentos sem uso, com avaliação rápida, retirada no local e pagamento à vista.',
                'itens_titulo' => 'Que computadores compramos?',
                'itens' => [
                    ['Desktops corporativos', 'Gabinetes de escritório de qualquer marca, com ou sem monitor.'],
                    ['Computadores all-in-one', 'Modelos com tela integrada usados em recepções e escritórios.'],
                    ['Estações de trabalho (workstations)', 'Máquinas de engenharia, CAD e edição com placa dedicada.'],
                    ['Mini PCs e thin clients', 'Equipamentos compactos usados em terminais e pontos de atendimento.'],
                    ['Computadores gamer', 'Máquinas com placa de vídeo dedicada e processadores de alto desempenho.'],
                    ['Computadores com defeito (em lote)', 'Gabinetes com problema de fonte, placa-mãe ou armazenamento, avaliados por volume.'],
                ],
                'seo' => [
                    ['Compra de computadores usados de empresas', 'Ao trocar os computadores por máquinas novas, a empresa fica com dezenas ou centenas de gabinetes parados. A Altustec compra esse lote, faz a retirada no local em toda a São Paulo e emite recibo de compra e venda, garantindo a procedência dos equipamentos.'],
                    ['Renovação de parque de máquinas', 'Trabalhamos com lotes de renovação de parque de TI, troca de contrato de outsourcing, fechamento de filiais e desmobilização de estoques. Não há quantidade mínima fixa: a avaliação depende do modelo, do estado e da localização.'],
                    ['O que informar para avaliar o lote', 'Envie a quantidade aproximada, marca, modelo, processador, memória RAM, armazenamento (SSD/HD) e o estado de conservação. Fotos do lote ajudam na avaliação inicial. Com essas informações, apresentamos uma proposta sem compromisso.'],
                ],
                'faq' => [
                    ['A Altustec compra computadores usados em lote?', 'Sim. Compramos lotes de desktops, all-in-one e workstations de empresas e escritórios, de qualquer marca, em São Paulo e região.'],
                    ['Vocês compram computadores sem monitor?', 'Sim. Compramos apenas os gabinetes ou o conjunto completo com monitor, teclado e mouse. Informe o que está incluído no lote.'],
                    ['Vocês compram computadores com defeito?', 'Sim, quando fazem parte de um lote. Máquinas com defeito de fonte, placa-mãe ou armazenamento são avaliadas por volume e condição.'],
                    ['Qual a quantidade mínima?', 'Não há quantidade mínima fixa. Envie a relação dos equipamentos pelo WhatsApp para verificarmos o lote.'],
                ],
            ],
            'empresas' => [
                'slug' => 'compramos-equipamentos-de-informatica-de-empresas',
                'nav' => 'Equipamentos de Empresas',
                'h1' => 'Compramos Equipamentos de Informática de Empresas em SP',
                'title' => 'Compramos Equipamentos de Informática de Empresas em SP | Altustec',
                'description' => 'A Altustec compra equipamentos de informática de empresas em São Paulo: computadores, notebooks, monitores, servidores, rede e periféricos. Retirada no local, recibo e pagamento à vista.',
                'keywords' => 'compramos equipamentos de informática de empresas, empresa que compra ativos de TI, venda de equipamentos de informática corporativos, desmobilização de parque de TI, compra de informática usada de empresa São Paulo',
                'service' => 'Compra de equipamentos de informática de empresas',
                'subtitle' => 'Desmobilização e renovação de parque de TI — retirada no local em toda a São Paulo',
                'intro' => 'A <strong>Altustec compra equipamentos de informática de empresas</strong> em São Paulo e região. Atendemos renovação de parque de TI, fim de contrato de leasing, fechamento de filiais e desmobilização de estoques, com retirada no local, recibo de compra e venda e pagamento à vista.',
                'itens_titulo' => 'Que equipamentos de empresas compramos?',
                'itens' => [
                    ['Computadores e notebooks', 'Desktops, all-in-one, notebooks corporativos e workstations.'],
                    ['Monitores', 'Lotes de monitores LCD e LED de todos os tamanhos e marcas.'],
                    ['Servidores e storages', 'Servidores de rack e torre, storages, NAS e ativos de datacenter.'],
                    ['Rede e infraestrutura', 'Switches, roteadores, access points, racks e organizadores.'],
                    ['Nobreaks e periféricos', 'Nobreaks, estabilizadores, teclados, mouses, docks e fontes.'],
                    ['Peças e componentes', 'Memórias, processadores, SSDs, HDs, placas e fontes.'],
                ],
                'seo' => [
                    ['Desmobilização de parque de TI', 'Quando a empresa troca de equipamentos, encerra um contrato de outsourcing ou fecha uma unidade, sobra um volume grande de ativos de informática. A Altustec compra esse parque por completo, organiza a retirada no local em toda a São Paulo e formaliza tudo com recibo de compra e venda e cópia dos documentos.'],
                    ['Retirada no local e documentação', 'Nossa equipe faz a conferência e a retirada dos equipamentos no endereço da empresa, sem custo de logística para lotes de interesse. Emitimos recibo de compra e venda com a relação dos itens, o que ajuda no controle patrimonial e na baixa contábil dos ativos.'],
                    ['Apagamento de dados dos equipamentos', 'Mediante solicitação, os discos dos computadores e notebooks passam por apagamento seguro dos dados antes da revenda, ou podem ser removidos e entregues à empresa. Assim a desmobilização acontece em conformidade com as políticas de segurança da informação.'],
                ],
                'faq' => [
                    ['A Altustec compra todo o parque de TI da empresa?', 'Sim. Avaliamos o lote completo: computadores, notebooks, monitores, servidores, rede, nobreaks e periféricos, em São Paulo e região.'],
                    ['Vocês fazem a retirada no local?', 'Sim. Para lotes de interesse, nossa equipe faz a conferência e a retirada no endereço da empresa, em toda a São Paulo.'],
                    ['Emitem nota ou recibo?', 'Emitimos recibo de compra e venda com a relação dos equipamentos e cópia dos documentos, para segurança e controle patrimonial.'],
                    ['E os dados dos computadores?', 'Mediante solicitação, fazemos o apagamento seguro dos discos antes da revenda ou removemos as unidades e entregamos à empresa.'],
                ],
            ],
            'servidores' => [
                'slug' => 'compramos-servidores-usados',
                'nav' => 'Compramos Servidores Usados',
                'h1' => 'Compramos Servidores Usados em São Paulo',
                'title' => 'Compramos Servidores Usados, Storages e Datacenter em SP | Altustec',
                'description' => 'A Altustec compra servidores usados, storages e equipamentos de datacenter em São Paulo e região. Dell PowerEdge, HPE ProLiant, Lenovo e IBM. Avaliação, retirada e pagamento à vista.',
                'keywords' => 'compramos servidores usados, comprar servidor usado, vender servidor usado, compra de storage usado, equipamentos de datacenter usados, servidores Dell PowerEdge HPE ProLiant usados São Paulo',
                'service' => 'Compra de servidores usados e equipamentos de datacenter',
                'subtitle' => 'Servidores de rack e torre, storages e ativos de datacenter',
                'intro' => 'A <strong>Altustec compra servidores usados</strong>, storages e equipamentos de datacenter em São Paulo e região. Compramos ativos de desativação de sala de TI, upgrade de infraestrutura e fim de contrato, com avaliação técnica, retirada no local e pagamento à vista.',
                'itens_titulo' => 'Que servidores e equipamentos compramos?',
                'itens' => [
                    ['Servidores de rack', 'Modelos 1U, 2U e 4U das principais marcas do mercado.'],
                    ['Servidores de torre', 'Servidores de torre usados em pequenas e médias empresas.'],
                    ['Storages, NAS e SAN', 'Unidades de armazenamento, prateleiras de expansão e gavetas de discos.'],
                    ['Processadores e memórias de servidor', 'CPUs Xeon/EPYC e memórias ECC/RDIMM avulsas ou em lote.'],
                    ['Fontes e componentes', 'Fontes redundantes, controladoras RAID, placas de rede e HBAs.'],
                    ['Racks e nobreaks', 'Racks fechados e abertos, PDUs e nobreaks de maior capacidade.'],
                ],
                'seo' => [
                    ['Compra de servidores de datacenter e salas de TI', 'A Altustec compra servidores usados vindos de desativação de datacenter, migração para nuvem, upgrade de infraestrutura e fim de contrato de locação. Fazemos a avaliação técnica com base em modelo, geração, processadores, memória e discos, e organizamos a retirada no local em toda a São Paulo.'],
                    ['Marcas de servidores que compramos', 'Avaliamos servidores Dell PowerEdge, HPE ProLiant, Lenovo ThinkSystem, IBM System x, Supermicro e outras marcas, além de storages Dell EMC, HPE, NetApp e similares. Informe o modelo (ex.: PowerEdge R740), a configuração e a quantidade para agilizar a proposta.'],
                    ['Desativação de datacenter e migração para nuvem', 'Empresas que migram cargas para a nuvem costumam ficar com racks inteiros de servidores e storages ociosos. Compramos esse conjunto, cuidamos da retirada e emitimos recibo de compra e venda. Os discos podem passar por apagamento seguro ou ser retidos pela empresa.'],
                ],
                'faq' => [
                    ['A Altustec compra servidores usados?', 'Sim. Compramos servidores de rack e torre, storages e componentes de servidor, de qualquer marca, em São Paulo e região.'],
                    ['Vocês compram servidores antigos ou sem discos?', 'Sim. Avaliamos servidores de gerações anteriores e equipamentos sem discos. O valor depende de modelo, configuração e quantidade.'],
                    ['Como é feita a retirada dos servidores?', 'Para lotes de interesse, nossa equipe faz a desmontagem do rack e a retirada no local, em toda a São Paulo, ou combina o envio por transportadora.'],
                    ['E os dados dos storages e servidores?', 'Mediante solicitação, os discos passam por apagamento seguro antes da revenda ou são removidos e entregues à empresa.'],
                ],
            ],
        ];
    }

    private function renderCompraCategoria(string $key): void {
        $cats = self::compraCategorias();
        if (!isset($cats[$key])) {
            http_response_code(404);
            include BASE_PATH . '/templates/public/404.php';
            return;
        }
        $cat = $cats[$key];

        $currentPage = 'compramos-lote';
        $pageTitle = $cat['title'];
        $pageDescription = $cat['description'];
        $pageKeywords = $cat['keywords'];
        $canonicalUrl = SITE_URL . '/' . $cat['slug'];
        $ogImage = SITE_URL . '/notebook.webp';
        $hubUrl = SITE_URL . '/compramos-lote-de-informatica';

        // Páginas irmãs para o bloco de links internos
        $relacionadas = [];
        foreach ($cats as $k => $c) {
            if ($k === $key) continue;
            $relacionadas[] = ['url' => '/' . $c['slug'], 'label' => $c['nav']];
        }

        $faqLd = array_map(fn($f) => [
            '@type' => 'Question',
            'name' => $f[0],
            'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f[1]],
        ], $cat['faq']);

        $extraHead = '<script type="application/ld+json">' . json_encode([
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'WebPage',
                    '@id' => $canonicalUrl . '#webpage',
                    'url' => $canonicalUrl,
                    'name' => $pageTitle,
                    'description' => $pageDescription,
                    'inLanguage' => 'pt-BR',
                    'isPartOf' => ['@id' => SITE_URL . '/#website'],
                    'breadcrumb' => ['@id' => $canonicalUrl . '#breadcrumb'],
                ],
                [
                    '@type' => 'BreadcrumbList',
                    '@id' => $canonicalUrl . '#breadcrumb',
                    'itemListElement' => [
                        ['@type' => 'ListItem', 'position' => 1, 'name' => 'Início', 'item' => SITE_URL . '/'],
                        ['@type' => 'ListItem', 'position' => 2, 'name' => 'Compramos Lote de Informática', 'item' => $hubUrl],
                        ['@type' => 'ListItem', 'position' => 3, 'name' => $cat['nav'], 'item' => $canonicalUrl],
                    ],
                ],
                [
                    '@type' => 'Service',
                    '@id' => $canonicalUrl . '#service',
                    'name' => $cat['service'],
                    'serviceType' => $cat['service'],
                    'description' => strip_tags($cat['intro']),
                    'provider' => [
                        '@type' => 'LocalBusiness',
                        'name' => 'Altustec',
                        'url' => SITE_URL . '/',
                        'logo' => SITE_URL . '/logo.png',
                        'telephone' => get_setting('contact_phone', '(11) 98775-6034'),
                        'email' => get_setting('contact_email', 'contato@altusci.com.br'),
                        'address' => [
                            '@type' => 'PostalAddress',
                            'streetAddress' => get_setting('contact_address', 'Estrada dos Vados, 551'),
                            'addressLocality' => 'Guarulhos',
                            'addressRegion' => 'SP',
                            'addressCountry' => 'BR',
                        ],
                    ],
                    'areaServed' => [
                        ['@type' => 'State', 'name' => 'São Paulo'],
                        ['@type' => 'City', 'name' => 'São Paulo'],
                        ['@type' => 'Country', 'name' => 'Brasil'],
                    ],
                    'isRelatedTo' => ['@id' => $hubUrl . '#service'],
                ],
                [
                    '@type' => 'FAQPage',
                    '@id' => $canonicalUrl . '#faq',
                    'mainEntity' => $faqLd,
                ],
            ],
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>';

        $contentTemplate = BASE_PATH . '/templates/public/compra_categoria_content.php';
        include BASE_PATH . '/templates/layouts/public.php';
    }

    public function pendriveBootavel(): void {
        $pageTitle = 'Como Criar um Pendrive Bootável do Mac no Windows - Altustec';
        $pageDescription = 'Aprenda passo a passo como criar um pendrive bootável do macOS usando um computador com Windows.';
        $contentTemplate = BASE_PATH . '/templates/public/pendrive_content.php';
        include BASE_PATH . '/templates/layouts/public.php';
    }

    public function privacidade(): void {
        $pageTitle = 'Política de Privacidade - Altustec';
        $pageDescription = 'Política de Privacidade da Altustec. Saiba como coletamos, usamos e protegemos suas informações pessoais.';
        $contentTemplate = BASE_PATH . '/templates/public/privacidade_content.php';
        include BASE_PATH . '/templates/layouts/public.php';
    }

    public function sitemap(): void {
        header('Content-Type: application/xml; charset=utf-8');

        $db = get_db();
        $posts = $db->query("SELECT slug, updated_at FROM blog_posts WHERE active = 1 ORDER BY updated_at DESC")->fetchAll();

        $baseUrl = SITE_URL;

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Páginas estáticas
        $staticPages = [
            ['/', '1.0', 'weekly'],
            ['/servicos', '0.8', 'monthly'],
            ['/contato', '0.7', 'monthly'],
            ['/compramos-seu-notebook-usado', '0.8', 'monthly'],
            ['/compramos-lote-de-informatica', '0.8', 'monthly'],
            ['/como-criar-um-pendrive-bootavel-do-mac-no-windows', '0.6', 'yearly'],
            ['/blog', '0.9', 'daily'],
            ['/politica-de-privacidade', '0.3', 'yearly'],
        ];

        // Páginas auxiliares do silo "Compramos Lote de Informática"
        foreach (self::compraCategorias() as $c) {
            $staticPages[] = ['/' . $c['slug'], '0.7', 'monthly'];
        }

        foreach ($staticPages as $sp) {
            echo "  <url>\n";
            echo "    <loc>{$baseUrl}{$sp[0]}</loc>\n";
            echo "    <priority>{$sp[1]}</priority>\n";
            echo "    <changefreq>{$sp[2]}</changefreq>\n";
            echo "  </url>\n";
        }

        // Blog posts
        foreach ($posts as $post) {
            $lastmod = date('Y-m-d', strtotime($post['updated_at']));
            echo "  <url>\n";
            echo "    <loc>{$baseUrl}/blog/" . htmlspecialchars($post['slug']) . "</loc>\n";
            echo "    <lastmod>{$lastmod}</lastmod>\n";
            echo "    <priority>0.7</priority>\n";
            echo "    <changefreq>monthly</changefreq>\n";
            echo "  </url>\n";
        }

        echo '</urlset>';
        exit;
    }
}
