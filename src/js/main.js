$(document).ready(function () {

  if (window._agradadigitalInit) return;
  window._agradadigitalInit = true;

  // ── Hamburger ──────────────────────────────
  $('.hamburger').on('click', function () {
    var $btn = $(this), $nav = $('.mobile-nav'), isOpen = $btn.hasClass('open');
    $btn.toggleClass('open').attr('aria-expanded', !isOpen);
    $nav.toggleClass('open').attr('aria-hidden', isOpen);
  });

  // ── Dropdowns ──────────────────────────────
  $('.nav-dropdown .action-btn').on('click', function (e) {
    e.stopPropagation();
    var $btn = $(this), $box = $btn.siblings('.dropdown-box'), isOpen = $box.hasClass('open');
    $('.dropdown-box').removeClass('open');
    $('.action-btn').attr('aria-expanded', 'false');
    if (!isOpen) { $box.addClass('open'); $btn.attr('aria-expanded', 'true'); }
  });
  $(document).on('click', function () {
    $('.dropdown-box').removeClass('open');
    $('.action-btn').attr('aria-expanded', 'false');
  });
  $('.dropdown-box').on('click', function (e) { e.stopPropagation(); });

  // ── Renderiza card de produto ───────────────
  function renderCard(produto) {
    return `
      <div class="product-card">
        <div class="product-img-wrap">
          <img src="${produto.img}" alt="${produto.alt}" loading="lazy" />
        </div>
        <div class="product-info">
          <h3 class="product-name">${produto.nome}</h3>
          <div class="product-price">
            <span class="price-from">${produto.preco_de}</span>
            <span class="price-main">${produto.preco_por}</span>
            <span class="price-installment">${produto.parcelas}</span>
          </div>
          <button class="btn-comprar">Comprar</button>
        </div>
      </div>`;
  }

  // ── Inicializa Slick ────────────────────────
  function initCarousel($section) {
    var $c = $section.find('.vitrine-carousel');
    $c.css('visibility', 'hidden');
    $c.slick({
      slidesToShow: 4, slidesToScroll: 1, arrows: true, dots: false, infinite: true, speed: 400, cssEase: 'ease',
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 3 } },
        { breakpoint: 768,  settings: { slidesToShow: 2, dots: true, arrows: false } },
        { breakpoint: 480,  settings: { slidesToShow: 1, dots: true, arrows: false } }
      ]
    });
    $c.css('visibility', 'visible');
  }

  // ── Carrega produtos e monta vitrines ───────
  $.getJSON('src/img/produtos.json', function (produtos) {

    // Monta os cards no carousel original
    var html = produtos.map(renderCard).join('');
    $('#vitrine-carousel').html(html);

    // Clona a seção ANTES de inicializar o Slick
    var $originalSection = $('.vitrine-section').first();
    var $cloneSection = $originalSection.clone(false).addClass('is-clone');
    $('footer.site-footer').before($cloneSection);

    // Inicializa Slick nas duas
    initCarousel($originalSection);
    initCarousel($cloneSection);

  }).fail(function () {
    console.error('Erro ao carregar produtos.json');
  });

  // ── Modal + Contador carrinho ───────────────
  var cartCount = 0;
  var modalTimer;

  $(document).on('click', '.btn-comprar', function () {
    cartCount++;
    $('.cart-badge').text(cartCount).show().addClass('bump');
    $('.cart-count-mobile').text(cartCount);
    setTimeout(function () { $('.cart-badge').removeClass('bump'); }, 300);

    clearTimeout(modalTimer);
    var $m = $('#modal-carrinho');
    $m.addClass('visible').stop(true, true).fadeIn(200);
    modalTimer = setTimeout(function () {
      $m.fadeOut(300, function () { $m.removeClass('visible'); });
    }, 2200);
  });

  $('#modal-carrinho').on('click', function (e) {
    if ($(e.target).is(this)) {
      clearTimeout(modalTimer);
      $(this).fadeOut(200, function () { $(this).removeClass('visible'); });
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      clearTimeout(modalTimer);
      $('#modal-carrinho').fadeOut(200, function () { $(this).removeClass('visible'); });
    }
  });

});